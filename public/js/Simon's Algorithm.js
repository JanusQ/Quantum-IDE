// Secret oracle string
var str = "01";

// If string is length n, we need n qubits for the oracle and n for the register
var n = str.length;
qc.reset(3*n);

var oracle = qint.new(n, 'oracle');
var register= qint.new(n, 'register');
var scratch = qint.new(n, 'scratch');

// Initialize register and scratch register
scratch.write(0);

// Prepare register in superposition
register.write(0);
register.had();

//Write secret string
qc.startlabel('secret string');
qc.nop();
oracle.write(str);
qc.nop();
qc.label('');
qc.nop();
qc.endlabel('secret string');


// Call oracle
qc.startlabel('oracle');

bit_or(register, oracle, scratch);

qc.endlabel('oracle');
//qc.label('');
qc.nop();


//Read scratch register (we can throw away results, they give us little information)
scratch.read();

//Read register
qc.startlabel('read register');
register.had();
var output = register.read();
qc.endlabel('read register');
//qc.label('');
qc.print('String z such that z OR str = 0,\t');
qc.print('z = '+ output.toString(2) + '\n');  // print binary string

// The output we obtain is not the string str, but rather a string z such that
// z OR str =  0. By running this algorithm a number of times, we will obtain a
// collection of z strings such that they form a system of n equations, which
// we can solve in polynomial time. How many times? It can be shown by probabilistic
// arguments that we only need O(n) attempts. Compare this with the O(2^{n/2})
// of queries that can be shown to be needed to solve the problem classically.

//////////// Definitions
// Define bit OR between registers q1, q2 and out
function bit_or(q1, q2, out)
{
    for (var i = 0; i < n; ++i)
    {
        var mask = 1 << i;
        qc.not(q1.bits(mask)|q2.bits(mask));
        qc.cnot(out.bits(mask),q1.bits(mask)|q2.bits(mask));
        qc.not(q1.bits(mask)|q2.bits(mask)|out.bits(mask));
    }

}
