// Secret oracle string
var str = "01";

// If string is length n, we need n qubits for the oracle and n for the register
var n = str.length;
reset(3*n);

var oracle = qint.new(n, 'oracle');
var register= qint.new(n, 'register');
var scratch = qint.new(n, 'scratch');


// Prepare register in superposition
register.had();

//Write secret string
startlabel('secret string');

oracle.x([0]);

endlabel('secret string');


// Call oracle
startlabel('oracle');

bit_or(register, oracle, scratch);

endlabel('oracle');
//qc.label('');



//Read scratch register (we can throw away results, they give us little information)

startlabel('read register');
register.had();
qc.endlabel('read register');
//qc.label('');

function bit_or(q1, q2, out)
{
    for (var i = 0; i < n; ++i)
    {
        var mask = i;
        not([...q1.bits([i]),...q2.bits([i])]);
        cnot([...q1.bits([i]),...q2.bits([i]),...out.bits([i])]);
        not([...q1.bits([i]),...q2.bits([i]),...out.bits([i])]);
    }

}

