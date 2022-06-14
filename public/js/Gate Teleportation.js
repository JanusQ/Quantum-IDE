reset(4);
var alice = qint.new(1, 'alice');
var epa    = qint.new(1, 'ep-a');
var epb    = qint.new(1, 'ep-b');
var bob   = qint.new(1, 'bob');


// Prepare Alice's qubit
startlabel('prep alice');
alice.had();
alice.phase(45);
alice.had();
endlabel('prep alice');

//Prepare Bob's qubit
startlabel('prep bob');
bob.had();
bob.phase(30);
bob.had();
endlabel('prep bob');

// Prepare standard entangled state that will be shared by Alice and Bob
startlabel('entangle');
epa.had();
cnot([1,2]);
endlabel('entangle');

// Teleport and apply conditional operation (portrayed here as quantum gates, 
// but they are acting from classical information)
startlabel('teleport');
cnot([0,1]);
cnot([1,2]);
cnot([2,3]);
epb.had();

ncphase(180, [0,2]);
endlabel('teleport');


//This operation should be equal to applying a CNOT and undoing the preparationg
// of Alice's and Bob's qubits. We can verify by applying the operations in reverse
startlabel('verify');
cnot([0,3]);
bob.had();
bob.phase(-30);
bob.had();
alice.had();
alice.phase(-45);
alice.had();
endlabel('verify');
//Note that all the outcomes correspond to Alice and Bob's qubits 
// being zero (first and last digits of the binary representation of the register):
// If epa=0 and epb=0, then output state is |0000> = |0>
// If epa=1 and epb=0, then output state is |0010> = |2>
// If epa=0 and epb=1, then output state is |0100> = |4>
// If epa=1 and epb=1, then output state is |0110> = |6>
