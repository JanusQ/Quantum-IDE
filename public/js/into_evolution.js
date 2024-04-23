// 介绍图片时使用的case
// TODO：之后把qc去了
// conditional 

// Initialize
var num_qubits = 6;
qc.reset(num_qubits);

var a = qint.new(3, 'a');
var b = qint.new(1, 'b');
var c = qint.new(2, 'c');


b.write(0x0);
a.write(0x0);
// b.hadamard();
b.ry(60)
a.ry(30, 0x1);
// a.phase(45, 0x2);

c.ry(60, 0x3);

qc.nop();
qc.nop();

qc.startlabel('if (b == 1) then a+=1');
a.add(2, b.bits(0x1));
qc.endlabel('if (b == 1) then a+=1');

qc.nop();

