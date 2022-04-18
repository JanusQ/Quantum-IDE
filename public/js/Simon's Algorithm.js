
var str = "01";


var n = str.length;
qc.reset(3*n);

var oracle = qint.new(n, 'oracle');
var register= qint.new(n, 'register');
var scratch = qint.new(n, 'scratch');

scratch.write(0);

register.write(0);
register.had();

qc.startlabel('secret string');
qc.nop();
oracle.write(str);
qc.nop();
qc.label('');
qc.nop();
qc.endlabel('secret string');



qc.startlabel('oracle');

bit_or(register, oracle, scratch);

qc.endlabel('oracle');

qc.nop();


scratch.read();

//Read register
qc.startlabel('read register');
register.had();
var output = register.read();
qc.endlabel('read register');
//qc.label('');
qc.print('String z such that z OR str = 0,\t');
qc.print('z = '+ output.toString(2) + '\n');  // print binary string


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
