var number_to_flip_past = 0b1100;
var number_to_flip = [2,3];
var number_of_iterations = 4;
var num_qubits = 4;
reset(num_qubits);
var reg = qint.new(num_qubits, 'reg')

startlabel('prep');
reg.hadamard();
endlabel('prep');

for (var i = 0; i < number_of_iterations; ++i)
{
    startlabel('Amplitude Amplification '+i);

    // Flip the marked value
    reg.not(number_to_flip);
    reg.ncphase(180,reg.bits());
    reg.not(number_to_flip);
    reg.Grover();

    // Peek at the probability
    //var prob = reg.peekProbability(number_to_flip);
    //qc.print('Iter '+i+': probability = '+prob+'\n');

    // just space it out visually
    endlabel('Amplitude Amplification '+i);
}

