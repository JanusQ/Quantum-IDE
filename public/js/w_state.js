var num_qubits = 4;
reset(num_qubits);
var prepare = qint.new(4, 'prepare');

startlabel("init");
prepare.ry(180, [3])
endlabel("init");

// implement CG gate
startlabel("CG gate1");
ry(-60,[2])
cz([2, 3])
ry(60,[2])
endlabel("CG gate1");

// implement CG gate
startlabel("CG gate2");
ry(-54.75,[1])
cz([1, 2])
ry(54.75,[1])
endlabel("CG gate2")

// implement CG gate
startlabel("CG gate3");
ry(-45,[0])
cz([0, 1])
ry(45,[0])
endlabel("CG gate3")


// entangle with neighbering qubits
cnot([2, 3])
cnot([1, 2])
cnot([0, 1])
