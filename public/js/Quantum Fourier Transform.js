// QFT

reset(7);

var sender = qint.new(3, 'S')
var receiver = qint.new(3, 'R')
var a = qint.new(1, 'A')

//qc.write(0x0)

let label = 'GenInfo'
startlabel(label)
// sender.ry(135, 0x2 | 0x4)
ry(135, [1,2] ) //| 0x8 | 0x16
qc.disableDisplay(label)
endlabel(label)


label = 'InvQFT'
startlabel(label)
sender.invQFT()
endlabel(label)


label = 'Send'
startlabel(label)
sender.exchange(receiver)
endlabel(label)
qc.disableDisplay(label)



label = 'QFT'
startlabel(label)
receiver.QFT()
endlabel(label)


// label = 'A = R>=4'
// qc.startlabel(label)
// qc.cnot(receiver.bits(0x4), a.bits(0x1))
// qc.endlabel(label)

// qc.nop()


// label = 'High freq++'
// qc.startlabel(label)
// receiver.add(1, a.bits(0x1))
// qc.endlabel(label)


// let results = receiver.sample(4)
// results.forEach(result=>{
//     qc.print('QFT Frequency: ' + result)
// })

// results = receiver.read()