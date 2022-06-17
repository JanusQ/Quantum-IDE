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
import { pow2, binary, binary2qubit1, range, toPI, qubit12binary, unique, sum, alt_tensor, calibrate, getExp, linear_entropy, binary2int, average, spec, average_sum, normalize, density, weight_rand } from './CommonFunction'

import {
    cos, sin, round, pi, complex, create, all, max, sparse, map,
} from 'mathjs'
import { gateExpand1toN, QObject, tensor, identity, dot, controlledGate, permute } from './MatrixOperation';
import * as deepcopy from 'deepcopy';

const config = {};
const math = create(all, config);

var name2gate = {}

// 统一规定高位在后

// 描述和计算可以分开
export default class QCEngine {
    constructor() {
        this.circuit = undefined
        this.now_column = 0  // 记录了quantum circuit里面当前的用到的column
        this.circuit_column = 0

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

        this.operation_index2whole_state = {}
        this.operation_index2var_state = {}

        // this.dont_draw_evo = true;
        this.dont_draw_evo = {}

    }
    
    export()
    {
        var qasm = this.circuit.exportToQASM({}, false);
        return qasm;
    }

    //import from QASM to a empty qcengine
    import(QASM)
    {
        //QASM = "OPENQASM 2.0;\ninclude \"qelib1.inc\";\nqreg q[3];\nh q[0];\ncz q[0],q[1];\nry(pi/2) q[0];\nh q[1];\nrz(pi/4) q[1];\nry(pi/2) q[2];\n";
        const circuit = new QuantumCircuit();
        this.circuit = circuit
        this.circuit.importQASM(QASM, function(errors) {
            console.log(errors);
        });
    }

    parseRotation(rot)
    {
        rot = rot.replace('pi', '180');
        //parseInt(eval(rot));
        return parseInt(eval(rot));
    }

    // We always begin by specifying how many qubits we want to associate with our QPU using the qc.reset() method. For example, we could prepare ourselves for a simulation of an 8-qubit QPU as follows:
    // // Request 8 qubits for simulation in our QPU
    // qc.reset(8);

