import { create, all } from 'mathjs'
import { getRawGateNcphase, getRawGateNCNOT, getRawGateIdentity, getRawGateState, getRawGatecphase} from './MyGate'

let QuantumCircuit = require('../resource/js/quantum-circuit.min.js')

// let QuantumCircuit = require('../resource/js/quantum-circuit.js')

// let QuantumCircuit = require('../resource/js/my_quantum-circuit.min.js')

// 把原先的run拆成了一个column一步的
// create a mathjs instance
const math = create(all)

QuantumCircuit.prototype.my_session = {}

QuantumCircuit.prototype.myStartRun = function (initialValues, options) {
	console.log('Starting')
	// debugger
	options = options || {}

	// siwei: 被我强制设置了, 测量后会坍缩到对应值
	this.measureResetsQubit = true // !!options.strictMode;

	if (!options.continue) {
		this.initState()
		this.stats.duration = 0
	}

	if (options.initialState) {
		if (Array.isArray(options.initialState)) {
			this.state = {}
			for (var valIndex = 0; valIndex < options.initialState.length; valIndex++) {
				var val = options.initialState[valIndex]

				if (Array.isArray(val) && val.length == 2) {
					val = math.complex(val[0], val[1])
				}

				if (typeof val == 'string') {
					val = this.evalMathString(val)
				}
				if (typeof val == 'number') {
					val = math.complex(val, 0)
				}
				this.state[valIndex + ''] = val
			}
		} else {
			this.state = options.initialState
		}

		this.stateBits = 0
		for (var aindex in this.state) {
			this.stateBits |= parseInt(aindex)
		}
	}

	this.stats.start = new Date()

	var decomposed = new QuantumCircuit()
	decomposed.load(this.save(true))

	if (initialValues) {
		decomposed.insertColumn(0)
		for (var wire = 0; wire < decomposed.numQubits; wire++) {
			if (initialValues[wire]) {
				decomposed.addGate('x', 0, wire, {})
			}
		}
	}

	const partitioning = options.partitioning

	if (partitioning) {
		decomposed.createPartitions()
		console.warn("I don't expect the partitioning actually") //还没有考虑这样绘出啥事情
		debugger
		//		decomposed.printPartitions();
	}

	let gateCounter = 0
	let column = 0
	this.my_session = {
		gateCounter,
		column,
		options,
		decomposed,
		partitioning,
	}

	return this.stateAsArray()
}

QuantumCircuit.prototype.myStepRun = function () {
	const { my_session } = this
	const { options, partitioning } = my_session
	let { column } = my_session
	let rawgate;
	// 每次都要重新加载一下，因为后面在加东西，这要保证之前的都没有被改!!
	const decomposed = new QuantumCircuit()
	decomposed.load(this.save(true))
	const numCols = decomposed.numCols()

	if (column > numCols) {
		console.warn(column, 'is out of the circuit')
		debugger
	}
	// 不是加一，应该是跑到现在的所有
	for (; column < numCols; column++) {
		for (var wire = 0; wire < decomposed.numQubits; wire++) {
			var gate = decomposed.getGateAt(column, wire)
			if (gate && gate.connector == 0) {
				my_session['gateCounter']++

				// debugger
				var executeGate = true // 用来快反的
				if (gate.options && gate.options.condition && gate.options.condition.creg) {
					var cregValue = this.getCregValue(gate.options.condition.creg)
					executeGate = cregValue === gate.options.condition.value
				}

				if (executeGate) {
					if (partitioning) {
						var partition = decomposed.partitionMap[wire][column]
						if (!decomposed.partitionCache[partition]) {
							decomposed.partitionCache[partition] = decomposed.partitionCircuit(partition)
						}

						var pcirc = decomposed.partitionCache[partition]
						var bounds = decomposed.partitionInfo[partition]

						var pcolumn = column - bounds.column.left

						var pgate = pcirc.getGateAt(pcolumn, bounds.wireMap[wire])

						pcirc.cregs = JSON.parse(JSON.stringify(this.cregs))
						pcirc.applyGate(pgate.name, pcolumn, pgate.wires, pgate.options)
						this.cregs = JSON.parse(JSON.stringify(pcirc.cregs))
					} else {
						rawgate = this.applyGate(gate.name, column, gate.wires, gate.options);
						//console.log("not step run",rawgate);
					}
				}

				// callback after gate is finished
				if (options && options.onGate) {
					options.onGate(column, wire, my_session['gateCounter'])
				}
			}
		}

		// callback after column is finished
		if (options && options.onColumn) {
			options.onColumn(column)
		}
		//console.log("once");
	}

	my_session['column'] = column
	//console.log("not step run",rawgate);
	let res = {};
	res['state'] = this.stateAsArray();
	res['rawgate'] = rawgate;
	
	return res;
}

