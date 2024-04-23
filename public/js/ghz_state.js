var num_qubits = 4;
reset(num_qubits);
var control = qint.new(1, 'control');
var expand = qint.new(3, 'expand');

startlabel("initialization");
// initiaize the control qubit
control.hadamard([0]);
endlabel("initialization");

startlabel("entanglement");
// entangle with qubit_1
cnot([0, 1]);

// entangle with qubit_2
cnot([1, 2]);

// entangle with qubit_3
cnot([2, 3]);
endlabel("entanglement");