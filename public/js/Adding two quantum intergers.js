// Initialize
var num_qubits = 6;
reset(num_qubits);
var a = qint.new(4, 'a');
var b = qint.new(2, 'b');

// prepare
startlabel('prepare');
// debugger
a.x([0])
hadamard([2]);
phase(45, [2]);
b.x([0]);
b.hadamard([1]);
b.phase(90, [1]);

endlabel('prepare');
// a += b
startlabel('a += b');
a.add(b);
endlabel('a += b');


// qc.operations.forEach((op, i)=>{
//     const {operation, state_str, result} = op
//     console.log(op)
//     // if(operation == 'read'){
//     //     console.log(result)
//     // }
//     // console.log(state_str)
// })
