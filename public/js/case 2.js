// TODO：之后把qc去了
// conditional 

// Initialize
var num_qubits = 6;
qc.reset(num_qubits);
var a = qint.new(3, 'a');
var b = qint.new(3, 'b');

a.write(0);


a.write(0x2);
qc.startlabel('a = (2, 6)');
a.hadamard(0x4);
qc.endlabel('a = (2, 6)');

qc.nop();


b.write(1);
qc.startlabel('b = (1, 3)');
b.hadamard(0x2);
b.phase(45, 0x2);
qc.endlabel('b = (1, 3)');


qc.nop();


// if a < 3 then b += 1
qc.startlabel('a -= 3');
a.subtract(2);  //原先的里面-6和加3是一样的
qc.endlabel('a -= 3');

qc.nop();

// debugger
qc.startlabel('if (a > 4) then b++');
b.add(1, a.bits(0x4));
qc.endlabel('if (a > 4) then b++');

qc.nop();

qc.startlabel('a += 3');
a.add(3);
qc.endlabel('a += 3');