
import { showInDebuggerArea } from '../simulator/CommonFunction';
import QCEngine from '../simulator/MyQCEngine'

var qc = new QCEngine()
var {qint} = qc


// Programming Quantum Computers
//   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
//   O'Reilly Media

// To run this online, go to http://oreilly-qc.github.io?p=7-7

// Setup input register
var n = 4;

// Prepare a complex sinuisoidal signal
qc.reset(n);
var freq = 2;
qc.label('prep sinusoidal input signal');
qc.write(freq);
var signal = qint.new(n, 'signal');
signal.invQFT();

// Move to frequency space with QFT
qc.label('QFT');
signal.QFT();

// Increase the frequency of signal
qc.label('add one');
signal.add(1)

// Move back from frequency space
qc.label('invQFT');
signal.invQFT();


showInDebuggerArea(qc.circuit)


console.log(qc.name2index)
console.log(qc.labels)
qc.operations.forEach((op, i)=>{
    console.log(op);
    // const {operation, state_str, result} = op
    // console.log(operation)
    // if(operation == 'read'){
    //     console.log(result)
    // }
    // console.log(state_str)
})

