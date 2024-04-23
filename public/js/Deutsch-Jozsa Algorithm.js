// Example of constant function
function oracle_constant(reg,scratch) {
    // Regardless of input x, oracle returns f(x) = 1
    scratch.phase(180);
}



reset(4);
var reg = qint.new(3,'reg');
var scratch = qint.new(1,'scratch');



// Prepare scratch qubit in |->
startlabel('scratch in |->');
scratch.had();
scratch.phase(180);
endlabel('scratch in |->');


//Prepare register in superposition of all values |00...0> to |11...1>
startlabel('all values');
reg.had();
endlabel('all values');

// Apply function
oracle_constant(reg, scratch);
