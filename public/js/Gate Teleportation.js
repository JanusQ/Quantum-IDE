// Programming Quantum Computers
//   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
//   O'Reilly Media

// To run this online, go to http://oreilly-qc.github.io?p=14-GT



qc.reset(4);
var alice = qint.new(1, 'alice');
var epa    = qint.new(1, 'ep-a');
var epb    = qint.new(1, 'ep-b');
var bob   = qint.new(1, 'bob');

qc.write(0);
qc.nop();


// Prepare Alice's qubit
qc.startlabel('prep alice');
alice.had();
alice.phase(45);
alice.had();
qc.endlabel('prep alice');
qc.nop();


//Prepare Bob's qubit
qc.startlabel('prep bob');
bob.had();
bob.phase(30);
bob.had();
qc.endlabel('prep bob');
qc.nop();

// Prepare standard entangled state that will be shared by Alice and Bob
qc.startlabel('entangle');
epa.had();
epb.cnot(epa);
qc.endlabel('entangle');
qc.nop();

// Teleport and apply conditional operation (portrayed here as quantum gates, 
// but they are acting from classical information)
qc.startlabel('teleport');
epa.cnot(alice);
qc.read(epa.bits());
epb.cnot(epa);
bob.cnot(epb);
epb.had();
qc.read(epb.bits());
alice.cphase(180, epb);
qc.endlabel('teleport');
qc.nop();


//This operation should be equal to applying a CNOT and undoing the preparationg
// of Alice's and Bob's qubits. We can verify by applying the operations in reverse
qc.startlabel('verify');
bob.cnot(alice);
bob.had();
bob.phase(-30);
bob.had();
alice.had();
alice.phase(-45);
alice.had();
qc.endlabel('verify');
//Note that all the outcomes correspond to Alice and Bob's qubits 
// being zero (first and last digits of the binary representation of the register):
// If epa=0 and epb=0, then output state is |0000> = |0>
// If epa=1 and epb=0, then output state is |0010> = |2>
// If epa=0 and epb=1, then output state is |0100> = |4>
// If epa=1 and epb=1, then output state is |0110> = |6>