    // TODO: 先暂时不输出反馈，直接用if else来执行反馈吧
    reset(qubit_number) {
        const { inital_value } = this

        if (this.qubit_number !== undefined) {
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
        //WAIT: START RUN HERE?
        // circuit.myStartRun()

        // this.now_state = circuit.stateAsArray()
    }

    // Considered together these 8 qubits can represent any 8-bit number (or, of course, superpositions of such numbers). Before we begin operating on these qubits we can initialize them to be a binary encoding of some integer value using the qc.write() method:

    // // Write the value 120 to our 8 qubits (01111000)
    // qc.reset(8);
    // qc.write(120);

    // SIWEI:现在规定一个qubit只能write一次, 这和原来的不一样，需要改代码
    // binary_qubits指的是二进制表示的qubit位


    nextColumn(column_num = 1) {
        const { operations, circuit, now_column } = this
        this.now_column += column_num
        return [now_column, this.now_column]
    }


    // TODO: 之后写成二进制或者数组都可以
    // TODO：判断下比特存不存在有没有溢出
    parseBinaryQubits(binary_qubits) {
        if (binary_qubits != undefined)
            return binary2qubit1(binary_qubits)
        else {
            return range(0, this.qubit_number, true)  // 从0开始的0-qubit number - 1
        }
    }

    getBinaryValue(qubit_set)
    {
        let value = [];
        let i=0;
        while(i<this.qubit_number)
        {
            if(qubit_set.includes(i))
                value.push(1)
            else
                value.push(0);
            i++;
        }
        return value;
    }

    new(qubit_number, name = undefined) {
        let start_index = this.assigned_qubit_number
        this.assigned_qubit_number += qubit_number
        let end_index = this.assigned_qubit_number
        if(this.assigned_qubit_number > this.qubit_number)
        {
            this.qprint("WARNING: number exceeds total qubit number")
        }
        let index = [start_index, end_index]


        if (!name)
            name = String(index)
        if(this.name2index[name])
        {
            this.qprint("qint already exists: " + name);
        }
        this.name2index[name] = index

        // TODO：需要保证name没有重复, 申请的不会超过
        return index
    }

    // 添加并且执行
    _addGate(gate) {
        const { circuit, operations, _now_label } = this
        const index = operations.length
        const { columns, operation } = gate

        const { state, rawgate } = this._circuitStep()
        //console.log("rawgate",rawgate);

        // columns是左闭右开的, 存的是quantum circuit库中的对应关系
        if (columns == undefined && gate.operation !== 'noop') {
            console.error(gate, 'not has columns')
            debugger
        }

        if (operation == undefined) {
            console.error(gate, 'not has operation')
            debugger
        }
        //console.log("state_after_opr",state);
        operations.push({
            ...gate,
            'index': index,  //操作的index
            'state_after_opertaion': state,
            'state_str': circuit.stateAsString(),
            'label_id': _now_label,
            'rawgate': rawgate,
            'qc': this,
        })

        this.now_state = state
        return {
            state
        }
    }

    qprint() {
        console.log('qc_console', arguments)
        // debugger
        this.console_data.push(
            [...arguments].map(elm => String(elm)).join('  ')
        )
    }

    // TODO: 判断所有控制门的比特会不会重叠，重叠报错
    checkOverlap(controls, targets) {
        for (let ele in targets) {
            if (controls.includes(ele))
                return true;
        }
        return false;
    }

    // 跑一步返回并返回当前的状态
    _circuitStep() {
        const { circuit, operations } = this
        // 之后应该还会返回门矩阵等信息
        let res = circuit.myStepRun();
        return {
            state: res['state'],
            rawgate: res['rawgate'],
        }
    }


    // 啥是discard
    // 应该就是空一格
    discard() {
        // this.nop()
    }

    label_count = -1
    genLabelId() {
        this.label_count++
        return this.label_count
    }

    // 给某一段打个标签, 是用于前端的
    // 给之后所有的打上标签
    // 如果传入空的就不会被话
    //----------------WARNING: DO NOT USE THIS, USE STARTLABEL & ENDLABEL INSTEAD--------------
    label(label) {
        const { _now_label, labels, operations } = this
        let former_label = labels[labels.length - 1]

        if (former_label) {
            former_label.end_operation = operations.length  // 右开
        }

        let label_id = this.genLabelId()
        labels.push({
            start_operation: operations.length,  //左闭
            text: label,
            id: label_id,
        })
        this._now_label = label_id
        console.warn('label() will be abandoned in the future')
    }
    //  ---------------WARNING: DO NOT USE THIS, USE STARTLABEL & ENDLABEL INSTEAD--------------

    startlabel(labelname) {
        const { _now_label, labels, operations, circuit_column } = this
        let label_id = this.genLabelId();

        labels.push({
            start_operation: circuit_column,//operations.length,  //左闭
            text: labelname,
            id: label_id,
        })

        this._now_label = label_id
    }

    endlabel(labelname) {
        const { _now_label, labels, operations, circuit_column } = this
        for (let key in labels) {
            if (labels[key]['text'] == labelname) {
                labels[key]['end_operation'] = circuit_column;//operations.length;
                return;
            }
        }
        console.error("no start label found");
        //debugger;
        
    }

    createlabel(op_start, op_end, labelname) {
        const { _now_label, labels, operations } = this;
        let label_id = this.genLabelId();
        const labelObj = {
            start_operation: op_start,  //左闭
            text: labelname || label_id,
            id: label_id,
            end_operation: op_end,
        }
        labels.push(labelObj)
        return labelObj
    }
//-----------------------------------------------------------------------------------------------------
    runCircuit()
    {
        this.circuit.myStartRun()
        this.now_state = this.circuit.stateAsArray()

        const { gates } = this.circuit;
        let qlen = this.circuit.numQubits;
        let cir_len = gates[0].length
        let op_col = 0;
        
        let control_set = ['cx','cy','cz','ch','csrn','cr2','cr4','cr8','crx','cry','crz','cu1','cu2',
        'cu3','cs','ct','csdg','ctdg','ccx', ];//'cswap','csrswap']
        
        let merge_set = ['id','x','y','z','h','srn','srndg','r2','r4','r8','s','t','sdg','tdg',
        'rx','ry','rz','u1','u2','u3', ];

        let rw_set = ['write0','write1','measure'];

        let gate_set_B = control_set;

        let gate_set_A = merge_set;

        let gate_set_C = ['swap','iswap','srswap','xy','ms','yy','zz','ncphase']
        for(let i=0; i<cir_len; i++)
        {
            let j=0;
            
            let ops ={};
            while(j<qlen)
            {
                if(gates[j][i]!=null){
                    let id =gates[j][i]['id'];
                    let nam = gates[j][i]['name'];
                    let pars = gates[j][i]['options']['params']
                    if(id in ops){

                    }
                    else{
                        ops[id] = {};
                        ops[id]['name'] = nam;
                        ops[id]['qubits'] = [];
                        ops[id]['target'] = [];
                        ops[id]['control'] = [];
                        ops[id]['params'] = pars;                    
                    }
                    ops[id]['qubits'].push(j);

                    if(control_set.includes(nam))
                    {
                        let max = -1
                        for(let k=0;k<qlen;k++)
                        {
                            if(gates[k][i]!=null && control_set.includes(gates[k][i]['name'])){
                                if(max < gates[k][i]['connector'])
                                    max = gates[k][i]['connector'];
                            }
                        }

                        if(gates[j][i]['connector'] == max)
                        {
                            ops[id]['target'].push(j);
                        }
                        else if(gates[j][i]['connector'] < max)
                        {
                            ops[id]['control'].push(j);
                        }
                        else
                        {
                            console.error("check the control set",max,gates[j][i]['connector']);
                        }
                    }
                }
                j++;
            }
            
            if(ops.length == 0)
                continue;
            
            let newops = {};
            let names =[];
            for(let id in ops)
            {
                if(names.includes(ops[id]['name']))
                {
                    
                    let aux = ops[id]['name'];
                    if(merge_set.includes(aux) || rw_set.includes(aux))
                    {
                        for(let newid in newops)
                        {
                            if(newops[newid]['name'] == aux)
                                newops[newid]['qubits'].push(ops[id]['qubits'][0]);
                        }
                        
                    }
                    else
                    {
                        newops[id] = ops[id];
                    }

                }
                else
                {
                    newops[id] = ops[id];
                    names.push(ops[id]['name']);
                }
            }
            //console.log(ops)
            //console.log(newops)
            let mark = -1;
            
            for(let id in newops)
            {
                let na = newops[id]['name'];
                if(na == 'write0' || na == 'write1')
                {
                    if(mark == -1)
                        mark = id;
                    
                    else
                    {
                        let value = 0;
                        if(newops[id]['name'] == 'write1'){
                            value = this.getBinaryValue(newops[id]['qubits'])
                        }
                        else{
                            value = this.getBinaryValue(newops[mark]['qubits'])
                        }
                        newops[mark]['name'] = 'write'
                        newops[mark]['pars'] = {}
                        newops[mark]['pars']['value'] = value;
                        newops[mark]['qubits'].push.apply(newops[mark]['qubits'], newops[id]['qubits']);
                        delete newops[id];
                        break;

                    }
                }

                
            }


            for(let id in newops){
                let op = newops[id]['name'];
                let qubits = newops[id]['qubits'];
                let target = newops[id]['target'];
                let control = newops[id]['control'];
                let pars = newops[id]['params'];
                
                if(gate_set_A.includes(op))
                {
                    this._addGate({
                        'qubits': qubits,
                        'operation': op,
                        ...pars,
                        'columns': this.nextColumn()
                    })
                }
                else if(gate_set_B.includes(op))
                {
                    this._addGate({
                        'controls': control,
                        'target': target,
                        'operation':op,
                        ...pars,
                        'columns': this.nextColumn()
                    })              
                }
                else if(gate_set_C.includes(op))
                {
                    this._addGate({
                        'qubits': qubits,
                        'operation' : op,
                        ...pars,
                        'columns': this.nextColumn()
                    })

                }
                else if(op == 'ncnot')
                {
                    
                    this._addGate({
                        'operation' : op,
                        ...pars,
                        'columns': this.nextColumn()
                    })

                }
                else if(op == 'write' || op == 'measure'){
                    this._addGate({
                        'qubits': qubits,
                        'operation' : op,
                        ...pars,
                        'columns': this.nextColumn()
                    })

                }

                else
                {
                    console.log("unkown gates" + op);
                }
            }
        
        }

        //console.log("operations",this.operations);

    }    



    h(wires = undefined, column = undefined)
    {
        this._singleOp('h', wires, column)
    }
    id(wires = undefined, column = undefined)
    {
        this._singleOp('id', wires, column)
    }
    x(wires = undefined, column = undefined)
    {
        this._singleOp('x', wires, column)
    }
    y(wires = undefined, column = undefined)
    {
        this._singleOp('y', wires, column)
    }
    z(wires = undefined, column = undefined)
    {
        this._singleOp('z', wires, column)
    }
    srn(wires = undefined, column = undefined)
    {
        this._singleOp('srn', wires, column)
    }
    srndg(wires = undefined, column = undefined)
    {
        this._singleOp('srndg', wires, column)
    }
    r2(wires = undefined, column = undefined)
    {
        this._singleOp('r2', wires, column)
    }
    r4(wires = undefined, column = undefined)
    {
        this._singleOp('r4', wires, column)
    }
    r8(wires = undefined, column = undefined)
    {
        this._singleOp('r8', wires, column)
    }   
    s(wires = undefined, column = undefined)
    {
        this._singleOp('s', wires, column)
    }
    t(wires = undefined, column = undefined)
    {
        this._singleOp('t', wires, column)
    }
    sdg(wires = undefined, column = undefined)
    {
        this._singleOp('sdg', wires, column)
    }
    tdg(wires = undefined, column = undefined)
    {
        this._singleOp('tdg', wires, column)
    }

    had(wires = undefined, column = undefined) {
        this.h(wires, column);
    }
    hadamard(wires = undefined, column = undefined) {
        this.had(wires, column);
    }
    not(wires = undefined, column = undefined)
    {
        this.x(wires, column);
    }
    phase(phi, wires = undefined, column = undefined)
    {
        this.rz(phi, wires, column)
    }

    rx(theta, wires = undefined, column = undefined)
    {
        let pars = {theta}
        this._singleOp('rx', wires, column, pars)
    }   
    ry(theta, wires = undefined, column = undefined)
    {
        let pars = {theta}
        this._singleOp('ry', wires, column, pars)
    }
    rz(phi, wires = undefined, column = undefined)
    {
        let pars = {phi}
        this._singleOp('rz', wires, column, pars)
    }
    u1(lambda, wires = undefined, column = undefined)
    {
        let pars = {lambda}
        this._singleOp('u1', wires, column, pars)
    }
    u2(phi, lambda, wires = undefined, column = undefined)
    {
        let pars = {phi, lambda}
        this._singleOp('u2', wires, column, pars)
    }
    u3(theta, phi, lambda, wires = undefined, column = undefined)
    {
        let pars = {theta, phi, lambda}
        this._singleOp('u3', wires, column, pars)
    }

    _toArray(wires)
    {
        if(wires == undefined)
        {
            wires = range(0, this.qubit_number);
        }
        else if(typeof(wires) == 'number')
            wires = [wires];
        else if (Array.isArray(wires))
            wires = wires;
        else
        {
            console.error("unknown wires" + wires);
        }
        return wires;
    }


    _singleOp(op, wires = undefined, column = undefined, pars = undefined)
    {
        const { circuit, circuit_column } = this;
        
        let nc = circuit_column;
        wires = this._toArray(wires);

        if(typeof(column) == 'number')
        {
            nc = column;
        }
        else{
            this.circuit_column++;
        }
        
        if(pars != undefined){
            for (let k in pars)
            {
                if(k == 'phi' || k == 'theta' || k == 'lambda')
                    if (pars[k] !== 0) {
                        pars[k] = pars[k] > 0 ? "pi/" + (180 / pars[k]) : "-pi/" + (180 / -pars[k])
                    }
            }
            
            wires.forEach(wire => {
                circuit.addGate(op, nc, wire, {
                    params: pars
                });
            })
            
        }
        else{
            wires.forEach(wire => {
                circuit.addGate(op, nc, wire);
            })
        }
    }


    



    swap(wires, column = undefined)
    {
        this._Multi2Op('swap', wires, column);
    }
    srswap(wires, column = undefined)
    {
        this._Multi2Op('srswap', wires, column);
    }
    iswap(wires, column = undefined)
    {
        this._Multi2Op('iswap', wires, column);
    }
    cx(wires, column = undefined)
    {
        this._Multi2Op('cx', wires, column)
    }
    cy(wires, column = undefined)
    {
        this._Multi2Op('cy', wires, column)
    }
    cz(wires, column = undefined)
    {
        this._Multi2Op('cz', wires, column)
    }
    ch(wires, column = undefined)
    {
        this._Multi2Op('ch', wires, column)
    }
    csrn(wires, column = undefined)
    {
        this._Multi2Op('csrn', wires, column)
    }
    cr2(wires, column = undefined)
    {
        this._Multi2Op('cr2', wires, column)
    }
    cr4(wires, column = undefined)
    {
        this._Multi2Op('cr4', wires, column)
    }
    cr8(wires, column = undefined)
    {
        this._Multi2Op('cr8', wires, column)
    }
    cs(wires, column = undefined)
    {
        this._Multi2Op('cs', wires, column)
    }
    ct(wires, column = undefined)
    {
        this._Multi2Op('ct', wires, column)
    }
    csdg(wires, column = undefined)
    {
        this._Multi2Op('csdg', wires, column)
    }
    ctdg(wires, column = undefined)
    {
        this._Multi2Op('ctdg', wires, column)
    }

    crx(theta, wires, column = undefined)
    {
        let pars = {theta}
        this._Multi2Op('crx', wires, column, pars)
    }
    cry(theta, wires, column = undefined)
    {
        let pars = {theta}
        this._Multi2Op('cry', wires, column, pars)
    }
    crz(phi, wires, column = undefined)
    {
        let pars = {phi}
        this._Multi2Op('crz', wires, column, pars)
    }
    cu1(lambda, wires, column = undefined)
    {
        let pars = {lambda}
        this._Multi2Op('cu1', wires, column, pars)
    }
    cu2(phi, lambda, wires, column = undefined)
    {
        let pars = {phi, lambda}
        this._Multi2Op('cu2', wires, column, pars)
    }
    cu3(theta, phi, lambda, wires, column = undefined)
    {
        let pars = {theta, phi, lambda}
        this._Multi2Op('cu3', wires, column, pars)
    }
    xy(phi, wires, column = undefined)
    {
        let pars = {phi}
        this._Multi2Op('xy', wires, column, pars)
    }
    ms(theta, wires, column = undefined)
    {
        let pars = {theta}
        this._Multi2Op('ms', wires, column, pars)
    }
    yy(theta, wires, column = undefined)
    {
        let pars = {theta}
        this._Multi2Op('yy', wires, column, pars)
    }
    zz(theta, wires, column = undefined)
    {
        let pars = {theta}
        this._Multi2Op('zz', wires, column, pars)
    }

    ccx(wires, column = undefined)
    {
        this._Multi2Op('ccx', wires, column)
    }
    cswap(wires, column = undefined)
    {
        this._Multi2Op('cswap', wires, column)
    }
    csrswap(wires, column = undefined)
    {
        this._Multi2Op('csrswap', wires, column)
    }
    

    cnot(wires, column = undefined)
    {
        this.cx(wires,column)
    }
    ccnot(wires, column = undefined)
    {
        this.ccx(wires,column)
    }

    _Multi2Op(op, wires, column = undefined, pars = undefined)
    {
        if(wires.length != 2 && wires.length != 3)
        {
            console.error("wires length not 2 or 3")
        }
        
        const { circuit, circuit_column } = this;
        
        let nc = circuit_column;

        if(typeof(column) == 'number')
        {
            nc = column;
        }
        else{
            this.circuit_column++;
        }
        
        if(pars != undefined){
            for (let k in pars)
            {
                if(k == 'phi' || k == 'theta' || k == 'lambda')
                    if (pars[k] !== 0) {
                        pars[k] = pars[k] > 0 ? "pi/" + (180 / pars[k]) : "-pi/" + (180 / -pars[k])
                    }
            }
            
            circuit.addGate(op, nc, wires, {
                params: pars
            });
            
        }
        else{
            circuit.addGate(op, nc, wires);
        }
    }

    ncphase(phi, wires, column = undefined)
    {
        let qubit_number = wires.length;
        let pars = {phi, qubit_number};
        this._MultinOp('ncphase', wires, column, pars)
    }

    ncnot(wires, column = undefined)
    {
        let qubit_number = wires.length;
        let controls = wires.slice(0, wires.length-1);
        let target = [wires[wires.length-1]];
        //console.log("wr",controls)
        let pars = {controls, target, qubit_number};
        this._MultinOp('ncnot', wires, column, pars)   
    }
    
    _MultinOp(op, wires, column = undefined, pars = undefined)
    {        
        const { circuit, circuit_column } = this;
        
        let nc = circuit_column;
        
        if(typeof(column) == 'number')
        {
            nc = column;
        }
        else{
            this.circuit_column++;
        }
        
        if(pars != undefined){
            for (let k in pars)
            {
                if(k == 'phi' || k == 'theta' || k == 'lambda')
                    if (pars[k] !== 0) {
                        
                        pars[k] = toPI(pars[k])
                    }
            }
            
            circuit.addGate(op, nc, wires, {
                params: pars
            });
            
        }
        else{
            circuit.addGate(op, nc, wires);
        }

    }






    // 啥事都不干，就空一格
    // nop() {
    //     const { operations, circuit } = this
    //     // this._now_label = undefined
    //     // this.label('')
    //     this._addGate({
    //         'operation': 'noop',
    //         'columns': undefined, //this.nextColumn()
    //     })
    // }





    // identity(binary_qubits = undefined) {
    //     const { circuit, operations, now_column } = this
    //     const qubits = this.parseBinaryQubits(binary_qubits)

    //     circuit.addGate('identity', now_column, qubits, {
    //         params: {
    //             qubit_number: qubits.length,
    //         }
    //     });

    //     this._addGate({
    //         'qubits': qubits,
    //         'operation': 'identity',
    //         'columns': this.nextColumn(),
    //     })
    // }

    exchange(qubits1, qubits2) {
        const { operations, circuit, now_column } = this

        //const qubits1 = this.parseBinaryQubits(binary_qubits1)
        //const qubits2 = this.parseBinaryQubits(binary_qubits2)

        if (qubits1.length != qubits2.length) {
            console.error(qubits1, qubits2, 'do not have same length, which can not be swapped')
            debugger
        }

        qubits1.forEach((qubit1, index) => {
            const qubit2 = qubits2[index]
            this.swap([qubit1,qubit2])
        })

    }

    // write(value, binary_qubits = undefined) {
    //     const { inital_value, qubit_number, circuit_column } = this

    //     let qubits = this.parseBinaryQubits(binary_qubits)
    //     let qubit_value = binary(value, qubits.length)

    //     if (Math.max(...qubits) >= qubit_number) {
    //         console.error('qubits has unexist qubit', qubits.filter(qubit => qubit >= qubit_number))
    //         debugger
    //     }

    //     let nc = circuit_column;
    //     this.circuit_column++;
    //     qubits.forEach((qubit, index) => {
    //         let value = qubit_value[index]
    //         inital_value[qubit] = value
    //         // this.circuit.addGate()
    //         if (value == 0) {
    //             this.circuit.addGate('write0', nc, [qubit])
    //         } else {
    //             this.circuit.addGate('write1', nc, [qubit])
    //         }
    //     })
        // this._addGate({
        //     'qubits': qubits,
        //     'operation': 'write',
        //     'value': qubit_value,
        //     'columns': column_range,
        // })
    //}

    // measure
    // read(binary_qubits = undefined) {
    //     const { operations, circuit, now_column } = this
    //     let qubits = this.parseBinaryQubits(binary_qubits)

    //     let reg_name = 'read_' + now_column
    //     qubits.forEach((qubit, index) => {
    //         circuit.addGate("measure", now_column, qubit, { 'creg': { 'name': reg_name, 'bit': index } })
    //     })

    //     // 这里目前唯一除了_addGate外的执行
    //     this._circuitStep()
    //     let result = circuit.getCregValue(reg_name); //返回一个int值, 只考虑new的

    //     // this._addGate({
    //     //     qubits,
    //     //     'operation': 'read',
    //     //     'columns': this.nextColumn(),
    //     //     reg_name,
    //     //     result,
    //     // })

    //     // read完的state值是不对的
    //     return result
    // }


    // 一下都是用来画图的函数

    getQubitsInvolved(operation) {
        let qubits_involved = []
        const { control, controls, qubits, qubit, target, targets, qubits1, qubits2, qubit1, qubit2 } = operation
        // if(target){
        //     qubits_involved.push(target)
        // }
        if (qubit) {
            qubits_involved.push(qubit)
        }
        if (qubit1) {
            qubits_involved.push(qubit1)
        }
        if (qubit2) {
            qubits_involved.push(qubit2)
        }

        // TODO: control和target还是统一成单比特的
        qubits_involved = [...qubits_involved, ...(target || [])]
        qubits_involved = [...qubits_involved, ...(qubits1 || [])]
        qubits_involved = [...qubits_involved, ...(qubits2 || [])]
        qubits_involved = [...qubits_involved, ...(controls || [])]
        qubits_involved = [...qubits_involved, ...(qubits || [])]
        qubits_involved = [...qubits_involved, ...(targets || [])]
        qubits_involved = [...qubits_involved, ...(control || [])]


        let qubits_involved_set = [...new Set(qubits_involved)]
        if (qubits_involved_set.length !== qubits_involved.length) {
            console.error('operation', operation, 'has repetitive qubit')
            debugger
        }
        return qubits_involved_set
    }

    // 输入一个比特，返回对应的变量，和在变量内部的序号, 没有找到返回undefined, undefined
    getQubit2Variable(qubit) {
        const { name2index } = this

        let corresponding_variable = undefined, corresponding_index = undefined
        for (let variable in name2index) {
            let index = name2index[variable]
            if (index[0] <= qubit && index[1] > qubit) {
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
    getLabelUpDown(label_id) {
        const { operations, name2index } = this
        let label = this.labels.find(elm => elm.id === label_id)
        if (!label) {
            console.error('label', label, '不存在')
            debugger
        }
        if (label.text == '') {
            console.warn(label, '是空的，不需要画')
            return undefined
        }
        let { start_operation, end_operation } = label
        if (!end_operation) {
            end_operation = operations.length
        }

        let qubits_involved = []
        range(start_operation, end_operation).forEach(index => {
            // debugger
            qubits_involved = [...qubits_involved, ...this.getQubitsInvolved(operations[index])]
        })
        // console.log(qubits_involved)
        qubits_involved = [...new Set(qubits_involved)]

        let down_qubit = Math.max(...qubits_involved), up_qubit = Math.min(...qubits_involved)
        let down_varable = this.getQubit2Variable(down_qubit).variable, up_varable = this.getQubit2Variable(up_qubit).variable

        // debugger
        return {
            up_qubit: up_varable ? name2index[up_varable][0] : up_qubit,
            down_qubit: down_varable ? name2index[down_varable][1] : down_qubit
        }
    }
    // 返回折叠之后label的上下界比特 同上 就是operatiions和labels传入画图的
    getDrawLabelUpDown(label_id, operations, labels) {

        const { name2index } = this
        let label = labels.find(elm => elm.id === label_id)
        if (!label) {
            console.error('label', label, '不存在')
            debugger
        }
        if (label.text == '') {
            console.warn(label, '是空的，不需要画')
            return undefined
        }
        let { start_operation, end_operation } = label
        if (!end_operation) {
            end_operation = operations.length
        }

        let qubits_involved = []
        range(start_operation, end_operation).forEach(index => {
            // debugger
            qubits_involved = [...qubits_involved, ...this.getQubitsInvolved(operations[index])]
        })
        // console.log(qubits_involved)
        qubits_involved = [...new Set(qubits_involved)]

        let down_qubit = Math.max(...qubits_involved), up_qubit = Math.min(...qubits_involved)
        let down_varable = this.getQubit2Variable(down_qubit).variable, up_varable = this.getQubit2Variable(up_qubit).variable

        // debugger
        return {
            up_qubit: up_varable ? name2index[up_varable][0] : up_qubit,
            down_qubit: down_varable ? name2index[down_varable][1] : down_qubit
        }
    }
    // TODO: 统一驼峰还是下划线命名
    setState(state_vector)//set initial state for test, invocate it before adding other gates
    {
        const { circuit, now_column, qubit_number } = this;

        let opera = this.operations[0];
        let old_state = [];
        if (opera) {
            let sao = opera['state_after_opertaion'];
            for (let i = 0; i < sao.length; i++) {
                old_state[i] = sao[i]['amplitude'];
            }
        } else {
            // TODO用不了现在
            old_state = range(0, Math.pow(2, qubit_number)).map(base => complex(0, 0))
            old_state[0] = complex(1, 0)
        }


        let qubits = range(0, this.qubit_number, true);
        //console.log("qubits",qubits);
        if (state_vector.length != Math.pow(2, this.qubit_number)) {
            console.error("wrong new state");
            debugger;
        }
        circuit.addGate('StateGate', now_column, qubits, {
            params: {
                old_state: old_state,
                new_state: state_vector,
            }
        });

        this._addGate({
            'qubits': qubits,
            'operation': 'StateGate',
            'columns': this.nextColumn(),
        })

    }

    getVarState(operation_index, filter = undefined) {
        const { operations, qubit_number, operation_index2var_state } = this;

        if (filter === undefined && operation_index2var_state[operation_index])
            return operation_index2var_state[operation_index]

        let res = {};

        let whole = this.getWholeState(operation_index);

        let var_index = this.name2index;

        for (let key in var_index) {
            res[key] = {};
            res[key]['prob'] = [];
            res[key]['magn'] = [];
            res[key]['phase'] = [];

            let bits = var_index[key][1] - var_index[key][0];

            for (let i = 0; i < Math.pow(2, bits); i++) {
                let input_index = {}
                input_index[key] = [i];
                let tmp_index = this.getIndex(operation_index, input_index);

                res[key]['prob'][i] = average(whole['probs'], tmp_index, whole['probs'], 'probs');
                res[key]['magn'][i] = average(whole['probs'], tmp_index, whole['probs'], 'magns');
                if(1- res[key]['magn'][i] <1e-5)
                    res[key]['magn'][i] = 1.00;
                res[key]['phase'][i] = average(whole['phases'], tmp_index, whole['probs'], 'phases');
            }
        }

        if (filter != undefined) {
            for (let key in var_index)
                res[key] = this._variableFilter(operation_index, key, filter);
        } else {
            operation_index2var_state[operation_index] = res
        }


        return res;
    }

    getWholeState(operation_index) {
        const { qubit_number, operations, operation_index2whole_state, name2index } = this;

        if (operation_index2whole_state[operation_index]) {
            return operation_index2whole_state[operation_index]
        }

        if (operation_index < 0) {
            let res = {};
            let len = Math.pow(2, qubit_number);
            res['magns'] = [];
            res['phases'] = [];
            res['probs'] = [];
            res['base'] = [];
            for (let i = 0; i < len; i++) {
                res['magns'][i] = 0;
                res['probs'][i] = 0;
                res['phases'][i] = 0;
                res['base'][i] = binary(i, qubit_number);
            }
            return res;
        }

        let opera = operations[operation_index];
        let state = opera['state_after_opertaion'];
        let res = {};
        res['magns'] = [];
        res['phases'] = [];
        res['probs'] = [];
        res['base'] = [];

        for (let i = 0; i < state.length; i++) {
            let comp = state[i]['amplitude'];
            let polar = getExp(comp);
            res['magns'][i] = polar['r'];
            res['probs'][i] = res['magns'][i] * res['magns'][i];
            res['phases'][i] = calibrate(polar['phi'], true) * 180 / Math.PI;

            let all_bits = binary(i, qubit_number);
            all_bits = all_bits.reverse();
            let value = [];
            for (let key in name2index) {
                let bin = all_bits.slice(name2index[key][0], name2index[key][1]);
                bin = bin.reverse();
                let val = binary2int(bin);
                value.push(val);
            }
            res['base'][i] = value;
        }
        // console.log("wholestate",res);

        operation_index2whole_state[operation_index] = res
        return res;
    }

    getIndex(operation_index, filter) {
        //let opera = this.operations[operation_index];
        //let state = opera['state_after_opertaion'];
        //cp_filter = {'a':[0,1,2,5,7,9],'b':[0,3]};
        //console.log(cp_filter);
        const { name2index } = this;
        let cp_filter = deepcopy(filter);
        //console.log(cp_filter);
        let var_index = name2index;
        //console.log(var_index);
        let i = 0;
        let neo_sv = [];
        let com = [];
        //console.log(cp_filter);
        for (let key in var_index) {
            if (cp_filter[key] == undefined) {
                let tmp_ar = [];
                let len = var_index[key][1] - var_index[key][0];
                for (i = 0; i < Math.pow(2, len); i++) {
                    tmp_ar[i] = i;
                }
                cp_filter[key] = tmp_ar;
            }
        }
        //console.log(cp_filter);
        for (let key in cp_filter) {
            if (com.length == 0) {
                for (i = 0; i < cp_filter[key].length; i++) {
                    com[i] = {};//{key:cp_filter[key][i]};
                    com[i][key] = cp_filter[key][i];
                    //console.log(com[i]);
                    //com[i] = [cp_filter[key][i]];
                }
                //console.log(com);
                continue;
            }
            com = alt_tensor(com, cp_filter[key], key);
        }
        //console.log(com);
        let k = 0;
        //let total = this.qubit_number;
        //console.log('com',com);
        for (i = 0; i < com.length; i++) {
            let tmp = com[i];
            let index = 0;

            //let j = 0;

            for (let key in var_index) {
                //console.log(index);
                index += tmp[key] * (Math.pow(2, var_index[key][0]));
                //console.log(index);
                //j++;
            }

            neo_sv[k] = index;
            k++;
        }
        neo_sv = neo_sv.sort(function (a, b) { return a - b });
        return neo_sv;
    }

    _selectedState(num, bit_range) {
        //let opera = this.operations[operation_index];
        //let state = opera['state_after_opertaion'];
        //let res = [];
        let min = bit_range[0];
        let max = bit_range[1];
        let ran = max - min;
        let bin = binary(num, this.qubit_number - ran);
        bin = bin.reverse();
        let all_bin = [];
        let mask = [];
        let ret = [];
        for (let i = 0; i < Math.pow(2, ran); i++) {
            let bini = binary(i, ran);
            bini = bini.reverse();

            let j = 0;

            for (let k = 0; k < this.qubit_number; k++) {
                all_bin[k] = 0;
                mask[k] = 0;
            }

            for (let k = min; k < max; k++) {
                all_bin[k] = bini[j];
                mask[k] = 1;
                j++;
            }
            j = 0;
            for (let k = 0; k < this.qubit_number; k++) {
                if (mask[k] == 0) {
                    all_bin[k] = bin[j];
                    mask[k] = 1;
                    j++;
                }
            }
            all_bin = all_bin.reverse();
            ret[i] = binary2int(all_bin, this.qubit_number);
        }

        return ret;

    }

    _getPartialTrace(name, operation_index) {
        let opera = this.operations[operation_index];
        let state = opera['state_after_opertaion'];

        let var_index = this.name2index;
        let bits = var_index[name][1] - var_index[name][0];
        let whole_state = this.getWholeState(operation_index);
        let now_num = 0;
        let fin_den = undefined;

        for (now_num = 0; now_num < Math.pow(2, this.qubit_number - bits); now_num++) {
            let ids = this._selectedState(now_num, var_index[name]);

            let prob = 0;
            let vecs = [];

            for (let i = 0; i < ids.length; i++) {
                prob += whole_state['probs'][ids[i]];
                vecs[i] = complex(state[ids[i]]['amplitude'].re, state[ids[i]]['amplitude'].im);
            }

            vecs = normalize(vecs)
            let den = density(vecs);

            if (fin_den == undefined)
                fin_den = math.multiply(den, prob);
            else
                fin_den = math.add(fin_den, math.multiply(den, prob));

        }

        return fin_den;
    }

    _getPartialTraceAlt(qubit_index, operation_index) {
        let opera = this.operations[operation_index];
        let state = opera['state_after_opertaion'];

        let bits = 1;
        let whole_state = this.getWholeState(operation_index);
        let now_num = 0;
        let fin_den = undefined;
        let ran = [qubit_index, qubit_index + 1]

        for (now_num = 0; now_num < Math.pow(2, this.qubit_number - bits); now_num++) {
            let ids = this._selectedState(now_num, ran);

            let prob = 0;
            let vecs = [];

            for (let i = 0; i < ids.length; i++) {
                prob += whole_state['probs'][ids[i]];
                vecs[i] = complex(state[ids[i]]['amplitude'].re, state[ids[i]]['amplitude'].im);
            }

            vecs = normalize(vecs)
            let den = density(vecs);

            if (fin_den == undefined)
                fin_den = math.multiply(den, prob);
            else
                fin_den = math.add(fin_den, math.multiply(den, prob));

        }

        return fin_den;
    }

    getEntropy(operation_index, precision = 1e-5, type = 'qubit') {
        const {name2index, qubit_number} = this;
        let len = 0;
        let ent = 0;
        let var_index = name2index;
        if(type == 'qubit'){
            for(let i=0; i<qubit_number; i++)
            {
                let den = this._getPartialTraceAlt(i, operation_index);
                ent += linear_entropy(den);
                len++;
            }
        }
        else{
            for (let key in var_index) {
                let den = this._getPartialTrace(key, operation_index);
                ent += linear_entropy(den);
                //console.log(key, den, ent);
                len++;
            }
        }

        if (Math.abs(ent - 0) < precision)
            ent = 0;

        // if(ent == 0)
        //     ent +=0.1;
        //console.log("entropy",ent);
        let res= ent/len;
        // if(res==0)
        //     res+=0.2;
        return res;
        
    }

    variablePurity(operation_index, variable) {
        let vec = this._getPartialTrace(variable, operation_index);
        let ent = linear_entropy(vec);
        return 1 - ent;
    }

    variableEntropy(operation_index, variable, precision = 1e-5, type = 'qubit') {
        const {name2index} = this;
        let ent = 0;

        if(type == 'qubit'){
            let len = 0;
            for(let i=name2index[variable][0]; i<name2index[variable][1]; i++)
            {
                let den = this._getPartialTraceAlt(i, operation_index);
                ent += linear_entropy(den);
                len++;
            }
            ent /= len;
        }
        else
        {
            let vec = this._getPartialTrace(variable, operation_index);
            ent = linear_entropy(vec);
        }

        if (Math.abs(ent - 0) < precision)
            ent = 0;

        //console.log(variable, ent);
        return ent;
    }

    _calcPmi(operation_index, select) {
        let index = this.getIndex(operation_index, select);
        //console.log(select);
        let whole_state = this.getWholeState(operation_index);
        let p_xy = 0;
        let i = 0;

        for (i = 0; i < index.length; i++) {
            let magn = whole_state['magns'][index[i]];
            //console.log(index[i]);
            p_xy += magn * magn;
        }

        if (p_xy === 0)
            return 0

        let var_state = this.getVarState(operation_index);
        let div = 1;

        for (let key in select) {
            div *= var_state[key]['prob'][select[key][0]];
            if (div === 0)
                return 0
        }

        // console.log("p_xy",p_xy);
        // console.log("px * py",div);

        let pmi = p_xy * Math.log(p_xy / div);

        return pmi;
    }

    // TODO: 能复用的数据可以存一下
    getPmiIndex(operation_index, threshold, precision = 1e-5) {
        threshold = 0.1;
        const { name2index } = this;
        let ids = [];
        let i, j = 0;
        let var_index = name2index;

        let k = 0;
        let done = [];
        for (let key in var_index) {
            done.push(key);
            let len = Math.pow(2, var_index[key][1] - var_index[key][0]);
            for (let key2 in var_index) {
                let len2 = Math.pow(2, var_index[key2][1] - var_index[key2][0]);
                if (!done.includes(key2)) {
                    for (i = 0; i < len; i++)
                        for (j = 0; j < len2; j++) {
                            if (key != key2) {
                                let select = {};
                                select[key] = [i];
                                select[key2] = [j];
                                //console.log(select);
                                let pmi = this._calcPmi(operation_index, select);
                                if (Math.abs(pmi - 0) < precision)
                                    pmi = 0;
                                // if(pmi != 0){
                                //     console.log(select,pmi);
                                // }
                                if (pmi >= threshold) {
                                    select[key] = select[key][0];
                                    select[key2] = select[key2][0];
                                    ids[k] = select;
                                    k++;
                                }
                            }
                        }
                }

            }
        }
        //console.log(ids);
        // debugger
        return ids;
    }

    _variableFilter(operation_index, target, filter) {
        const { name2index } = this;
        let index = this.getIndex(operation_index, filter);
        let whole = this.getWholeState(operation_index);
        let var_index = name2index;

        let var_filtered = {};
        var_filtered['magn'] = [];
        var_filtered['prob'] = [];

        for (let i = 0; i < Math.pow(2, var_index[target][1] - var_index[target][0]); i++) {
            var_filtered['prob'][i] = 0;
            var_filtered['magn'][i] = 0;
        }
        // console.log(index);
        for (let i = 0; i < index.length; i++) {
            let bin = binary(index[i], this.qubit_number);
            bin = bin.reverse();
            let sel = bin.slice(var_index[target][0], var_index[target][1]);
            sel = sel.reverse();
            let dec = binary2int(sel);
            //console.log(dec);
            var_filtered['prob'][dec] += whole['probs'][index[i]];
        }

        for (let i = 0; i < Math.pow(2, var_index[target][1] - var_index[target][0]); i++) {
            var_filtered['magn'][i] = Math.sqrt(var_filtered['prob'][i]);
        }

        return var_filtered;

    }

    _makeState(label_id, status) {
        // console.log(this.labels);
        // console.log(label_id);
        // console.log(this.operations);
        let ops = [this.labels[label_id]['start_operation'], this.labels[label_id]['end_operation']];

        let op_index;
        if (status == 'start')
            op_index = ops[0] - 1;
        else if (status == 'end')
            op_index = ops[1] - 1;

        let whole = this.getWholeState(op_index);

        //let opera = this.operations[op_index];
        //let state = opera['state_after_opertaion'];
        //let involved_qubits = this.getQubitsInvolved(opera);
        let var_index = this.name2index;

        let vars = [];
        let tmp_array = [];

        for (let i = ops[0]; i < ops[1]; i++) {
            let opera = this.operations[i];
            let involved_qubits = this.getQubitsInvolved(opera);

            for (let qubit of involved_qubits) {
                let tmp_var = this.getQubit2Variable(qubit);
                tmp_array.push(tmp_var['variable']);
            }

        }

        //vars = [...new Set(tmp_array)];
        vars = [];

        for (let key in var_index) {
            if (tmp_array.includes(key))
                vars.push(key);
        }


        let input_state = {};
        input_state['vars'] = vars;

        let deep_length = 1;
        let qubit_num = 0;
        let new_var_index = {};
        let bottom = 0;
        let i = 0;
        for (i = 0; i < vars.length; i++) {
            let bits = var_index[vars[i]][1] - var_index[vars[i]][0];
            //deep_length *= bits;
            qubit_num += bits;
            new_var_index[vars[i]] = [];
            new_var_index[vars[i]][0] = bottom;
            new_var_index[vars[i]][1] = bottom + bits;
            bottom = bottom + bits;
        }
        deep_length = Math.pow(2, qubit_num);
        //console.log(qubit_num,deep_length);
        //console.log(new_var_index);

        input_state['bases'] = [];
        input_state['max_magn'] = 0;

        for (let i = 0; i < deep_length; i++) {
            input_state['bases'][i] = {};

            input_state['bases'][i]['id'] = i;

            input_state['bases'][i]['var2value'] = {};
            let bin = binary(i, qubit_num);
            bin = bin.reverse();
            for (let k = 0; k < vars.length; k++) {
                let tmp = bin.slice(new_var_index[vars[k]][0], new_var_index[vars[k]][1]);
                tmp = tmp.reverse();
                let dec = binary2int(tmp);
                input_state['bases'][i]['var2value'][vars[k]] = dec;
            }

            //switch to power
            let input_index = { ...input_state['bases'][i]['var2value'] };
            for (let key in input_index) {
                input_index[key] = [input_index[key]];
            }
            //console.log(input_index);
            let tmp_index = this.getIndex(op_index, input_index);
            //console.log(tmp_index);
            input_state['bases'][i]['magnitude'] = average(whole['probs'], tmp_index, whole['probs'], 'magns');
            input_state['bases'][i]['phases'] = average(whole['phases'], tmp_index, whole['probs'], 'phases');

            if (input_state['max_magn'] < input_state['bases'][i]['magnitude'])
                input_state['max_magn'] = input_state['bases'][i]['magnitude'];



            input_state['bases'][i]['related_bases'] = [];


            input_state['bases'][i]['max_base_magn'] = 0;
            for (let k = 0; k < Math.pow(2, this.qubit_number - qubit_num); k++) {
                let order;
                input_state['bases'][i]['related_bases'][k] = {};
                let all_bin = spec(this.qubit_number, k, this.qubit_number - qubit_num, var_index, input_state['bases'][i]['var2value']);
                all_bin = all_bin.reverse();

                input_state['bases'][i]['related_bases'][k]['var2value'] = {};
                for (let key in var_index) {
                    let bin = all_bin.slice(var_index[key][0], var_index[key][1]);
                    bin = bin.reverse();
                    input_state['bases'][i]['related_bases'][k]['var2value'][key] = binary2int(bin);
                }

                input_state['bases'][i]['related_bases'][k]['range'] = {};
                for (let key in var_index) {
                    let var_bits = var_index[key][1] - var_index[key][0];
                    input_state['bases'][i]['related_bases'][k]['range'][key] = Math.pow(2, var_bits) - 1;
                }

                let total_index = input_state['bases'][i]['related_bases'][k]['var2value'];
                for (let key in total_index) {
                    total_index[key] = [total_index[key]];

                }
                order = this.getIndex(op_index, total_index);
                //console.log(order);

                input_state['bases'][i]['related_bases'][k]['magnitude'] = whole['magns'][order];
                input_state['bases'][i]['related_bases'][k]['phases'] = whole['phases'][order];

                if (input_state['bases'][i]['max_base_magn'] < whole['magns'][order])
                    input_state['bases'][i]['max_base_magn'] = whole['magns'][order];
                if (input_state['max_magn'] < whole['magns'][order])
                    input_state['max_magn'] = whole['magns'][order];

            }
            // for (let k = 0; k < Math.pow(2, this.qubit_number - qubit_num); k++) {
            //     if (input_state['bases'][i]['max_base_magn'] == 0)
            //         input_state['bases'][i]['related_bases'][k]['ratio'] = 0;
            //     else
            //         input_state['bases'][i]['related_bases'][k]['ratio'] = input_state['bases'][i]['related_bases'][k]['magnitude'] / input_state['bases'][i]['max_base_magn'];
            // }

            //deleted all zero related bases
            let d = 0;
            while (d < input_state['bases'][i]['related_bases'].length) {
                if (input_state['bases'][i]['related_bases'][d]['magnitude'] == 0) {
                    input_state['bases'][i]['related_bases'].splice(d, 1);
                }
                else {
                    d++;
                }

            }

        }

        // process ratio
        for (let i = 0; i < input_state['bases'].length; i++) {
            if (input_state['max_magn'] == 0) {
                for (let j = 0; j < input_state['bases'][i]['related_bases'].length; j++) {
                    input_state['bases'][i]['related_bases'][j]['ratio'] = 0;
                }
                input_state['bases'][i]['ratio'] = 0;
            }
            else {
                for (let j = 0; j < input_state['bases'][i]['related_bases'].length; j++) {
                    input_state['bases'][i]['related_bases'][j]['ratio'] = input_state['bases'][i]['related_bases'][j]['magnitude'] / input_state['max_magn'];
                }
                input_state['bases'][i]['ratio'] = input_state['bases'][i]['magnitude'] / input_state['max_magn'];
            }
        }
        //console.log("state",input_state);
        return input_state;

    }

    _getNewIndex(new_var_index, old) {
        let inc = this.getQubit2Variable(old);
        let btc = new_var_index[inc['variable']][0];
        let tar = btc + inc['index'];
        return tar;
    }

    _tensorPermute(rawgate, new_ar, bits, options = undefined) {
        // console.log(new_ar);
        const { qubits, controls, target } = options;
        let gate = rawgate.copy();
        if (qubits) {
            let size = Math.log2(gate.data.length);
            while (size < bits) {
                if (size < qubits.length) {
                    gate = tensor(gate, rawgate.copy());
                }
                else {
                    gate = tensor(identity(2), gate);
                }
                size = Math.log2(gate.data.length);
            }
        }
        else if (target) {

            while (gate.data.length < Math.pow(2, bits)) {
                gate = tensor(identity(2), gate);
            }
        }
        //console.log("gate",gate.copy());
        //new_ar = [2,0,1];
        gate = permute(gate, new_ar);

        return gate;

    }

    disableDisplay(label_name) {
        // this.dont_draw_evo = false;
        this.dont_draw_evo[label_name] = true;
    }

    enableDisplay(label_name) {
        // this.dont_draw_evo = true;
        this.dont_draw_evo[label_name] = false;
    }

    canShow(label_id) {
        // debugger
        // console.log(this.operations);
        // console.log(this.labels);
        let ops = [this.labels[label_id]['start_operation'], this.labels[label_id]['end_operation']];
        let label_name = this.labels[label_id]['text']
        for (let i = ops[0]; i < ops[1]; i++) {
            let opera = this.operations[i];
            if (opera['operation'] == 'write' || opera['operation'] == 'read' || this.dont_draw_evo[label_name] || opera['operation'] == 'measure')
                return false;

        }
        return true;

    }

    getEvoMatrix(label_id) {
        // debugger
        //console.log(label_id);
        //console.log(this.labels);
        // console.log(this.operations);
        let gate_mats = [];
        let ops = [this.labels[label_id]['start_operation'], this.labels[label_id]['end_operation']];
        //console.log(ops);
        let vars = [];

        let tmp_array = [];
        for (let i = ops[0]; i < ops[1]; i++) {
            let opera = this.operations[i];
            let involved_qubits = this.getQubitsInvolved(opera);

            for (let qubit of involved_qubits) {
                let tmp_var = this.getQubit2Variable(qubit);
                tmp_array.push(tmp_var['variable']);
            }

        }
        //vars = [...new Set(tmp_array)];
        let var_index = this.name2index;

        for (let key in var_index) {
            if (tmp_array.includes(key))
                vars.push(key);
        }

        let deep_length = 1;
        let qubit_num = 0;
        let new_var_index = {};
        let bottom = 0;
        for (let i = 0; i < vars.length; i++) {
            let bits = var_index[vars[i]][1] - var_index[vars[i]][0];
            qubit_num += bits;
            new_var_index[vars[i]] = [];
            new_var_index[vars[i]][0] = bottom;
            new_var_index[vars[i]][1] = bottom + bits;
            bottom += bits;
        }

        deep_length = Math.pow(2, qubit_num);

        let all_gate = identity(deep_length);
        let all_gates = [];

        for (let i = ops[0]; i < ops[1]; i++) {
            let opera = this.operations[i];
            let gate = opera['rawgate'];
            let column_res;
            let options = {};
            //console.log("opera",opera);
            let type;
            if (opera['controls'] || opera['control']) {
                options['controls'] = [];
                options['target'] = [];
                type = 0;
            }
            else {
                options['qubits'] = [];
                type = 1;
            }

            if (gate == undefined)
                continue;

            let gate_mat = new QObject(gate.length, gate.length, gate);
            //console.log("gate",gate_mat);

            let qubit_index = this.getQubitsInvolved(opera);
            let new_index = range(0, qubit_num);
            let targetIndex = undefined;
            //console.log("qubit_index",[...qubit_index]);
            for (let j = 0; j < qubit_index.length; j++) {
                let new_ind = this._getNewIndex(new_var_index, qubit_index[j]);
                //console.log("new_ind",new_ind);
                if (type == 1) {
                    options['qubits'].push(new_ind);
                }
                else if (type == 0) {
                    if (qubit_index[j] == opera['target']) {
                        options['target'].push(new_ind);
                        targetIndex = new_ind;
                    }
                    else {
                        options['controls'].push(new_ind);
                    }
                }
                for (let k = 0; k < new_index.length; k++) {
                    if (new_index[k] != new_ind) {
                        continue;
                    }
                    new_index[k] = new_index[j];
                    new_index[j] = new_ind;
                    break;
                }

                // new_index[j] = new_index[new_ind];
                // new_index[new_ind] = indtmp;
                // console.log(new_index);
                //new_index.push(new_ind);
            }
            if (type == 0) {
                for (let j = 0; j < qubit_index.length; j++) {
                    if (new_index[j] == targetIndex) {
                        let indtmp = new_index[0];
                        new_index[0] = new_index[j];
                        new_index[j] = indtmp;
                    }
                }
            }
            //console.log(new_index);
            column_res = this._tensorPermute(gate_mat, new_index, qubit_num, options);
            //console.log("column_res",column_res);
            //all_gate = dot(all_gate, column_res);
            all_gates.push(column_res.copy());
        }
        //console.log("all_gate",all_gate);
        all_gates = all_gates.reverse();
        //console.log(all_gates);
        all_gate = dot(all_gates);


        let stru = this.getInputState(label_id);
        //console.log(stru);

        let max = 0;
        for (let i = 0; i < deep_length; i++) {
            gate_mats[i] = [];
            for (let j = 0; j < deep_length; j++) {
                let polar = getExp(all_gate.data[i][j]);
                if (max < polar['r'])
                    max = polar['r'];
                gate_mats[i][j] = {};
                gate_mats[i][j]['amplitude'] = all_gate.data[i][j];
                gate_mats[i][j]['magnitude'] = polar['r'];
                gate_mats[i][j]['phase'] = calibrate(polar['phi']) * 180 / Math.PI;

                if (stru['bases'][j]['magnitude'] != 0)
                    gate_mats[i][j]['used'] = true;
                else
                    gate_mats[i][j]['used'] = false;
            }
        }

        for (let i = 0; i < deep_length; i++) {
            for (let j = 0; j < deep_length; j++) {
                let polar = getExp(all_gate.data[i][j]);
                if (max == 0)
                    gate_mats[i][j]['ratio'] = 0;
                else
                    gate_mats[i][j]['ratio'] = polar['r'] / max;
                gate_mats[i][j]['max'] = max;
            }
        }

        // console.log("gate_mats", gate_mats);


        //fill fake data
        // for(let i=0; i<deep_length; i++)
        // {
        //     gate_mats[i]= [];
        //     for(let j=0; j<deep_length; j++)
        //     {
        //         gate_mats[i][j] = {};
        //         gate_mats[i][j]['magnitude'] = 0.5;
        //         gate_mats[i][j]['ratio'] = 0.8;
        //         gate_mats[i][j]['phase'] = 30;
        //         gate_mats[i][j]['used'] = true;
        //     }
        // }
        //console.log(gate_mats);
        //console.log(gate_mats);
        //console.log(this.labels, gate_mats);
        //gate_mats[1][3]['phase'] = 270;
        return gate_mats;

    }

    isSparse(label_id, threshold = 1.3, precision = 1e-5) {
        // console.log("label_id", label_id);
        // console.log(this.labels);
        //return false;
        let matrix = this.getEvoMatrix(label_id);
        let count = 0;
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix.length; j++) {
                if (Math.abs(matrix[i][j]['magnitude'] - 0) > precision) {
                    count++;
                }
            }
        }
        if (count > threshold * matrix.length)
            return false;
        else
            return true;
    }

    transferSankey(label_id, precision = 1e-5) {
        // debugger
        let matrix = this.getEvoMatrix(label_id);
        let sankey = [];
        let k = 0;
        for (let j = 0; j < matrix.length; j++) {
            for (let i = 0; i < matrix.length; i++) {
                if (Math.abs(matrix[i][j]['magnitude'] - 0) > precision) {
                    sankey[k] = {};
                    sankey[k]['maganitude'] = matrix[i][j]['magnitude'];
                    sankey[k]['phase'] = matrix[i][j]['phase'];
                    sankey[k]['amplitude'] = matrix[i][j]['amplitude'];
                    sankey[k]['used'] = matrix[i][j]['used'];
                    sankey[k]['from_id'] = i;
                    sankey[k]['to_id'] = j;
                    sankey[k]['y_index'] = k;
                    sankey[k]['ratio'] = matrix[i][j]['ratio'];
                    k++;
                }
            }
        }

        return sankey;
    }

    transferSankeyOrdered(label_id, precision = 1e-5, per = false, filter_unused = false, input_state = undefined, output_state = undefined) {
        // debugger
        let res = {};
        let matrix = this.getEvoMatrix(label_id);
        let sankey = [];
        let k = 0;
        let parray = [];
        let input_used = {}, output_used = {};

        for (let j = 0; j < matrix.length; j++) {
            for (let i = 0; i < matrix.length; i++) {
                if (Math.abs(matrix[i][j]['magnitude'] - 0) > precision) {
                    if (filter_unused & !matrix[i][j]['used']) {
                        continue
                    }
                    sankey[k] = {};
                    sankey[k]['maganitude'] = matrix[i][j]['magnitude'];
                    sankey[k]['phase'] = matrix[i][j]['phase'];
                    sankey[k]['amplitude'] = matrix[i][j]['amplitude'];
                    sankey[k]['used'] = matrix[i][j]['used'];
                    sankey[k]['from_id'] = j;
                    sankey[k]['to_id'] = i;
                    sankey[k]['y_index'] = k;
                    sankey[k]['ratio'] = matrix[i][j]['ratio'];
                    if (per)
                        parray.push(i);

                    input_used[j] = true;
                    output_used[i] = true;
                    k++;

                }
            }
        }
        //console.log('parray',parray);
        if (per)
            res['permute'] = parray;
        else
            res['permute'] = range(0, matrix.length);
        res['sankey'] = sankey;

        if (filter_unused) {
            // let new_index_input = {}
            // let 
            input_state.bases = input_state.bases.filter(elm => input_used[elm.id])
            output_state.bases = output_state.bases.filter(elm => output_used[elm.id])
        }
        // debugger
        return res;
    }

    _postProcess(state) {
        let max_magn = state['input_state']['max_magn'] > state['output_state']['max_magn'] ? state['input_state']['max_magn'] : state['output_state']['max_magn'];
        state['input_state']['max_magn'] = max_magn;
        state['output_state']['max_magn'] = max_magn;
        for (let key in state) {
            for (let i = 0; i < state[key]['bases'].length; i++) {
                if (max_magn != 0) {
                    for (let j = 0; j < state[key]['bases'][i]['related_bases'].length; j++) {
                        state[key]['bases'][i]['related_bases'][j]['ratio'] = state[key]['bases'][i]['related_bases'][j]['magnitude'] / max_magn;
                    }
                    state[key]['bases'][i]['ratio'] = state[key]['bases'][i]['magnitude'] / max_magn;
                }
            }
        }

        return state;
    }

    getState(label_id) {
        let state = {};
        state['input_state'] = this._makeState(label_id, 'start');
        state['output_state'] = this._makeState(label_id, 'end');
        state = this._postProcess(state);
        return state;
    }

    getInputState(label_id) {
        return this._makeState(label_id, 'start');
    }

    getOutputState(label_id) {
        return this._makeState(label_id, 'end');
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
        this.numBits = index[1]-index[0];
        this.binary_qubits = qubit12binary(range(...index))  // 相对于整个电路的
        this.true_wires = range(...index)
        // range(...index).reduce((sum, val) => sum | pow2(val), 0)  //TODO:check一下对不对
        // debugger
        // 0 0x1
        // 1 0x2
    }

    // TODO: 之后写个真的
    sample(times) {
        const { qc, name } = this
        const { operations } = qc
        let var_state = qc.getVarState(operations.length - 1)
        let self_state = var_state[name].prob

        self_state = self_state.map((prob, index) => {
            return {
                'base': index,
                'weight':  prob,
            }
        })

        let r = range(0, times).map(time=> weight_rand(self_state).base)
        // debugger
        return r
    }

    parseBinaryQubits(binary_qubits) {
        if (binary_qubits !== undefined) {
            const qubits = binary2qubit1(binary_qubits).map(qubit => qubit + this.index[0])
            return qubits
        } else {
            return range(...this.index, true)  // 从0开始的0-qubit number - 1
        }
    }

    // 这返回的还是二进制的,将自己内部的换算成全局的二进制
    // TODO: 判断下比特存不存在，有没有溢出
    _old_bits(binary_qubits) {
        if (binary_qubits !== undefined) {
            const qubits = binary2qubit1(binary_qubits).map(qubit => qubit + this.index[0])
            return qubit12binary(qubits)
        } else {
            return this.binary_qubits  // 从0开始的0-qubit number - 1
        }
    }

    bits(wires)
    {
        if( wires !== undefined)
        {
            if(typeof(wires) == 'number'){
                return [wires +this.index[0]]
            }
            let new_wires = wires.map(wire => wire + this.index[0]);
            return new_wires;
        }
        else
        {
            return this.true_wires;
        }
    }


    h(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.h(new_wires, column)
    }
    id(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.id(new_wires, column)
    }
    x(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.x(new_wires, column)
    }
    y(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.y(new_wires, column)
    }
    z(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.z(new_wires, column)
    }
    srn(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.srn(new_wires, column)
    }
    srndg(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.srndg(new_wires, column)
    }
    r2(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.r2(new_wires, column)
    }
    r4(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.r4(new_wires, column)
    }
    r8(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.r8(new_wires, column)
    }   
    s(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.s(new_wires, column)
    }
    t(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.t(new_wires, column)
    }
    sdg(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.sdg(new_wires, column)
    }
    tdg(wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.tdg(new_wires, column)
    }

    had(wires = undefined, column = undefined) {
        this.h(wires, column);
    }
    hadamard(wires = undefined, column = undefined) {
        this.had(wires, column);
    }
    not(wires = undefined, column = undefined)
    {
        this.x(wires, column);
    }
    phase(phi, wires = undefined, column = undefined)
    {
        this.rz(phi, wires, column)
    }

    rx(theta, wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.rx(theta, new_wires, column)
    }   
    ry(theta, wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.ry(theta, new_wires, column)
    }
    rz(phi, wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.rz(phi, new_wires, column)
    }
    u1(lambda, wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.u1(lambda, new_wires, column)
    }
    u2(phi, lambda, wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.u2(phi, lambda, new_wires, column)
    }
    u3(theta, phi, lambda, wires = undefined, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.u3(theta, phi, lambda, new_wires, column)
    }

    swap(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.swap(new_wires, column)
    }
    srswap(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.srswap(new_wires, column)
    }
    iswap(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.iswap(new_wires, column)
    }
    cx(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.cx(new_wires, column)
    }
    cy(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.cy(new_wires, column)
    }
    cz(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.cz(new_wires, column)
    }
    ch(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.ch(new_wires, column)
    }
    csrn(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.csrn(new_wires, column)
    }
    cr2(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.cr2(new_wires, column)
    }
    cr4(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.cr4(new_wires, column)
    }
    cr8(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.cr8(new_wires, column)
    }
    cs(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.cs(new_wires, column)
    }
    ct(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.ct(new_wires, column)
    }
    csdg(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.csdg(new_wires, column)
    }
    ctdg(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.ctdg(new_wires, column)
    }

    crx(theta, wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.crx(theta, new_wires, column)
    }
    cry(theta, wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.cry(theta, new_wires, column)
    }
    crz(phi, wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.crz(phi, new_wires, column)
    }
    cu1(lambda, wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.cu1(lambda, new_wires, column)
    }
    cu2(phi, lambda, wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.cu2(phi, lambda, new_wires, column)
    }
    cu3(theta, phi, lambda, wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.cu3(theta, phi, lambda, new_wires, column)
    }
    xy(phi, wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.xy(phi, new_wires, column)
    }
    ms(theta, wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.ms(theta, new_wires, column)
    }
    yy(theta, wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.yy(theta, new_wires, column)
    }
    zz(theta, wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.zz(theta, new_wires, column)
    }

    ccx(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.ccx(new_wires, column)
    }
    cswap(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.cswap(new_wires, column)
    }
    csrswap(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.csrswap(new_wires, column)
    }
    

    cnot(wires, column = undefined)
    {
        this.cx(wires,column)
    }
    ccnot(wires, column = undefined)
    {
        this.ccx(wires,column)
    }

    ncnot(wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.ncnot(new_wires, column)

    }
    ncphase(phi, wires, column = undefined)
    {
        let new_wires = this.bits(wires)
        this.qc.ncphase(phi, new_wires, column)
    }

    // read的应该不是数组
    // read(binary_qubits) {
    //     const { qc } = this
    //     binary_qubits = this.bits(binary_qubits)
    //     return qc.read(binary_qubits)
    // }


    // write(value, binary_qubits) {
    //     const { qc } = this
    //     // console.log(binary2qubit1(binary_qubits))
    //     binary_qubits = this.bits(binary_qubits)
    //     // console.log(binary2qubit1(binary_qubits))
    //     // debugger
    //     qc.write(value, binary_qubits)
    // }

    exchange(another_qint) {
        let { qc, true_wires } = this
        qc.exchange(true_wires, another_qint.true_wires)
    }




    // nop() {
    //     this.qc.nop()
    // }

    old_cnot(another_qint)
    {
        this.qc.cnot(another_qint.bits(),this.bits())
    }



    // cphase(rotation, another_qint = undefined) {
    //     if(another_qint == undefined){
    //         let { qc, index, binary_qubits} = this

    //         qc.cphase(rotation, binary_qubits, undefined);
           
    //     }
    //     else{
    //         console.warn('this function is not well implemented')
    //         let { qc, binary_qubits } = this
    //         qc.cphase(rotation, binary_qubits, another_qint.binary_qubits)
    //     }
    // }
    

    // TODO: console要换成throw
    // TODO: 还没有检查过
    // condition类似qint.bits(0x4)
    add(value, condition = undefined) {
        // condition 用的是绝对的位置

        const { qc, binary_qubits } = this
        const v_start_qubit = this.index[0], v_end_qubit = this.index[this.index.length - 1]

        const condition_qubits = condition ? condition : []

        // debugger
        if (typeof (value) === 'number') {
            if (Math.round(value) !== value) {
                console.error(value, 'should be integer')
                debugger
                return
            }

            let qubits_start = qc.parseBinaryQubits(value)  // 从大到小, 相对于变量的  //我怎么觉得应该是this
            qubits_start.reverse()
            let qubits = qc.parseBinaryQubits(binary_qubits,)  // 从大到小
            qubits.reverse()
            // debugger
            qubits_start.forEach((qubit_start, index) => {
                let qc_qubit_start = qubits[qubit_start]
                let ranges = range(qc_qubit_start, v_end_qubit)
                ranges.reverse()

                ranges.forEach((qubit, index) => {
                    let controls = [...condition_qubits, ...range(qc_qubit_start, qubit)]
                    let target = [qubit]
                    let total =controls.concat(target)
                    if(total.length == 1)
                        qc.not(total)
                    else
                        qc.ncnot(total);
                })
            })

        } else if (value instanceof QInt) {
            let self_qubits = qc.parseBinaryQubits(binary_qubits)
            let value_qubits = qc.parseBinaryQubits(value.binary_qubits)
            value_qubits.reverse()  //从小到大

            value_qubits.forEach((value_qubit, value_index) => {
                let self_qubits_involved = self_qubits.filter((self_qubit, self_index) => {
                    if (self_index >= self_qubits.length - value_index) {
                        return false;
                    } else {
                        return true;
                    }
                })
                // debugger
                self_qubits_involved.forEach((self_qubit, self_index) => {
                    let target = [self_qubit]
                    let controls = [...self_qubits_involved.filter(elm => elm < self_qubit), value_qubit]
                    //controls = qubit12binary(controls)
                    let total =controls.concat(target)
                    if(total.length == 1)
                        qc.not(total);
                    else
                        qc.ncnot(total)
                })
            })

        }

    }


    // TODO:
    subtract(value, condition = undefined) {
        const { qc, binary_qubits } = this

        const v_start_qubit = this.index[0], v_end_qubit = this.index[this.index.length - 1]  // TODO: 封装成属性

        if (typeof (value) === 'number') {
            if (Math.round(value) !== value) {
                console.error(value, 'should be integer')
                debugger
                return
            }

            let qubits_start = qc.parseBinaryQubits(value)  // 从大到小 [1, 0]， 相对于变量的
            let qubits = qc.parseBinaryQubits(binary_qubits,)  // 从大到小
            qubits.reverse()
            // debugger
            qubits_start.forEach((qubit_start, index) => {
                let qc_qubit_start = qubits[qubit_start]
                range(qc_qubit_start, v_end_qubit).forEach((qubit, index) => {
                    let controls = range(qc_qubit_start, qubit)
                    let target = [qubit]
                    let total =controls.concat(target)
                    console.log(total);
                    if(total.length == 1)
                        qc.not(total);
                    else
                        qc.ncnot(total)
                })
            })

        } else if (value instanceof QInt) {
            console.error('substract has not been implemented now')
        }
    }

    // value: qint
    // TODO:
    addSquared(qint, condition = undefined) {

    }


    // https://oreilly-qc.github.io/?p=7-8#
    invQFT() {
        let { qc, index } = this
        let qubits = range(...index)

        for (let start = index[0], end = index[1] - 1; start < end; start++, end--) {
            // debugger
            qc.swap([start,end])
        }

        qubits.forEach((qubits1, index1) => {
            qc.had([qubits1])
            qubits.slice(index1 + 1).forEach((qubits2, index2) => {
                let phi = 90 / pow2(index2)
                qc.ncphase(phi, [qubits1,qubits2])
            })
        })

    }

    // TODO: 不应该用二进制的，应该改掉
    QFT() {
        let { qc, index } = this
        let qubits = range(...index)
        qubits.reverse()

        qubits.forEach((qubits1, index1) => {
            qc.had([qubits1])
            qubits.slice(index1 + 1).forEach((qubits2, index2) => {
                let phi = - 90 / pow2(index2)
                // console.log(phi);
                qc.ncphase(phi, [qubits1, qubits2])
            })
        })

        for (let start = index[0], end = index[1] - 1; start < end; start++, end--) {
            qc.swap([start,end])
        }

        // qc.swap(pow2(qubits[0]), pow2(qubits[qubits.length - 1]))
    }

    Grover(conditional_bits = undefined)
    {
        let { qc, index } = this
        //let qubits = range(...index)
        if(conditional_bits == undefined)
            conditional_bits = this.bits()
        this.had()
        this.not()
        
        qc.ncphase(180, conditional_bits);

        this.not()
        this.had()


    }

    

}
// TODO: ccnot, cccnot 也要加

export {
    QInt,

}