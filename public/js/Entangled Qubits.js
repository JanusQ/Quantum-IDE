

qc.reset(2);
var a = qint.new(1, 'a');
var b = qint.new(1, 'b');
qc.write(0);
qc.nop();

qc.startlabel('entangle');
a.had();           
qc.cnot(0x1,0x2);         
qc.endlabel('entangle');

qc.nop();
var a_result = a.read();  
var b_result = b.read();  
qc.print(a_result);
qc.print(b_result);