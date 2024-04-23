
reset(2);
var a = qint.new(1, 'a');
var b = qint.new(1, 'b');


startlabel('entangle');
a.had();           // Place into superposition
cnot([0,1]);         // Entangle
endlabel('entangle');

