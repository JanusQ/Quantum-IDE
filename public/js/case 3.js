// 论文case 1
// TODO: 优化下variable state点击的速度

// QFT 的case

qc.reset(9);

var provider = qint.new(4, 'S')
var receiver = qint.new(4, 'R')
var ancillary = qint.new(1, 'A')

qc.write(0x0)

let label = 'set freq'
qc.startlabel(label)
provider.ry(135, 0x8)
provider.ry(135, 0x4)
qc.endlabel(label)


qc.nop()

label = 'invQFT'
qc.startlabel(label)
provider.invQFT()
qc.endlabel(label)

qc.nop()
// label = 'send'
// qc.startlabel(label)
provider.exchange(receiver)
// qc.endlabel(label)
qc.nop()

// 加一个conditional ry

label = 'QFT'
qc.startlabel(label)
receiver.QFT()
qc.endlabel(label)

qc.nop()

// label = 'entangle'
// qc.startlabel(label)
// qc.cnot(receiver.bits(0x4), ancillary.bits(0x1))
// qc.endlabel(label)

// qc.nop()
// qc.nop()

label = 'increase freq >= 8'
qc.startlabel(label)
qc.cnot(receiver.bits(0x8), ancillary.bits(0x1))
receiver.add(1, ancillary.bits(0x1))
qc.endlabel(label)