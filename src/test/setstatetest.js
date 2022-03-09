import { showInDebuggerArea } from '../simulator/CommonFunction';
import QCEngine from '../simulator/MyQCEngine'
import {
    create, all,complex,
} from 'mathjs'
import {range} from '../simulator/CommonFunction';
const config = { };
const math = create(all, config);

var qc = new QCEngine()
var {qint} = qc


// Programming Quantum Computers
//   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
//   O'Reilly Media

// To run this online, go to http://oreilly-qc.github.io?p=7-7

var num_qubits = 6;
qc.reset(num_qubits);
qc.write(0);


console.log("hello 2022");

let new_state = [];
range(0, 64).forEach(i=>{
    new_state[i] = complex(1,1); //getComplex({r:1, phi: -phi/2})
})
qc.setState(new_state);
//console.log(math.multiply(complex(1,2),0.5));
console.log("end 2002");