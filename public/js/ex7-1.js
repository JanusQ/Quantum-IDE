

// import { showInDebuggerArea } from '../simulator/CommonFunction';
// import QCEngine from '../simulator/MyQCEngine'

// var qc = new QCEngine()
// var {qint} = qc

// Programming Quantum Computers
//   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
//   O'Reilly Media

// To run this online, go to http://oreilly-qc.github.io?p=7-1

var num_qubits = 4;
qc.reset(num_qubits);
var signal = qint.new(num_qubits, 'signal')
var which_signal = 'A';

// prepare the signal
qc.startlabel('prepare');
signal.write(0);
signal.hadamard();
if (which_signal == 'A') {
    signal.phase(180, 1);
} else if (which_signal == 'B') {
    signal.phase(90, 1);
    signal.phase(180, 2);
} else if (which_signal == 'C') {
    signal.phase(45, 1);
    signal.phase(90, 2);
    signal.phase(180, 4);
}
qc.endlabel('prepare')
qc.nop();

qc.startlabel('QFT');
signal.QFT();
qc.endlabel('QFT');
qc.nop();

qc.startlabel('invQFT');
signal.invQFT();
qc.endlabel('invQFT');
qc.nop();


// showInDebuggerArea(qc.circuit)



// qc.operations.forEach((op, i)=>{
//     const {operation, state_str, result} = op
//     console.log(operation)
//     if(operation == 'read'){
//         console.log(result)
//     }
//     console.log(state_str)
// })

    