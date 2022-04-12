// Initialize
var num_qubits = 6;
qc.reset(num_qubits);
var ancillary = qint.new(3, 'a');
var b = qint.new(3, 'b');

ancillary.write(0);


ancillary.write(0x2);
qc.startlabel('a = (2, 6)');
ancillary.hadamard(0x4);
qc.endlabel('a = (2, 6)');

qc.nop();


b.write(1);
qc.startlabel('b = (1, 3)');
b.hadamard(0x2);
b.phase(45, 0x2);
qc.endlabel('b = (1, 3)');


qc.nop();

qc.startlabel('a -= 3');
ancillary.subtract(2);
qc.endlabel('a -= 3');

qc.nop();


qc.startlabel('if (a > 4) then b++');
b.add(1, ancillary.bits(0x4));
qc.endlabel('if (a > 4) then b++');

qc.nop();

qc.startlabel('a += 3');
ancillary.add(3);
qc.endlabel('a += 3');