

qc.reset(4);
var alice = qint.new(1, 'alice');
var epa    = qint.new(1, 'ep-a');
var epb    = qint.new(1, 'ep-b');
var bob   = qint.new(1, 'bob');

qc.write(0);
qc.nop();


qc.startlabel('prep alice');
alice.had();
alice.phase(45);
alice.had();
qc.endlabel('prep alice');
qc.nop();


qc.startlabel('prep bob');
bob.had();
bob.phase(30);
bob.had();
qc.endlabel('prep bob');
qc.nop();

qc.startlabel('entangle');
epa.had();
epb.cnot(epa);
qc.endlabel('entangle');
qc.nop();


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



qc.startlabel('verify');
bob.cnot(alice);
bob.had();
bob.phase(-30);
bob.had();
alice.had();
alice.phase(-45);
alice.had();
qc.endlabel('verify');

