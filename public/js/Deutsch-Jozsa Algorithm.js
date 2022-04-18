
function oracle_constant(reg,scratch) {
    scratch.phase(180);
}


function oracle_balanced(reg, scratch) {
    scratch.cz(180,reg);
}



qc.reset(4);
var reg = qint.new(3,'reg');
var scratch = qint.new(1,'scratch');

qc.write(0);


qc.startlabel('scratch in |->');
scratch.had();
scratch.phase(180);
qc.nop();
qc.endlabel('scratch in |->');
qc.nop();



qc.startlabel('all values');
qc.nop();
reg.had();
qc.nop();
qc.endlabel('all values');

// Apply function
oracle_constant(reg, scratch);
