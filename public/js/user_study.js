
qc.reset(2);
var a = qint.new(1, 'V1')
var b = qint.new(1, 'V2')

qc.write(0b01)
qc.had();

qc.startlabel('simple');

// qc.ry(60, a.bits(0x1))
// qc.cphase(45, a.bits(0x1) | b.bits(0x1));
// qc.phase(60, a.bits(0x1));

qc.phase(45, a.bits(0x1));
qc.endlabel('simple');

// debugger