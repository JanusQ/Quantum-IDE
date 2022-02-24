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
import { pow2, binary, binary2qubit1, range, toPI, qubit12binary, unique, sum, alt_tensor} from './CommonFunction'
import {
    cos, sin, round, pi, complex,
} from 'mathjs'

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
            //     operations: [],  #存的是左闭右开的对应的label,对应的是operation的index
            //     text: ""
            // }
        ]
        this._now_label = undefined

        this.now_state = undefined 
        this.console_data = [] 
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
        const circuit = new QuantumCircuit(qubit_number);
        this.circuit = circuit
        // 比特全部设为0
        // 添加自定义的
        circuit.registerGate("write0", write0);
        circuit.registerGate("write1", write1);

        for (let i = 0; i < qubit_number; i++) {
            inital_value.push(0)
        }
        circuit.myStartRun()

        this.now_state = circuit.stateAsArray()
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
            'value': qubit_value,
            'columns': column_range,
        })
    }


    // TODO: 之后写成二进制或者数组都可以
    // TODO：判断下比特存不存在有没有溢出
    parseBinaryQubits(binary_qubits) {
        if (binary_qubits != undefined)
            return binary2qubit1(binary_qubits)
        else{
            return range(0, this.qubit_number, true)  // 从0开始的0-qubit number - 1
        }
    }

    // 添加并且执行
    _addGate(gate) {
        const { circuit, operations, _now_label } = this
        const index = operations.length
        const { columns, operation } = gate

        const {state} = this._circuitStep()


        // columns是左闭右开的, 存的是quantum circuit库中的对应关系
        if (columns == undefined && gate.operation !== 'noop') {
            console.error(gate, 'not has columns')
            debugger
        }

        if (operation == undefined) {
            console.error(gate, 'not has operation')
            debugger
        }
        
        operations.push({
            ...gate,
            'index': index,  //操作的index
            'state_after_opertaion': state,
            'state_str': circuit.stateAsString(),
            'label_id': _now_label,
        })
        
        this.now_state = state
        return { 
            state
        }
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
        // this.nop()
    }

    label_count = -1
    genLabelId(){
        this.label_count++
        return this.label_count
    }

    // 给某一段打个标签, 是用于前端的
    // 给之后所有的打上标签
    // 如果传入空的就不会被话
    label(label) {
        const {_now_label, labels, operations} = this
        let former_label = labels[labels.length - 1]
        
        if(former_label){
            former_label.end_operation = operations.length  // 右开
        }

        let label_id = this.genLabelId()
        labels.push({
            start_operation: operations.length,  //左闭
            text: label,
            id: label_id
        })
        this._now_label = label_id
    }

    // Hadamard Operation
    had(binary_qubits = undefined) {
        const { circuit, operations, now_column } = this
        const qubits = this.parseBinaryQubits(binary_qubits)

        // 未来计算和绘图分开
        qubits.forEach(qubit => {
            circuit.addGate('h', now_column, qubit);  // column = -1表示默认插到最后一个,最好不要用，会补到前面去
        })

        // debugger
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
        
        // 这里目前唯一除了_addGate外的执行
        this._circuitStep()
        let result = circuit.getCregValue(reg_name); //返回一个int值, 只考虑new的

        this._addGate({
            qubits,
            'operation': 'read',
            'columns': this.nextColumn(),
            reg_name,
            result,
        })

        // read完的state值是不对的
        return result
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
                    phi: "pi/" + (180/rotation)
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
        // debugger
        this.console_data.push(
            [...arguments].map(elm => String(elm)).join('  ')
        )
    }

    // TODO: 判断所有控制门的比特会不会重叠，重叠报错
    checkOverlap(controls, targets){

    }

    // TODO: ccnot 还没有写
    cnot(binary_control, binary_target) {
        const { operations, circuit, now_column } = this
        let control = this.parseBinaryQubits(binary_control)
        let target = this.parseBinaryQubits(binary_target)

        if(control.length != 1){
            console.error(control, 'control qubit number is not one')
            debugger
            control = [control[0]]
        }
        if(target.length != 1){
            console.error(target, 'target qubit number is not one')
            debugger
            target = [target[0]]
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

    // TODO: ncphase 之后直接整理到cphase里面
    cphase(rotation, binary_control, binary_target) {
        const { operations, circuit, now_column } = this
        let control = binary_control? this.parseBinaryQubits(binary_control) : []
        let target = binary_target? this.parseBinaryQubits(binary_target) : []
        let qubits = unique([...control, ...target])

        if(qubits.length === 0){
            console.error('phase\'s qubits number is zero')
            debugger
        }

        // if(control.length != 1){
        //     console.error(control, 'control qubit number is not one')
        //     debugger
        // }
        // if(target.length != 1){
        //     console.error(target, 'target qubit number is not one')
        //     debugger
        // }

        // circuit.addGate("cu1",  now_column, qubits,  {
        //     params: {
        //         lambda: "pi/" + (180/rotation)
        //     }
        // });

        circuit.addGate("ncphase",  now_column, qubits, {
            params: {
                qubit_number: qubits.length,
                phi: toPI(rotation)
            }
        });

        // TODO: 允许多个控制或者多个被控吗
        this._addGate({
            'qubits': [...control, ...target],
            'operation': 'ccphase',
            'columns': this.nextColumn()
        })
    }

    // TODO: 还没有实现，包括ncnot
    ccnot(binary_control, binary_target){
        const { operations, circuit, now_column } = this
        let controls = this.parseBinaryQubits(binary_control)
        let target = this.parseBinaryQubits(binary_target)

        this._addGate({
            'controls': controls,
            'target': target,
            'operation': 'ccnot',
            'columns': this.nextColumn()
        })
    }

    exchange(binary_qubits1, binary_qubits2){
        const { operations, circuit, now_column } = this

        const qubits1 = this.parseBinaryQubits(binary_qubits1)
        const qubits2 = this.parseBinaryQubits(binary_qubits2)

        if(qubits1.length != qubits2.length){
            console.error(qubits1, qubits2, 'do not have same length, which can not be swapped')
            debugger
        }

        qubits1.forEach((qubit1, index) => {
            const qubit2 = qubits2[index]
            this.swap(qubit12binary[qubit1], qubit12binary[qubit2])
        })

    }


    swap(binary_qubit1, binary_qubit2){
        const { operations, circuit, now_column } = this
        const qubit1 = this.parseBinaryQubits(binary_qubit1)
        const qubit2 = this.parseBinaryQubits(binary_qubit2)
        if(qubit1.length != 1 || qubit2.length != 1){
            console.error(qubit1, 'or',qubit2, 'has more than one qubit, which can not be swapped')
            debugger
        }

        circuit.addGate("swap",  now_column, [...qubit1, ...qubit2]);
        this._addGate({
            // qubits1, qubits2实际上只有一个，现在是暂时为之
            'qubits1': qubit1, 
            'qubits2': qubit2,
            'operation': 'swap',
            'columns': this.nextColumn()
        })
    }


    // 啥事都不干，就空一格
    nop() {
        const { operations, circuit } = this
        this._now_label = undefined
        this.label('')
        this._addGate({
            'operation': 'noop',
            'columns': undefined, //this.nextColumn()
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

    apply(gate_name, qubits){
        this._addGate({
            'qubits': qubits, 
            'operation': gate_name,
            'columns': this.nextColumn()
        })
    }


    // 一下都是用来画图的函数
    
    getQubitsInvolved(operation){
        let qubits_involved = []
        const {controls, qubits, qubit, target, targets, qubits1, qubits2, qubit1, qubit2} = operation
        if(target){
            qubits_involved.push(target)
        }
        if(qubit){
            qubits_involved.push(qubit)
        }
        if(qubit1){
            qubits_involved.push(qubit1)
        }
        if(qubit2){
            qubits_involved.push(qubit2)
        }
        qubits_involved = [...qubits_involved, ...(qubits1 || [])]
        qubits_involved = [...qubits_involved, ...(qubits2 || [])]
        qubits_involved = [...qubits_involved, ...(controls || [])]
        qubits_involved = [...qubits_involved, ...(qubits || [])]
        qubits_involved = [...qubits_involved, ...(targets || [])]

        let qubits_involved_set  = [...new Set(qubits_involved)]
        if(qubits_involved_set.length !== qubits_involved.length){
            console.error('operation', operation, 'has repetitive qubit')
            debugger
        }
        return qubits_involved_set
    }

    // 输入一个比特，返回对应的变量，和在变量内部的序号, 没有找到返回undefined, undefined
    getQubit2Variable(qubit){
        const {name2index} = this

        let corresponding_variable = undefined, corresponding_index = undefined
        for(let variable in name2index){
            let index = name2index[variable]
            if(index[0] <= qubit && index[1] > qubit){
                corresponding_variable = variable
                corresponding_index = qubit - index[0]
            }
        }

        return { 
            variable: corresponding_variable,
            index: corresponding_index,
        }
    }


    // 返回比特的上下界的比特, 传入label的text假设text唯一
    getLabelUpDown(label_id){
        const {operations, name2index} = this
        let label = this.labels.find(elm=> elm.id === label_id)
        if(!label){
            console.error('label', label, '不存在')
            debugger
        }
        if(label.text == ''){
            console.warn(label, '是空的，不需要画')
            return undefined
        }
        let {start_operation, end_operation} = label
        if(!end_operation){
            end_operation = operations.length
        }

        let qubits_involved = []
        range(start_operation, end_operation).forEach(index=>{
            // debugger
            qubits_involved = [...qubits_involved, ...this.getQubitsInvolved(operations[index])]
        })
        // console.log(qubits_involved)
        qubits_involved = [...new Set(qubits_involved)]

        let down_qubit = Math.max(...qubits_involved), up_qubit = Math.min(...qubits_involved)
        let down_varable = this.getQubit2Variable(down_qubit).variable, up_varable = this.getQubit2Variable(up_qubit).variable

        // debugger
        return {
            up_qubit: up_varable? name2index[up_varable][0] : up_qubit,
            down_qubit: down_varable? name2index[down_varable][1] : down_qubit
        }
    }

    get_varstate(operation_index){
        let res = {};
        let opera = this.operations[operation_index];
        let state = opera['state_after_opertaion'];
        let magnitudes = [];
        for(let i = 0;i<state.length;i++)
        {
            magnitudes[i] = state[i]['magnitude'];
        }

        let var_index = this.name2index;
        // for(i=0;i<magnitudes.length;i++)
        // {
        //     magnitudes[i]=magnitudes[i]*magnitudes[i];
        // }
    
        for(let key in var_index)
        {       
            res[key] = {};
            res[key]['prob'] = [];
            res[key]['magn'] = [];
            let i = 0;
            let bits = var_index[key][1] - var_index[key][0];
            let prob = 0;
            for(i=0; i<Math.pow(2,bits); i++)
            {
                prob = sum(magnitudes,i,var_index[key],Math.log2(magnitudes.length));
                res[key]['prob'][i] = prob;
                res[key]['magn'][i] = Math.sqrt(prob);
            }        
        }
    
        return res;
    }

    get_index(operation_index, filter)
    {
        let opera = this.operations[operation_index];
        let state = opera['state_after_opertaion'];

        let var_index = this.name2index;
            
        let i = 0;
        let neo_sv = [];
        let com = [];
        for(let key in filter)
        {
            if(com.length==0)
            {
                for(i = 0 ;i<filter[key].length;i++)
                    com[i]=[filter[key][i]];
                continue;
            }
            com = alt_tensor(com,filter[key]);
        }
        
        let k = 0;
        let total = Math.log2(state.length);
        for(i=0; i<com.length; i++)
        {
            let tmp = com[i];
            let index = 0;
            
            let j = 0;
            
            for (let key in var_index)
            {
                index += tmp[j] * (Math.pow(2,total-var_index[key][1]));
                j++;
            }
            
            neo_sv[k] = index;
            k++;
        }
        return neo_sv;
        
    }

}

class QCIntGenerator {
    constructor(qc) {
        this.qc = qc  //上一级的必须是一个qcengine
    }

    new(qubit_number, qint_name = undefined) {
        const { qc } = this
        let index = qc.new(qubit_number, qint_name)   //index 是数组
        let qint = new QInt(qc, index, qint_name)
        return qint
    }
}

class QInt {
    constructor(qc, index, name) {
        this.qc = qc  //上一级的必须是一个qcengine
        this.name = name
        this.index = index  //起始到结束的qubit的序号，左闭右开
        this.binary_qubits = qubit12binary(range(...index))
        // range(...index).reduce((sum, val) => sum | pow2(val), 0)  //TODO:check一下对不对
        // debugger
        // 0 0x1
        // 1 0x2
    }

    
    parseBinaryQubits(binary_qubits) {
        if (binary_qubits !== undefined){
            const qubits = binary2qubit1(binary_qubits).map(qubit=> qubit+this.index[0])
            return qubits        
        }else{
            return range(...this.index, true)  // 从0开始的0-qubit number - 1
        }
    }

    // 这返回的还是二进制的,将自己内部的换算成全局的二进制
    // TODO: 判断下比特存不存在，有没有溢出
    bits(binary_qubits){
        if (binary_qubits !== undefined){
            const qubits = binary2qubit1(binary_qubits).map(qubit=> qubit+this.index[0])
            return qubit12binary(qubits)            
        }else{
            return this.binary_qubits  // 从0开始的0-qubit number - 1
        }
    }

    nop(){
        this.qc.nop()
    }

    hadamard(binary_qubits){
        this.had(binary_qubits)
    }


    write(value, binary_qubits) {
        const {qc} = this
        // console.log(binary2qubit1(binary_qubits))
        binary_qubits = this.bits(binary_qubits)
        // console.log(binary2qubit1(binary_qubits))
        // debugger
        qc.write(value, binary_qubits)
    }

    had(binary_qubits) {
        const {qc} = this
        binary_qubits = this.bits(binary_qubits)
        qc.had(binary_qubits)
    }

    // TODO: console要换成throw
    // TODO: 还没有检查过
    // condition类似qint.bits(0x4)
    add(value, condition = undefined) {
        const {qc, binary_qubits } = this
        
        if(typeof(value) === 'number') {
            if(Math.round(value) !== value) {
                console.error(value, 'should be integer')
                debugger
                return
            }

            let qubits_start = qc.parseBinaryQubits(value)
            let qubits = this.parseBinaryQubits(binary_qubits)  // 从大到小
            qubits_start.forEach((qubit_start, index) => {
                
                // debugger
                qubits.forEach((qubit, index) => {
                    if(index === qubits.length-1) {
                        return
                    }
                    let controls = qubit12binary(range(this.index[qubit_start], qubit))
                    let target = qubit12binary([qubit])
                    // debugger
                    qc.ccnot(controls, target)
                })
            })

        }else if(value instanceof QInt) {
            let self_qubits = qc.parseBinaryQubits(binary_qubits)
            let value_qubits = qc.parseBinaryQubits(value.binary_qubits)
            value_qubits.reverse()  //从小到大

            value_qubits.forEach((value_qubit, value_index) => {
                let self_qubits_involved = self_qubits.filter((self_qubit, self_index)=>{
                    if(self_index >= self_qubits.length-value_index) {
                        return false;
                    }else{
                        return true;
                    }
                })
                // debugger
                self_qubits_involved.forEach((self_qubit, self_index) => {
                    let target = qubit12binary([self_qubit])
                    let controls = [...self_qubits_involved.filter(elm => elm !== self_qubit ), value_qubit]
                    controls = qubit12binary(controls)
                    qc.ccnot(controls, target)
                })
            })
            
        }

    }


    // TODO:
    subtract(value, condition = undefined){
    }

    // value: qint
    // TODO:
    addSquared(qint, condition = undefined){

    }

    // read的应该不是数组
    read(binary_qubits ) {
        const {qc} = this
        binary_qubits = this.bits(binary_qubits)
        return qc.read(binary_qubits)
    }

    exchange(another_qint) {
        let {qc, binary_qubits } = this
        qc.exchange(binary_qubits, another_qint.binary_qubits)
    }

    cphase(rotation, another_qint) {
        console.warn('this function is not well implemented')
        let {qc, binary_qubits } = this
        qc.cphase(rotation, binary_qubits, another_qint.binary_qubits)
    }

    phase(rotation, binary_qubits) {
        let {qc} = this

        binary_qubits = this.bits(binary_qubits)
        qc.phase(rotation, binary_qubits)
    }

    not(binary_qubits){
        let {qc} = this
        binary_qubits = this.bits(binary_qubits)
        qc.not(binary_qubits)
    }

    // https://oreilly-qc.github.io/?p=7-8#
    invQFT() {
        let {qc} = this
        let qubits = range(...this.index)
        
        qc.swap(pow2(qubits[0]), pow2(qubits[qubits.length-1]))
        qubits.forEach((qubits1, index1)=>{
            qc.had(pow2(qubits1))
            qubits.slice(index1+1).forEach((qubits2, index2)=>{
                let phi = 90 / pow2(index2)
                qc.cphase(phi, pow2(qubits1), pow2(qubits2))
            })
        })

    }

    // TODO: 不应该用二进制的，应该改掉
    QFT() {
        let {qc} = this
        let qubits = range(...this.index)
        qubits.reverse()

        qubits.forEach((qubits1, index1)=>{
            qc.had(pow2(qubits1))
            qubits.slice(index1+1).forEach((qubits2, index2)=>{
                let phi = - 90 / pow2(index2)
                qc.cphase(phi, pow2(qubits1), pow2(qubits2))
            })
        })

        qc.swap(pow2(qubits[0]), pow2(qubits[qubits.length-1]))
    }

}
// TODO: ccnot, cccnot 也要加

export {
    QInt,

}