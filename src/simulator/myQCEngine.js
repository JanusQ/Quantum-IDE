// 这是一个假的QCEngine
// 通过quantum-circuit实现的
// https://github.com/quantastica/quantum-circuit
// 文档: https://quantum-circuit.com/docs/quantum_circuit

// QCEngine的文档
// https://oreilly-qc.github.io/docs/build/index.html
// QCEngine的案例代码
// https://oreilly-qc.github.io/?p=2-4


// TODO:check一下binary有没有prepad

// let QuantumCircuit = require('../resource/js/quantum-circuit.min.js')
import { write0, write1 } from './MyGate';
import QuantumCircuit from './QuantumCircuit'
import { pow2, binary, binary2qubit1, range, toPI,} from './CommonFunction'


// 统一规定高位在后

// 描述和计算可以分开
export default class QCEngine {
    constructor() {
        this.circuit = undefined
        this.now_column = 0  // 记录了quantum circuit里面当前的用到的column

        this.qint = new QCIntGenerator(this)

        this.qubit_number = undefined
        this.assigned_qubit_number = 0

        this.name2index = {}
        this.inital_value = []

        this.operations = []  // 记录

        this.labels = [
            // {
            //     operations: [],  #存的是左开右闭的对应的label,对应的是operation的index
            //     text: ""
            // }
        ]
        this._last_label_operation = 0
    }


    // We always begin by specifying how many qubits we want to associate with our QPU using the qc.reset() method. For example, we could prepare ourselves for a simulation of an 8-qubit QPU as follows:
    // // Request 8 qubits for simulation in our QPU
    // qc.reset(8);

    // TODO: 先暂时不输出反馈，直接用if else来执行反馈吧
    reset(qubit_number) {
        const {inital_value} = this

        if(this.qubit_number !== undefined){
            console.error('the circuit has been reseted twice')
            debugger
        }

        this.qubit_number = qubit_number
        this.circuit = new QuantumCircuit(qubit_number);
        // 比特全部设为0
        // 添加自定义的
        this.circuit.registerGate("write0", write0);
        this.circuit.registerGate("write1", write1);

        for (let i = 0; i < qubit_number; i++) {
            inital_value.push(0)
        }
        this.circuit.myStartRun()
    }

    // Considered together these 8 qubits can represent any 8-bit number (or, of course, superpositions of such numbers). Before we begin operating on these qubits we can initialize them to be a binary encoding of some integer value using the qc.write() method:

    // // Write the value 120 to our 8 qubits (01111000)
    // qc.reset(8);
    // qc.write(120);

    // SIWEI:现在规定一个qubit只能write一次, 这和原来的不一样，需要改代码
    // binary_qubits指的是二进制表示的qubit位
    write(value, binary_qubits = undefined) {
        const { inital_value, qubit_number, now_column } = this
        // 补齐到应该有的长度
        // for (let i = inital_value.length; i < qubit_number; i++) {
        //     inital_value.push(0)
        // }


        let qubits = this.parseBinaryQubits(binary_qubits)
        let qubit_value = binary(value, qubits.length)

        if(Math.max(...qubits) >= qubit_number){
            console.error('qubits has unexist qubit', qubits.filter(qubit=> qubit>=qubit_number))
            debugger
        }

        let column_range =  this.nextColumn()
        qubits.forEach((qubit, index) => {
            let value = qubit_value[index]
            inital_value[qubit] = value
            // this.circuit.addGate()
            if (value == 0) {
                this.circuit.addGate('write0', now_column, [qubit])
            } else {
                this.circuit.addGate('write0', now_column, [qubit])
            }
        })
        this._addGate({
            'qubits': qubits,
            'operation': 'write',
            'columns': column_range,
        })
    }

    parseBinaryQubits(binary_qubits) {
        if (binary_qubits != undefined)
            return binary2qubit1(binary_qubits)
        else{
            return range(0, this.qubit_number, true)  // 从0开始的0-qubit number - 1
        }
    }

    _addGate(gate) {
        const { circuit, operations } = this
        const index = operations.length
        const { columns, operation } = gate

        const {state} = this._circuitStep()


        // columns是左开又闭的, 存的是quantum circuit库中的对应关系
        if (columns == undefined) {
            console.error(gate, 'not has columns')
            debugger
        }

        if (operation == undefined) {
            console.error(gate, 'not has operation')
            debugger
        }

        operations.push({
            gate,
            'index': index,  //操作的index
            'state_after_opertaion': state,
        })
    }

    // 跑一步返回并返回当前的状态
    _circuitStep(){
        const { circuit, operations } = this
        // 之后应该还会返回门矩阵等信息
        return {
            state: circuit.myStepRun(), 
        }
    }


    // 啥是discard
    // 应该就是空一格
    discard() {
        this.nop()
    }

    // 给某一段打个标签, 是用于前端的
    label(label) {
        const {_last_label_operation, labels, operations} = this
        labels.push({
            operations: [_last_label_operation, operations.length],
            text: label,
        })
        this._last_label_operation = operations.length
    }

    // Hadamard Operation
    had(binary_qubits = undefined) {
        const { circuit, operations, now_column } = this
        const qubits = this.parseBinaryQubits(binary_qubits)

        // 未来计算和绘图分开
        qubits.forEach(qubit => {
            circuit.addGate('h', now_column, qubit);  // column = -1表示默认插到最后一个,最好不要用，会补到前面去
        })

        this._addGate({
            'qubits': qubits,
            'operation': 'h',
            'columns': this.nextColumn(),
        })
    }

