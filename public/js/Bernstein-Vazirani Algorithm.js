
var str = "010";


var n = str.length;
qc.reset(2*n);


var oracle = qint.new(n, 'oracle');
var register= qint.new(n, 'register');


qc.startlabel('secret string');
oracle.write(0b010);
qc.nop();
qc.endlabel('secret string');
qc.nop();


qc.startlabel('initialize register')
qc.nop();
register.write(0);
register.had();
qc.nop();
qc.endlabel('initialize register')


qc.nop();
qc.startlabel('call oracle');
qc.nop();
register.cphase(180, oracle);
qc.nop();
qc.endlabel('call oracle');
qc.nop();


qc.startlabel('read secret string');
qc.nop();
register.had();
register.read();
qc.nop();
qc.endlabel('read secret string');