QuantumCircuit.prototype.myEndRun = function () {
	const { my_session } = this
	const { options, decomposed, partitioning } = my_session
	const numCols = decomposed.numCols()

	if (partitioning) {
		var lastPartitions = []
		for (var wire = 0; wire < decomposed.numQubits; wire++) {
			var partition = decomposed.partitionMap[wire][numCols - 1]
			if (partition >= 0 && lastPartitions.indexOf(partition) < 0) {
				lastPartitions.push(partition)
			}
		}
		if (lastPartitions.length) {
			if (lastPartitions.length == 1) {
				this.state = decomposed.partitionCache[lastPartitions[0]].state
				this.stateBits = decomposed.partitionCache[lastPartitions[0]].stateBits
			} else {
				var startTime = this.stats.start
				var combineList = []
				for (var i = 0; i < lastPartitions.length; i++) {
					var lastPartition = lastPartitions[i]

					var combineItem = {}

					combineItem.circuit = decomposed.partitionCache[lastPartition]
					combineItem.wires = []

					var lastBounds = decomposed.partitionInfo[lastPartition]
					for (var wire in lastBounds.wireMap) {
						combineItem.wires.push(parseInt(wire))
					}

					combineList.push(combineItem)
				}
				this.setCombinedState(combineList)
				this.stats.start = startTime
			}
		}
	}

	this.stats.end = new Date()
	this.stats.duration += this.stats.end - this.stats.start
}

// 接下来的都是直接扒下来的用来做实验的
QuantumCircuit.prototype.myAllRun = function (initialValues, options) {
	debugger

	options = options || {}

	this.measureResetsQubit = !!options.strictMode

	if (!options.continue) {
		this.initState()
		this.stats.duration = 0
	}

	if (options.initialState) {
		if (Array.isArray(options.initialState)) {
			this.state = {}
			for (var valIndex = 0; valIndex < options.initialState.length; valIndex++) {
				var val = options.initialState[valIndex]

				if (Array.isArray(val) && val.length == 2) {
					val = math.complex(val[0], val[1])
				}

				if (typeof val == 'string') {
					val = this.evalMathString(val)
				}
				if (typeof val == 'number') {
					val = math.complex(val, 0)
				}
				this.state[valIndex + ''] = val
			}
		} else {
			this.state = options.initialState
		}

		this.stateBits = 0
		for (var aindex in this.state) {
			this.stateBits |= parseInt(aindex)
		}
	}

	this.stats.start = new Date()

	var decomposed = new QuantumCircuit()
	decomposed.load(this.save(true))

	if (initialValues) {
		decomposed.insertColumn(0)
		for (var wire = 0; wire < decomposed.numQubits; wire++) {
			if (initialValues[wire]) {
				decomposed.addGate('x', 0, wire, {})
			}
		}
	}
	// 前面都是初始化的
	var partitioning = options.partitioning

	if (partitioning) {
		decomposed.createPartitions()
		//		decomposed.printPartitions();
	}

	var numCols = decomposed.numCols()
	var gateCounter = 0
	for (var column = 0; column < numCols; column++) {
		for (var wire = 0; wire < decomposed.numQubits; wire++) {
			var gate = decomposed.getGateAt(column, wire)
			if (gate && gate.connector == 0) {
				gateCounter++

				var executeGate = true
				if (gate.options && gate.options.condition && gate.options.condition.creg) {
					var cregValue = this.getCregValue(gate.options.condition.creg)
					executeGate = cregValue === gate.options.condition.value
				}

				if (executeGate) {
					if (partitioning) {
						var partition = decomposed.partitionMap[wire][column]
						if (!decomposed.partitionCache[partition]) {
							decomposed.partitionCache[partition] = decomposed.partitionCircuit(partition)
						}

						var pcirc = decomposed.partitionCache[partition]
						var bounds = decomposed.partitionInfo[partition]

						var pcolumn = column - bounds.column.left

						var pgate = pcirc.getGateAt(pcolumn, bounds.wireMap[wire])

						pcirc.cregs = JSON.parse(JSON.stringify(this.cregs))
						pcirc.applyGate(pgate.name, pcolumn, pgate.wires, pgate.options)
						this.cregs = JSON.parse(JSON.stringify(pcirc.cregs))
					} else {
						this.applyGate(gate.name, column, gate.wires, gate.options)
					}
				}

				// callback after gate is finished
				if (options && options.onGate) {
					options.onGate(column, wire, gateCounter)
				}
			}
		}
		// callback after column is finished
		if (options && options.onColumn) {
			options.onColumn(column)
		}
		// siwei add
		console.log(this.stateAsArray())
	}

	if (partitioning) {
		var lastPartitions = []
		for (var wire = 0; wire < decomposed.numQubits; wire++) {
			var partition = decomposed.partitionMap[wire][numCols - 1]
			if (partition >= 0 && lastPartitions.indexOf(partition) < 0) {
				lastPartitions.push(partition)
			}
		}
		if (lastPartitions.length) {
			if (lastPartitions.length == 1) {
				this.state = decomposed.partitionCache[lastPartitions[0]].state
				this.stateBits = decomposed.partitionCache[lastPartitions[0]].stateBits
			} else {
				var startTime = this.stats.start
				var combineList = []
				for (var i = 0; i < lastPartitions.length; i++) {
					var lastPartition = lastPartitions[i]

					var combineItem = {}

					combineItem.circuit = decomposed.partitionCache[lastPartition]
					combineItem.wires = []

					var lastBounds = decomposed.partitionInfo[lastPartition]
					for (var wire in lastBounds.wireMap) {
						combineItem.wires.push(parseInt(wire))
					}

					combineList.push(combineItem)
				}
				this.setCombinedState(combineList)
				this.stats.start = startTime
			}
		}
	}

	this.stats.end = new Date()
	this.stats.duration += this.stats.end - this.stats.start
}

