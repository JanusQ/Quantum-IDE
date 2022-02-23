// Programming Quantum Computers
//   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
//   O'Reilly Media

// To run this online, go to http://oreilly-qc.github.io?p=5-2

// Initialize
var num_qubits = 6;
qc.reset(num_qubits);
var a = qint.new(6, 'a');
console.log(a)
// prepare
qc.label('write');
// debugger
a.write(1);

qc.label('hadamard')
a.hadamard(0x4);

qc.label('phase')
a.phase(45, 0x8);

qc.label('cnot')
a.cnot(0x5, 0x2);

qc.label('nop')
a.nop();

qc.label('cphase')
a.cphase(0x7, 0x2)

qc.operations.forEach((op, i)=>{
    const {operation, state_str, result} = op
    console.log(op)
})