    // measure
    read(binary_qubits = undefined) {
        const { operations, circuit, now_column } = this
        let qubits = this.parseBinaryQubits(binary_qubits)

        let reg_name = 'read_' + now_column
        qubits.forEach((qubit, index) => {
            circuit.addGate("measure", now_column, qubit, { 'creg': { 'name': reg_name, 'bit': index } })
        })

        this._addGate({
            'qubits': qubits,
            'operation': 'read',
            'columns': this.nextColumn()
        })

        return circuit.getCregValue(reg_name); //返回一个int值, 只考虑new的
    }

    nextColumn(column_num = 1){
        const { operations, circuit, now_column } = this
        this.now_column += column_num
        return [now_column, this.now_column]
    }

    // phase门
    phase(rotation, binary_qubits = undefined) {
        const { operations, circuit, now_column } = this
        const qubits = binary2qubit1(binary_qubits)

        qubits.forEach(qubit=>{
            circuit.addGate("rz",  now_column, qubit, {
                params: {
                    phi: "pi/" + toPI(rotation)
                }
            });
        })

        this._addGate({
            'qubits': qubits,
            'operation': 'phase',
            'rotation': rotation,  // TODO: °还是π得确定一下
            'columns': this.nextColumn()
        })
    }

    not(binary_qubits = undefined) {
        const { operations, circuit, now_column } = this
        const qubits = binary2qubit1(binary_qubits)
        qubits.forEach(qubit=>{
            circuit.addGate("x",  now_column, qubit);
        })

        this._addGate({
            'qubits': qubits,
            'operation': 'not',
            'columns': this.nextColumn()
        })
    }

    print(){
        console.log('qc_console', arguments)
    }

    cnot(binary_control, binary_target) {
        const { operations, circuit, now_column } = this
        let control = this.parseBinaryQubits(binary_control)
        let target = this.parseBinaryQubits(binary_target)

        if(control.length != 1){
            console.error(control, 'control qubit number is not one')
        }
        if(target.length != 1){
            console.error(target, 'target qubit number is not one')
        }

        circuit.addGate("cx",  now_column, [...control, ...target], );

        // TODO: 允许多个吗
        this._addGate({
            'control': control,
            'target': target,
            'operation': 'cnot',
            'columns': this.nextColumn()
        })
    }

    cphase(rotation, binary_control, binary_target) {
        const { operations, circuit, now_column } = this
        let control = this.parseBinaryQubits(binary_control)
        let target = this.parseBinaryQubits(binary_target)

        if(control.length != 1){
            console.error(control, 'control qubit number is not one')
        }
        if(target.length != 1){
            console.error(target, 'target qubit number is not one')
        }

        circuit.addGate("crz",  now_column, [...control, ...target],  {
            params: {
                phi: "pi/" + toPI(rotation)
            }
        });

        // TODO: 允许多个吗
        this._addGate({
            'control': control,
            'target': target,
            'operation': 'cnot',
            'columns': this.nextColumn()
        })
    }


    // 啥事都不干，就空一格
    nop() {
        const { operations, circuit } = this
        this._addGate({
            'operation': 'noop',
            'columns': this.nextColumn()
        })
    }

    new(qubit_number, name = undefined) {
        let start_index = this.assigned_qubit_number
        this.assigned_qubit_number += qubit_number
        let end_index = this.assigned_qubit_number
        let index = [start_index, end_index]

        if (name)
            this.name2index[name] = index

        return index
    }



}

class QCIntGenerator {
    constructor(qc) {
        this.qc = qc  //上一级的必须是一个qcengine
    }

    new(qubit_number, qint_name = undefined) {
        const { qc, binary_index } = this
        let index = qc.new(qubit_number, qint_name)   //index 是数组
        let qint = new QInt(qc, index, qint_name)
        return qint
    }
}

class QInt {
    constructor(qc, index, name) {
        this.qc = qc  //上一级的必须是一个qcengine
        this.name = name
        this.index = index
        this.binary_index = range(...index).reduce((sum, val) => sum | pow2(val), 0)  //TODO:check一下对不对
        // debugger
        // 0 0x1
        // 1 0x2
    }

    write(value) {
        const { qc, binary_index } = this
        qc.write(value, binary_index)
    }

    had() {
        const { qc, binary_index } = this
        qc.had(binary_index)
    }

    add(other_qint) {
        const { qc, binary_index } = this
    }

    // read的应该不是数组
    read() {
        const { qc, binary_index } = this
        return qc.read(binary_index)
    }

    write(value) {
        let { qc, binary_index } = this
        qc.write(value, binary_index)
    }

    exchange(another_qint) {
        let { qc, binary_index } = this
    }

    cphase(rotation, another_qint) {
        let { qc, binary_index } = this
        qc.cphase(rotation, binary_index, another_qint.binary_index)
    }

    phase(rotation) {
        let { qc, binary_index } = this
        qc.phase(rotation, binary_index)
    }

    not(){
        let { qc, binary_index } = this
        qc.not(binary_index)
    }

    // https://oreilly-qc.github.io/?p=7-8#
    invQFT() {

    }

    QFT() {

    }


}
// TODO: ccnot, cccnot 也要加

export {
    QInt,

}