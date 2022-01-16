
// let QuantumCircuit = require('../resource/js/quantum-circuit.min.js')
import QuantumCircuit from './QuantumCircuit'


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

export { 
    write0, 
    write1,
    // write,
}