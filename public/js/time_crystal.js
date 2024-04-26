var num_qubits = 4
reset(num_qubits)
var prepare = qint.new(4, 'prepare')

const delta = 0.01
const pi = 3.14159265
var idx = 0

// Values from uniform distribution between 0 and 2
const random_values = [
  0.22426181, 1.05960041, 1.09576918, 1.58783058, 0.90771032, 1.2948024,
  0.7208567, 0.07844374, 0.43039661, 0.40030781, 1.34545094, 1.5267322,
  0.55346064, 0.31103435, 0.7014411, 1.94524481, 0.58360538, 1.26609412,
  0.18540632, 0.0080948,
]

// The first step
// startlabel("Init")
// rx(180, [0, 1])
// endlabel("Init")
// startlabel("The circuit of the 1st step");
// rx(180/pi*(pi - 2*delta), [0, 1, 2, 3])
// endlabel("The circuit of the 1st step");

// The second step
// In this example, we prepare initial state by randomly implementing
// rx gates (rotation of pi) at the beginning

// prepare an initial state
startlabel('Init')
rx(180, [0, 1, 2, 3])
endlabel('Init')

// Repeat for 20 times
startlabel('The circuit of the 2nd step')
rx((180 / pi) * (pi - 2 * delta), [0, 1, 2, 3])
crz((180 / pi) * pi, [1, 0])
crz((180 / pi) * pi, [3, 2])
crz((180 / pi) * pi, [2, 1])
ry((180 / pi) * (-2 * (1 + random_values[idx])), [1])
idx += 1
ry((180 / pi) * (-2 * (1 + random_values[idx])), [2])
idx += 1
crz((-180 / pi) * pi, [1, 0])
crz((-180 / pi) * pi, [3, 2])
crz((-180 / pi) * pi, [2, 1])
endlabel('The circuit of the 2nd step')

// Repeat for the 3rd time

// startlabel("Init")
// rx(180, [1, 3])
// endlabel("Init")

// startlabel("The circuit of the 3rd step");
// rx(180/pi*(pi - 2*delta), [0, 1, 2, 3])
// crz(180/pi*(pi), [1, 0])
// crz(180/pi*(pi), [3, 2])
// crz(180/pi*(pi), [2, 1])
// ry(180/pi*(-2*(1 + random_values[idx])), [1])
// idx += 1;
// ry(180/pi*(-2*(1 + random_values[idx])), [2])
// idx += 1;
// crz(-180/pi*(pi), [1, 0])
// crz(-180/pi*(pi), [3, 2])
// crz(-180/pi*(pi), [2, 1])
// rx(180/pi*(pi - 2*delta), [0, 1, 2, 3])
// endlabel("The circuit of the 3rd step");

// ……
