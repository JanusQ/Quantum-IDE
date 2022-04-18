function shor_sample()
{
    var N = 15;             
    var precision_bits = 4; 
    var coprime = 2;        

    var result = Shor(N, precision_bits, coprime);

    if (result !== null)
        qc.print('Success! '+N+'='+result[0]+'*'+result[1]+'\n');
    else
        qc.print('Failure: No non-trivial factors were found.\n')
}

function Shor(N, precision_bits, coprime)
{
    var repeat_period = ShorQPU(N, precision_bits, coprime); // quantum part
    var factors = ShorLogic(N, repeat_period, coprime);      // classical part
    return check_result(N, factors);
}

function gcd(a, b)
{
    // return the greatest common divisor of a,b
    while (b) {
      var m = a % b;
      a = b;
      b = m;
    }
    return a;
}

function check_result(N, factor_candidates)
{
    for (var i = 0; i < factor_candidates.length; ++i)
    {
        var factors = factor_candidates[i];
        if (factors[0] * factors[1] == N)
        {
            if (factors[0] != 1 && factors[1] != 1)
            {
                // Success!
                return factors;
            }
        }
    }
    // Failure
    return null;
}

function ShorLogic(N, repeat_period_candidates, coprime)
{
    qc.print('Repeat period candidates: '+repeat_period_candidates+'\n');
    let factor_candidates = [];
    for (var i = 0; i < repeat_period_candidates.length; ++i)
    {
        var repeat_period = repeat_period_candidates[i];
    // Given the repeat period, find the actual factors
        var ar2 = Math.pow(coprime, repeat_period / 2.0);
        var factor1 = gcd(N, ar2 - 1);
        var factor2 = gcd(N, ar2 + 1);
        factor_candidates.push([factor1, factor2]);
    }
    return factor_candidates;
}

// In case our QPU read returns a "signed" negative value,
// convert it to unsigned.
function read_unsigned(qreg)
{
    var value = qreg.read();
    return value & ((1 << qreg.numBits) - 1);
}

function rollLeft(num, condition, space)
{
    let start = num.numBits;
    let i,j;
    for(i=start - 1; i>0; i--){
        j = i - space;
        while(j < 0)
            j +=start;
        if(j>=i)
            j=0;
        qc.cswap(num.bits(Math.pow(2,i)),num.bits(Math.pow(2,j)),condition);
    }
}
// This is the short/simple version of ShorQPU() where we can perform a^x and
// don't need to be concerned with performing a quantum int modulus.
function ShorQPU(N, precision_bits, coprime)
{
    var N_bits = 1;
    while ((1 << N_bits) < N)
    N_bits++;
    if (N != 15) // For this implementation, numbers other than 15 need an extra bit
    N_bits++;
    var total_bits = N_bits + precision_bits;

    // Set up the QPU and the working registers
    qc.reset(total_bits);
    var num = qint.new(N_bits, 'work');
    var precision = qint.new(precision_bits, 'precision');

    qc.startlabel('init');
    num.write(1);
    precision.write(0);
    precision.hadamard();
    qc.endlabel('init');

    // Perform 2^x for all possible values of x in superposition
    for (var iter = 0; iter < precision_bits; ++iter)
    {
        qc.startlabel('iter ' + iter);
        var num_shifts = 1 << iter;
        var condition = precision.bits(num_shifts);
        // num_shifts %= num.numBits;
        rollLeft(num, condition, Math.pow(2,iter));
        //qc.cswap(num.bits(1),num.bits(2),precision.bits(1));
        qc.endlabel('iter ' + iter);
    }
    // Perform the QFT
    qc.startlabel('QFT');
    precision.QFT();
    qc.endlabel('QFT');

    var read_result = read_unsigned(precision);
    qc.print('QPU read result: '+read_result+'\n')
    var repeat_period_candidates = estimate_num_spikes(read_result, 1 << precision_bits);

    return repeat_period_candidates;
}

function estimate_num_spikes(spike, range)
{
    if (spike < range / 2)
        spike = range - spike;
    var best_error = 1.0;
    var e0 = 0;
    var e1 = 0;
    var e2 = 0;
    var actual = spike / range;
    var candidates = []
    for (var denom = 1.0; denom < spike; ++denom)
    {
        var numerator = Math.round(denom * actual);
        var estimated = numerator / denom;
        var error = Math.abs(estimated - actual);
        e0 = e1;
        e1 = e2;
        e2 = error;
        // Look for a local minimum which beats our
        // current best error
        if (e1 <= best_error && e1 < e0 && e1 < e2)
        {
            var repeat_period = denom - 1;
            candidates.push(repeat_period);
            best_error = e1;
        }
    }
    return candidates;
}

shor_sample();
