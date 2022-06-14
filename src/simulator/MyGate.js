
// let QuantumCircuit = require('../resource/js/quantum-circuit.min.js')

import QuantumCircuit from './QuantumCircuit'
import {QObject, permute, } from './MatrixOperation'
import { pow2, getComplex, range, toPI } from './CommonFunction';
import { complex, matrix, create, all } from 'mathjs';

const config = { };
const math = create(all, config);

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

function getRawGatecphase(options) {
    // debugger
    const {phi} = options

    if(phi instanceof String){
        console.error(phi, 'should be numerical')
        debugger
    }

    const state_num = pow2(2)
    let matrix = new QObject(state_num, state_num)

    range(0, state_num).forEach(i=>{
        matrix.data[i][i] = complex(1,0); //getComplex({r:1, phi: -phi/2})
    })
    
    matrix.data[state_num-1][state_num-1] = getComplex({r:1, phi})
    
    // let value = getComplex({r:1, phi})
    // console.log(value.toPolar())
    return matrix.data
}


function getRawGateNCNOT(options)
{
    const {qubit_number, controls, target} = options;

    if(qubit_number < 2){
        console.error("qubit_number < 2");
        //debugger
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
    let index = 0;
    for(let ke in controls)
    {
        if(target[0]> ke )
            index++;
    }
    
    // let tmp = p[index];
    // p[index]=p[0];
    // p[0] = tmp;
    // // console.log(p);
    // // console.log("matrix", matrix.data);
    // let matrix_p = permute(matrix,p);
    // // console.log("matrix_p",matrix_p.data);
    return matrix.data;
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

function getRawGateState(options)
{
    const {old_state, new_state} = options;
    const state_num = old_state.length;
    let matrix = new QObject(state_num, state_num);
    let zero = complex(0,0);
    let oldstate = [];
    let newstate = [];
    for(let i=0; i<state_num; i++)
    {
        oldstate[i]=complex(old_state[i]['re'],old_state[i]['im']);
        newstate[i]=complex(new_state[i]['re'],new_state[i]['im']);
    }

    // console.log("oldstate",oldstate);
    // console.log("newstate",newstate);

    for(let i=0; i<state_num; i++)
    {
        for(let j=0; j<state_num; j++)
        {
            if(!zero.equals(oldstate[j])){
                matrix.data[i][j] = math.divide(newstate[i], oldstate[j]);
                break;
            }
            if(j == state_num -1)
            {
                console.error("no matrix can be constructed, old_state are all 0 + 0i ?")
                debugger;
            }
        }
    }
    //console.log(matrix.data);
    return matrix.data;
}

export { 
    write0, 
    write1,
    // ncphase,

    getRawGateNcphase,
    getRawGateNCNOT,
    getRawGateIdentity,
    getRawGateState,
    getRawGatecphase,
    // write,
}