// Secret oracle string
var str = "010";

// If string is length n, we need n qubits for the oracle and n for the register
var n = str.length;
qc.reset(2*n);


var oracle = qint.new(n, 'oracle');
var register= qint.new(n, 'register');

//Write secret string
qc.startlabel('secret string');
oracle.write(str);
qc.nop();
qc.endlabel('secret string');
qc.nop();


//Initialize register in superposition of all values
qc.startlabel('initialize register')
qc.nop();
register.write(0);
register.had();
qc.nop();
qc.endlabel('initialize register')

// Call oracle. 
// Bitwise multiplication of the strings is equivalent to performing AND. 
// We want the result of bitwise AND between oracle qubits and register qubits
// stored in the phase, we can use directly CZ gates without the need of ancillas

qc.nop();
qc.startlabel('call oracle');
qc.nop();
register.cphase(180, oracle);
qc.nop();
qc.endlabel('call oracle');
qc.nop();



// Undo Hadamard in the register and read value
qc.startlabel('read secret string');
qc.nop();
register.had();
register.read();
qc.nop();
qc.endlabel('read secret string');