QuantumCircuit.prototype.siwei_define_gate = {
	ncphase: getRawGateNcphase,
	ncnot: getRawGateNCNOT,
	identity: getRawGateIdentity,
	StateGate: getRawGateState,
	cphase: getRawGatecphase,
}

// 拿到门矩阵和对应的比特，作用于State
QuantumCircuit.prototype.applyTransform = function (U, qubits) {
	var newState = {}
	var newStateBits = 0

	// clone list of wires to itself (remove reference to original array)
	qubits = qubits.slice(0)

	// reverse bit order
	if (this.reverseBitOrder) {
		// convert index from 0-based to end-based
		for (var i = 0; i < qubits.length; i++) {
			qubits[i] = this.numQubits - 1 - qubits[i]
		}
	}

	qubits.reverse()

	// list of wires not used by this gate
	var unused = []
	for (var i = 0; i < this.numQubits; i++) {
		if (qubits.indexOf(i) < 0) {
			unused.push(i)
		}
	}

	var unusedCount = unused.length
	var unusedSpace = 1 << unusedCount

	function getElMask(el) {
		var res = 0
		qubits.map(function (qubit, index) {
			if (el & (1 << index)) {
				res |= 1 << qubit
			}
		})
		return res
	}

	function getIncMask() {
		var res = 0
		qubits.map(function (qubit, index) {
			res |= 1 << qubit
		})
		return res + 1
	}

	function getNotMask() {
		var res = 0
		unused.map(function (qubit, index) {
			res |= 1 << qubit
		})
		return res
	}

	var ZERO = math.complex(0, 0)

	// debugger
	for (var elrow = 0; elrow < U.length; elrow++) {
		var rowmask = getElMask(elrow)

		for (var elcol = 0; elcol < U[elrow].length; elcol++) {
			var colmask = getElMask(elcol)

			if ((this.stateBits & colmask) == colmask) {
				var uval = U[elrow][elcol]
				if (uval) {
					var row = rowmask
					var col = colmask

					var counter = unusedSpace
					var countermask = getElMask(0)
					var incmask = getIncMask()
					var notmask = getNotMask()
					var toothless = countermask
					while (counter--) {
						var state = this.state[col]
						if (state) {
							row = toothless | rowmask

							if (uval == 1) {
								newState[row] = math.add(newState[row] || ZERO, state)
							} else {
								newState[row] = math.add(newState[row] || ZERO, math.multiply(uval, state))
							}
							newStateBits |= row
						}

						toothless = (toothless + incmask) & notmask
						col = toothless | colmask
					}
				}
			}
		}
	}
	// replace current state with new state
	this.state = newState
	this.stateBits = newStateBits

	if (this.stateBits == 0 && Object.keys(this.state).length == 0) {
		this.state['0'] = math.complex(1, 0)
	}
}

// 计算门矩阵的向量准备计算
QuantumCircuit.prototype.applyGate = function (gateName, column, wires, options) {
	if (gateName == 'measure') {
		if (!options.creg) {
			throw 'Error: "measure" gate requires destination.'
		}

		var value = this.measure(wires[0], options.creg.name, options.creg.bit)

		var doReset = this.measureResetsQubit
		if (!doReset) {
			for (var col = column; col < this.numCols(); col++) {
				var fromRow = col == column ? wires[0] : 0
				for (var row = fromRow; row < this.numQubits; row++) {
					var g = this.gates[row][col]
					if (g && g.name != 'measure') {
						doReset = true
						break
					}
				}
				if (doReset) {
					break
				}
			}
		}

		if (doReset) {
			this.resetQubit(wires[0], value)
		}

		return
	}

	if (gateName == 'reset') {
		this.resetQubit(wires[0], 0)
		return
	}
	
	var gate = this.siwei_define_gate[gateName]
	var rawGate = undefined
	if (gate) {
		// 自定义的
		// 
		rawGate = gate(options.params)
	} else {
		// 原先的
		gate = this.basicGates[gateName]
		if (!gate) {
			console.log('Unknown gate "' + gateName + '".')
			return
		}

		rawGate = this.getRawGate(gate, options) //拿到了对应的矩阵的向量，应该没有考虑作用的比特
	}

	// 已经是具体值
	// debugger
	this.collapsed = []
	this.prob = []

	// console.log(rawGate, wires)
	this.applyTransform(rawGate, wires)
	return rawGate;
}

QuantumCircuit.prototype.getGateMatrix = function (gate_name, options = {}) {
	var gate = this.basicGates[gate_name] //拿到对应文字的部分
	var rawGate = this.getRawGate(gate, options) //拿到了对应的矩阵的向量，应该没有考虑作用的比特
	return rawGate
}

export default QuantumCircuit
