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

//var a = qint.new(2, 'a');
//var b = qint.new(2, 'b');
//var c = qint.new(2, 'c');
qc.write(0x0);
var state_vector = range(0,Math.pow(2,6)).map(elm=>complex(0,0))
state_vector[1]=complex(1,0)
state_vector[0]=complex(1,0)
state_vector[2]=complex(1,0)
console.log(state_vector)
qc.setState(state_vector)

console.log(qc.operations)
//a.had()


console.log("hello 2022");

let new_state = [];
range(0, 64).forEach(i=>{
    new_state[i] = complex(1,1); //getComplex({r:1, phi: -phi/2})
})
//qc.setState(new_state);
//console.log(math.multiply(complex(1,2),0.5));
console.log("end 2002");