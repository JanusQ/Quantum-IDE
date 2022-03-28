
// Programming Quantum Computers
//   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
//   O'Reilly Media

// To run this online, go to http://oreilly-qc.github.io?p=7-7

// Setup input register
var n = 4;

// Prepare a complex sinuisoidal signal
qc.reset(n);
var freq = 2;

qc.write(freq);
qc.startlabel('prep sinusoidal input signal');
var signal = qint.new(n, 'signal');
signal.invQFT();
qc.endlabel('prep sinusoidal input signal');

// Move to frequency space with QFT
qc.startlabel('QFT');
signal.QFT();
qc.endlabel('QFT');

// Increase the frequency of signal
qc.startlabel('add one');
signal.add(1)
qc.endlabel('add one');

// Move back from frequency space
qc.startlabel('invQFT');
signal.invQFT();
qc.endlabel('invQFT');


// // console.log(qc.name2index)
// // console.log(qc.labels)
// qc.operations.forEach((op, i)=>{
//     console.log(op);
//     // const {operation, state_str, result} = op
//     // console.log(operation)
//     // if(operation == 'read'){
//     //     console.log(result)
//     // }
//     // console.log(state_str)
// })


