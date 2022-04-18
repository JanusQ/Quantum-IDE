function phase_est(q_in, q_out, cont_u)
{

    q_out.had();


    let numBits = q_out.index[1] - q_out.index[0];
    for (var j = 0; j < numBits; j++)
        cont_u(q_out, q_in, 1 << j);

    q_out.invQFT();
}



var m = 3;

var n = 1;

qc.reset(m + n);
var qout = qint.new(m, 'output');
var qin = qint.new(n, 'input');

qout.write(0);

qc.startlabel('init');
qin.write(0);
qin.ry(-135);
qc.endlabel('init');



function cont_u(qcontrol, qtarget, control_count) {

    var theta = 150;
    var single_op = true;
    var q1 = qtarget.bits();
    var q2 = qcontrol.bits(control_count);
    if (single_op)
    {
        qc.cphase(-theta / 2 * control_count, q2, q1);
        qc.cnot(q2,q1);
        qc.cphase(-theta * control_count, q2, q1);
        qc.cnot(q2,q1);
        qc.cphase(-theta / 2 * control_count, q2, q1);
    }
    else
    {
        for (var i = 0; i < control_count; ++i)
        {
            qc.phase(-theta / 2, q2, q1);
            qc.cnot(q2,q1);
            qc.phase(-theta, q2, q1);
            qc.cnot(q2,q1);
            qc.phase(-theta / 2, q2, q1);
        }
    }
}


qc.startlabel('phase estimation');
phase_est(qin, qout, cont_u);
qc.endlabel('phase estimation');

qc.print(qout.read());


