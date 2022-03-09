import { showInDebuggerArea } from '../simulator/CommonFunction';
import QCEngine from '../simulator/MyQCEngine'
import {
    create, all,
} from 'mathjs'
const config = { };
const math = create(all, config);

var qc = new QCEngine()
var {qint} = qc

// Programming Quantum Computers
//   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
//   O'Reilly Media

// To run this online, go to http://oreilly-qc.github.io?p=7-7

qc.reset(6);

var a = qint.new(2, 'a');
var b = qint.new(2, 'b');
var c = qint.new(2, 'c');

a.had()
qc.cnot(0x3, 0x4)
qc.cnot(0x3, 0x8)


console.log("hello 2022");
console.log(qc._variable_filter(1,'a',{'a':[0,1]}));
//console.log(math.multiply(complex(1,2),0.5));
console.log("end 2002");