function phase_est(q_in, q_out, cont_u)
{
    // Main phase estimation single run
    // HAD the output register
    q_out.had();

    // Apply conditional powers of u
    let numBits = q_out.index[1] - q_out.index[0];
    for (var j = 0; j < numBits; j++)
        cont_u(q_out, q_in, j);

    // Inverse QFT on output register
    q_out.invQFT();
}


//Specify the size of output register - determines precision
// of our answer
var m = 3;
// Specify the size of input register that will specify
// our eigenstate
var n = 1;
// Setup
reset(m + n);
var qout = qint.new(m, 'output');
var qin = qint.new(n, 'input');

// Initialize input register as eigenstate of HAD
startlabel('init');
qin.ry(-135);
endlabel('init');
// In this example, the starting state is not important because
// out U has been chosen to have an eigenphase of 150 for all inputs.

// Define our conditional unitary
function cont_u(qcontrol, qtarget, control_count) {

    var theta = 150;
    var single_op = true;
    var q1 = qtarget.bits();
    var q2 = qcontrol.bits([control_count]);
    if (single_op)
    {
        ncphase(-theta / 2 * control_count, [...q2, ...q1]);
        ncnot([...q2,...q1]);
        ncphase(-theta * control_count, [...q2, ...q1]);
        ncnot([...q2,...q1]);
        ncphase(-theta / 2 * control_count, [...q2, ...q1]);
    }

}

// Operate phase estimation primitive on registers
startlabel('phase estimation');
phase_est(qin, qout, cont_u);
endlabel('phase estimation');



