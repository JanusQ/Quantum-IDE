
// let QuantumCircuit = require('../resource/js/quantum-circuit.min.js')
import QuantumCircuit from './QuantumCircuit'
import {QObject, permute, } from './MatrixOperation'
import { pow2, getComplex, range, toPI } from './CommonFunction';
import { complex } from 'mathjs';

// write0
var write0 = new QuantumCircuit(1)
write0.addGate("reset", 0,  0);
write0 = write0.save()


// write1
var write1 = new QuantumCircuit(1)
write1.addGate("reset", 0,  0);
write1.addGate("x", 1,  0);
write1 = write1.save()

// var write = value => {
//     if(value == 0){
//         return write0
//     }else if(value == 1){
//         return write1
//     }
//     else{
//         console.error(value, 'is not 0 or 1');
//         debugger
//     }
// }

// 之后还是要用可以拆解的
function ncphase(qubit_number) {
    var ncphase_circuit = new QuantumCircuit(qubit_number)
    //  new QuantumCircuit(1)
    return ncphase_circuit
}

function getRawGateNcphase(options) {
    // debugger
    const {qubit_number, phi} = options

    if(phi instanceof String){
        console.error(phi, 'should be numerical')
        debugger
    }

    const state_num = pow2(qubit_number)
    let matrix = new QObject(state_num, state_num)

    range(0, state_num).forEach(i=>{
        matrix.data[i][i] = complex(1,0); //getComplex({r:1, phi: -phi/2})
    })
    
    matrix.data[state_num-1][state_num-1] = getComplex({r:1, phi})
    
    // let value = getComplex({r:1, phi})
    // console.log(value.toPolar())
    return matrix.data
}

function getRawGateCCNOT(options)
{
    const {qubit_number, controls, target} = options;

    if(qubit_number < 2){
        console.error("qubit_number < 2");
        debugger
    }

    const state_num = pow2(qubit_number);
    let matrix = new QObject(state_num, state_num);

    range(0, state_num).forEach(i=>{
        matrix.data[i][i] = complex(1,0); //getComplex({r:1, phi: -phi/2})
    })

    matrix.data[state_num-1][state_num-1] = complex(0,0);
    matrix.data[state_num-1][state_num-2] = complex(1,0);
    matrix.data[state_num-2][state_num-2] = complex(0,0);
    matrix.data[state_num-2][state_num-1] = complex(1,0);

    let p = range(0, qubit_number);
 
    let tmp = p[target[0]];
    p[target[0]]=p[p.length - 1];
    p[p.length - 1] = tmp;
    
    let matrix_p = permute(matrix,p);

    return matrix_p.data;
}

function getRawGateIdentity(options)
{
    const {qubit_number,} = options;

    if(qubit_number < 1){
        console.error("qubit_number < 1");
        debugger
    }

    const state_num = pow2(qubit_number);
    let matrix = new QObject(state_num, state_num);

    range(0, state_num).forEach(i=>{
        matrix.data[i][i] = complex(1,0); //getComplex({r:1, phi: -phi/2})
    })

    return matrix.data;

}

export { 
    write0, 
    write1,
    // ncphase,

    getRawGateNcphase,
    getRawGateCCNOT,
    getRawGateIdentity,
    // write,
}