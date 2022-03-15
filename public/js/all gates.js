
var num_qubits = 6;
qc.reset(num_qubits);
var a = qint.new(6, 'a');
console.log(a)
// prepare
qc.startlabel('write');
// debugger
a.write(1);
qc.endlabel('write')


qc.startlabel('not')
qc.not(0x5);
qc.endlabel('not')
qc.nop()

qc.startlabel('cry')
qc.cry(45, 0x4, 0x1);
qc.endlabel('cry')
qc.nop()

qc.startlabel('ry')
qc.ry(45, 0x5);
qc.endlabel('ry')
qc.nop()




qc.startlabel('hadamard')
a.hadamard(0x4);
qc.endlabel('hadamard')

qc.startlabel('phase')
a.phase(45, 0x8);
qc.endlabel('phase')


qc.startlabel('cnot')
qc.cnot(0x4, 0x2);
qc.endlabel('cnot')

qc.startlabel('nop')
a.nop();
qc.endlabel('nop')

qc.startlabel('ccphase')  //就是ccphase
a.cphase(0x5, 0x2)
qc.endlabel('ccphase')

qc.startlabel('swap')
qc.swap(0x4, 0x2)
qc.endlabel('swap')


qc.startlabel('self defined')
// 对于所有文档里面没有出现的门，都用self defined gate那个图标，涉及的比特用qc.getQubitsInvolved(operation)获得
qc.apply('self defined gate', [0,1,2])
qc.endlabel('self defined')

// qc.operations.forEach((op, i)=>{
//     const {operation, state_str, result} = op
//     console.log(op)
// })
