// 这是一个假的QCEngine
// 通过quantum-circuit实现的
// https://github.com/quantastica/quantum-circuit
// 文档: https://quantum-circuit.com/docs/quantum_circuit

// QCEngine的文档
// https://oreilly-qc.github.io/docs/build/index.html
// QCEngine的案例代码
// https://oreilly-qc.github.io/?p=2-4




// let QuantumCircuit = require('../resource/js/quantum-circuit.min.js')
import QuantumCircuit from './QuantumCircuit'

// 单个qubit的第几个转换为qcEngine里面的二进制
function int2binary(qubit){
    return 2**qubit
}

// int转换为二进制
function binary(num) {
    //定义变量存放字符串
    var result = [];
    while (true) {
        //取余
        var remiander = num % 2;
        //将余数倒序放入结果中
        result = [remiander,  ...result];//+是字符串的拼接
        //求每次除2的商
        num = ~~(num / 2);
        // num= num>>1;
        if (num === 0)
            break;
    }
    return result;
}

// 二进制计算哪几位为1
function binary2index1(binary_index){
    binary_index = binary(binary_index)
    let int_indexs = []
    for(let i = 0; i < binary_index.length; i++){
        if(binary_index[i] == 1){
            int_indexs.push(binary_index.length - i)
        }
    }
    return int_indexs  // 确定下是不是从小到大
}

function range(start, end){
    let array = []

    for(let i = start; i < end; i++){
        array.push(i)
    }

    return array
}

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
        this.qubit_has_write = {}
        
        this.operations = []  // 记录
    }


    // We always begin by specifying how many qubits we want to associate with our QPU using the qc.reset() method. For example, we could prepare ourselves for a simulation of an 8-qubit QPU as follows:
    // // Request 8 qubits for simulation in our QPU
    // qc.reset(8);

    reset(qubit_number) {
        this.qubit_number = qubit_number
        this.circuit = new QuantumCircuit(qubit_number);
        // 比特全部设为0
    }

    // Considered together these 8 qubits can represent any 8-bit number (or, of course, superpositions of such numbers). Before we begin operating on these qubits we can initialize them to be a binary encoding of some integer value using the qc.write() method:

    // // Write the value 120 to our 8 qubits (01111000)
    // qc.reset(8);
    // qc.write(120);

    // SIWEI:现在规定一个qubit只能write一次, 这和原来的不一样，需要改代码
    // binary_qubits指的是二进制表示的qubit位
    write(value, binary_qubits = undefined) {
        const {inital_value, qubit_number, qubit_has_write} = this
        // 补齐到应该有的长度
        for(let i = inital_value.length; i < qubit_number; i++) {
            inital_value.push(0)
        }

        let qubit_value = binary(value)
        let qubits = this.parseBinaryQubits(binary_qubits)
        qubits.forEach((qubit, index)=>{
            if(qubit_has_write[qubit]){
                console.error(qubit, "has been written")
                debugger
            }
            inital_value[qubit] = qubit_value[index]
            qubit_has_write[qubit] = true
        })
    }

    parseBinaryQubits(binary_qubits) {
        if(binary_qubits != undefined)
            return binary2index1(binary_qubits)
        else
            return range(0, this.qubit_number)  // 从0开始的0-qubit number - 1
    }

    _addGate(gate){
        const {circuit, operations} = this
        const index = operations.length
        const {columns, operation} = gate

        if(columns == undefined){
            console.error(gate, 'not has columns')
            debugger
        }
        if(operation == undefined){
            console.error(gate, 'not has operation')
            debugger
        }

        operations.push({
            gate,
            'index': index,
        })
    }

    // 啥是discard
    discard(){

    }

    // 给某一段打个标签, 是用于前端的
    label(label) {

    }

    // Hadamard Operation
    had(binary_qubits = undefined) {
        const {circuit, operations, now_column} = this
        const qubits = this.parseBinaryQubits(binary_qubits)

        // 未来计算和绘图分开
        qubits.forEach(qubit => {
            circuit.addGate('h', now_column, qubit);  // column = -1表示默认插到最后一个
        })
        this.now_column++

        this._addGate({
            'qubits': qubits,
            'operation': 'h',
            'columns': [now_column, this.now_column],
        })
    }

    // measure
    read(binary_qubits = undefined){
        const {operations, circuit, now_column} = this
        let qubits = this.parseBinaryQubits(binary_qubits)
        
        qubits.forEach((qubit, index) => {
            circuit.addGate("measure", now_column, qubit, { 'creg': { 'name': now_column, 'bit': index} })
        })
        this.now_column++

        this._addGate({
            'qubits': qubits,
            'operation': 'read',
            'column': now_column
        })
        return  circuit.getCregValue(now_column); //返回一个int值, 只考虑new的
    }

    // phase门
    phase(rotation, binary_qubits=undefined){
        const {operations, circuit} = this
        let qubits = binary2index1(binary_qubits)
        this._addGate({
            'qubits': qubits,
            'operation': 'phase',
            'rotation': rotation,  // TODO: °还是π得确定一下
        })
    }

    cnot(binary_control, binary_target){
        const {operations, circuit} = this
        let control = this.parseBinaryQubits(binary_control)
        let target = this.parseBinaryQubits(binary_target)

        // TODO: 允许多个吗
        this._addGate({
            'control': control,
            'target': target,
            'operation': 'cnot',
        })
    }

    // 啥事都不干，就空一格
    nop(){
        const {operations, circuit} = this
        this._addGate({
            'operation': 'noop',
        })
    }

    new(qubit_number, name = undefined){
        let start_index = this.assigned_qubit_number
        this.assigned_qubit_number += qubit_number
        let end_index = this.assigned_qubit_number
        let index = [start_index, end_index]

        if(name)
            this.name2index[name] = index

        return index        
    }
}

class QCIntGenerator{
    constructor(qc){
        this.qc = qc  //上一级的必须是一个qcengine
    }

    new(qubit_number, qint_name = undefined){
        const {qc, binary_index} = this
        let index = qc.new(qubit_number, qint_name)   //index 是数组
        let qint = new QInt(qc, index, qint_name)
        return qint
    }
}

class QInt{
    constructor(qc, index, name){
        this.qc = qc  //上一级的必须是一个qcengine
        this.name = name
        this.index = index
        this.binary_index = range(...index).reduce((sum, val) => sum | int2binary(val), 0)  //TODO:check一下对不对
        // debugger
        // 0 0x1
        // 1 0x2
    }

    write(value){
        const {qc, binary_index} = this
        qc.write(value, binary_index)
    }

    had(){
        const {qc, binary_index} = this
        qc.had(binary_index)
    }

    add(other_qint){
        const {qc, binary_index} = this
    }

    // read的应该不是数组
    read(){
        const {qc, binary_index} = this
        return qc.read(binary_index)
    }

    write(value) {
        let {qc, binary_index} = this
        qc.write(value, binary_index)
    }

    exchange(another_qint){
        let {qc, index} = this
    }

    cphase(another_qint){
        let {qc, index} = this
    }

    // https://oreilly-qc.github.io/?p=7-8#
    invQFT(){

    }

    QFT(){

    }
}
    // TODO: ccnot, cccnot 也要加

export { 
    QInt,

}