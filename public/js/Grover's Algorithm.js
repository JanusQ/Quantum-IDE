var number_to_flip = 0b1100;
var number_of_iterations = 4;
var num_qubits = 4;
qc.reset(num_qubits);
var reg = qint.new(num_qubits, 'reg')

reg.write(0);
qc.startlabel('prep');
reg.hadamard();
qc.endlabel('prep');
for (var i = 0; i < number_of_iterations; ++i)
{
    qc.startlabel('Amplitude Amplification '+i);

    reg.not(number_to_flip);
    reg.cphase(180);
    reg.not(number_to_flip);
    reg.Grover();

    qc.endlabel('Amplitude Amplification '+i);
    qc.nop();
}

