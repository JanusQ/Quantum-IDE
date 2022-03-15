// 论文case 1
// TODO: 优化下variable state点击的速度

// QFT 的case

qc.reset(9);

var sender = qint.new(4, 'S')
var receiver = qint.new(4, 'R')
var ancillary = qint.new(1, 'A')

qc.write(0x0)

let label = 'Generate data'
qc.startlabel(label)
sender.ry(135, 0x4 | 0x8)
// provider.ry(135, 0x4)

// TODO: 反着了
// let initial_state = tensorState(groundState(5), groundState(4, [7, 9]), )
// qc.setState(initial_state)
qc.endlabel(label)


qc.nop()

label = 'InvQFT'
qc.startlabel(label)
sender.invQFT()
qc.endlabel(label)

qc.nop()
// label = 'send'
// qc.startlabel(label)
sender.exchange(receiver)
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

label = 'Increase high freq'
qc.startlabel(label)
qc.cnot(receiver.bits(0x8), ancillary.bits(0x1))
receiver.add(1, ancillary.bits(0x1))
qc.endlabel(label)