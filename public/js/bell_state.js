qc.reset(6);

var a = qint.new(2, 'a');
var b = qint.new(2, 'b');
var c = qint.new(2, 'c');

a.had()
qc.cnot(0x3, 0x4)
qc.cnot(0x3, 0x8)