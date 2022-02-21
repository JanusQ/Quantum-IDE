import { cos, sin, round, pi, complex } from 'mathjs'
import d3Draw from './D3Draw'
// import { create, all } from 'mathjs'
// const math = create(all)
const options = {
	write1Background: 'yellow',
	write1FontColor: 'blue',
	write0FontColor: 'blue'
}
const d3 = new d3Draw(options)
function showInDebuggerArea(circuit) {
	// SVG is returned as string
	let svg = circuit.exportSVG(true)
	// console.log(svg)
	let container = document.getElementById('d3_drawing') //index.html里面预留的部分

	// add SVG into container
	container.innerHTML = svg
}
function exportSVG(qc) {
	const options = {
		data: qc,
	}

	d3.exportD3SVG(qc)
}
function createFile(circuit, type) {
	let file
	if (type === 'svg') {
		file = circuit.exportSVG(true)
	} else if (type === 'js') {
		file = circuit.exportJavaScript('', true)
	}
	return file
}

// 单个qubit的位数转换为qcEngine里面的二进制
function pow2(qubit) {
	return 2 ** qubit
}

// int转换为二进制
function binary(num, qubit_num = 0) {
	//定义变量存放字符串
	let result = []
	while (true) {
		//取余
		let remiander = num % 2
		//将余数倒序放入结果中
		result = [remiander, ...result] //+是字符串的拼接
		//求每次除2的商
		num = ~~(num / 2)
		// num= num>>1;
		if (num === 0) break
	}
	// console.log(num, result)
	return [...range(0, qubit_num - result.length).map((_) => 0), ...result]
}

function binary2int(binary) {
	let value = 0
	binary.forEach((elm, index) => {
		if (elm == 1) {
			value += 2 ** (binary.length - index - 1)
		}
	})
	return value
}

// 二进制计算qubit为1的状态的位数
function binary2qubit1(state_value) {
	let qubit2value = binary(state_value)
	let qubits = []
	for (let qubit = 0; qubit < qubit2value.length; qubit++) {
		if (qubit2value[qubit] == 1) {
			qubits.push(qubit2value.length - qubit - 1)
		}
	}

	// 小的在后
	qubits.sort()
	qubits.reverse()

	return qubits // 确定下是不是从小到大
}

// 转成qcengine的格式
function qubit12binary(qubits) {
	return qubits.reduce((sum, val) => sum | pow2(val), 0)
}

function range(start, end, reverse = false) {
	let array = []

	for (let i = start; i < end; i++) {
		array.push(i)
	}

	if (reverse) {
		array.reverse()
	}
	return array
}

function toPI(rotation) {
	return (rotation / 180) * Math.PI
}

// rotation给的是pi的
function getComplex(exp) {
	//{r, phi}
	// debugger
	return complex(exp)
}

function getExp(complex_value) {
	return complex_value.toPolar() //{r, phi}
}

// TODO: 判断这几个比特组成的状态是不是纯态
function isPure(qubits, state) {

}

export {
	pow2,
	binary,
	binary2qubit1,
	range,
	showInDebuggerArea,
	binary2int,
	toPI,
	getComplex,
	getExp,
	qubit12binary,
	createFile,
	exportSVG,
}
