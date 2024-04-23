// qc.reset(6);

// var a = qint.new(2, 'a');
// var b = qint.new(2, 'b');
// var c = qint.new(2, 'c');

// a.had()
// // qc.ccnot(0x3, 0x4)
// // qc.cnot(0x3, 0x4)
// qc.cnot(0x3, 0x8)

qc.reset(6);

var a = qint.new(6, 'a');
//var b = qint.new(2, 'b');
//var c = qint.new(2, 'c');
qc.write(0x0)
a.had()
// qc.ccnot(0x3, 0x4)
// qc.cnot(0x3, 0x4)
//qc.cnot(0x3, 0x8)