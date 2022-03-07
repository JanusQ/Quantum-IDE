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
qc.cnot(0x4, 0x2);

qc.label('nop')
a.nop();

qc.label('ccphase')  //就是ccphase
a.cphase(0x5, 0x2)

qc.label('swap')
qc.swap(0x4, 0x2)


qc.label('self defined')
// 对于所有文档里面没有出现的门，都用self defined gate那个图标，涉及的比特用qc.getQubitsInvolved(operation)获得
qc.apply('self defined gate', [0,1,2])

// qc.operations.forEach((op, i)=>{
//     const {operation, state_str, result} = op
//     console.log(op)
// })
