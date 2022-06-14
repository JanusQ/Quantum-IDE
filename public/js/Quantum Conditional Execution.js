// Initialize
var num_qubits = 6;
reset(num_qubits);
var ancillary = qint.new(3, 'a');
var b = qint.new(3, 'b');


ancillary.x([0]);
startlabel('a = (2, 6)');
ancillary.hadamard([2]);
endlabel('a = (2, 6)');


b.x([0]);
startlabel('b = (1, 3)');
b.hadamard([1]);
b.phase(45, [1]);
endlabel('b = (1, 3)');


startlabel('a -= 3');
ancillary.subtract(3);
endlabel('a -= 3');

startlabel('if (a > 4) then b++');
b.add(1, ancillary.bits([2]));
endlabel('if (a > 4) then b++');


startlabel('a += 3');
ancillary.add(3);
endlabel('a += 3');