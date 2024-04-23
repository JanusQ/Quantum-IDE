//set "010"
var str = "010";

var n = str.length;
qc.reset(2*n);


var oracle = qint.new(n, 'oracle');
var register= qint.new(n, 'register');

//Write secret string
startlabel('secret string');
oracle.x([1]);
endlabel('secret string');



//Initialize register in superposition of all values
startlabel('initialize register')

register.had();

qc.endlabel('initialize register')



qc.startlabel('call oracle');
let count = 0;
for(count=0; count<n;count++)
    cz([...oracle.bits([count]),...register.bits([count])]);

qc.endlabel('call oracle');




// Undo Hadamard in the register and read value
startlabel('read secret string');
register.had();

endlabel('read secret string');