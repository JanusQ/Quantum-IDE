// 论文case 1
// TODO: 优化下variable state点击的速度

// QFT 的case

var num_qubits = 8;
qc.reset(num_qubits);

var signal_1 = qint.new(num_qubits/2, 'S1')
var signal_2 = qint.new(num_qubits/2, 'S2')

qc.write(0x0)

let label = 'set freq'
qc.startlabel(label)
signal_1.not(0x4)
signal_1.ry(30, 0x1)
qc.endlabel(label)


qc.nop()

label = 'invQFT'
qc.startlabel(label)
signal_1.invQFT()
qc.endlabel(label)

qc.nop()

// label = 'send'
// qc.startlabel(label)
signal_1.exchange(signal_2)
// qc.endlabel(label)

qc.nop()

label = 'QFT'
qc.startlabel(label)
signal_2.invQFT()
qc.endlabel(label)
