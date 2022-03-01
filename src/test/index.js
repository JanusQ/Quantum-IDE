
import { showInDebuggerArea } from '../simulator/CommonFunction';
import QCEngine from '../simulator/MyQCEngine'

var qc = new QCEngine()
var {qint} = qc


// Programming Quantum Computers
//   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
//   O'Reilly Media

// To run this online, go to http://oreilly-qc.github.io?p=7-7

var num_qubits = 6;
qc.reset(num_qubits);
var a = qint.new(4, 'a');
var b = qint.new(2, 'b');

// prepare
qc.label('prepare');
// debugger
a.write(1);
a.hadamard(0x4);
a.phase(45, 0x4);
b.write(1);
b.hadamard(0x2);
b.phase(90, 0x2);
qc.nop();
qc.label('');
qc.nop();

// a += b
qc.label('a += b');
a.add(b);
qc.label('');
qc.nop();


console.log("hello 2022");
let filt = {'a':[0,1,2],'b':[0,1]};
console.log(filt);
console.log(qc.get_index(3,filt));
console.log("end 2002");
