// Programming Quantum Computers
//   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
//   O'Reilly Media

// To run this online, go to http://oreilly-qc.github.io?p=5-2

// Initialize
var num_qubits = 6;
qc.reset(num_qubits);
var a = qint.new(4, 'a');
var b = qint.new(2, 'b');

// prepare
qc.startlabel('prepare');
// debugger
a.write(1);
a.hadamard(0x4);
a.phase(45, 0x4);
b.write(1);
b.hadamard(0x2);
b.phase(90, 0x2);
qc.nop();

qc.nop();
qc.endlabel('prepare');
// a += b
qc.startlabel('a += b');
a.add(b);
qc.endlabel('a += b');
qc.nop();

// qc.operations.forEach((op, i)=>{
//     const {operation, state_str, result} = op
//     console.log(op)
//     // if(operation == 'read'){
//     //     console.log(result)
//     // }
//     // console.log(state_str)
// })
