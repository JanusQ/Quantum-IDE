
// 两个变量相加的case
var num_qubits = 6;
qc.reset(num_qubits);
var a = qint.new(2, 'a');
var b = qint.new(2, 'b');
var c = qint.new(2, 'c');


qc.write(0x0)


qc.startlabel('had')
qc.hadamard()
qc.endlabel('had')
// var state_vector = range(0, pow2(6)).map(elm=>complex(0, 0))
// state_vector[1] = complex(1, 0)
// qc.setState(state_vector)


qc.nop()

qc.startlabel('a += b')
a.add(b)
qc.endlabel('a += b')




console.log(qc.operations)
// TODO: 线不管咋样都得画到底