// 马科夫序列

var num_qubits = 5;
qc.reset(num_qubits);

var step_1 = qint.new(1, 'step 1')
var step_2 = qint.new(1, 'step 2')
var step_3 = qint.new(1, 'step 3')
var step_4 = qint.new(1, 'step 4')

var estimation =  qint.new(1, 'estimation')

qc.write(0)  //现在不write第一个是空的

qc.startlabel('preprae')

qc.ry(45, 0x1,)
qc.cry(45, 0x1, 0x2)
qc.cry(45, 0x2, 0x4)
// qc.cry(45, 0x4, 0x8)
qc.endlabel('preprae')

// 8 + 16 + 32

estimation.write(0x1)
qc.cphase(30, 0x1, 0x10)
qc.cphase(30, 0x2, 0x10)
qc.cphase(30, 0x4, 0x10)
// qc.cphase(10, 0x1, 0x38)

// TODO：还是不要用二进制了，太难受了
// qc.cphase(10, 0x1, 0x38)
// qc.cphase(10, 0x2, 0x38)
// qc.cphase(10, 0x4, 0x38)

// all.QFT()