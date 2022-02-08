import {getRawGateNcphase} from '../simulator/MyGate'
import { showInDebuggerArea } from '../simulator/CommonFunction';
import QuantumCircuit from '../simulator/QuantumCircuit'
import {range, toPI} from '../simulator/CommonFunction'

// 补了一个自定义的ncphase

const cphase3_options = {
    qubit_number :3, 
    phi: toPI(30)
}
const cphase3 = getRawGateNcphase(cphase3_options)

console.log(cphase3)


const circuit = new QuantumCircuit(3);

range(0, 3).forEach(qubit=>{
    circuit.addGate('h', 0, qubit);
})

// circuit.addGate("cu1",  1, [0, 1],  {
//     params: {
//         lambda: "pi/" + 6
//     }
// });


// circuit.addGate("ccx", 2, [0, 1, 2])

// 门的顺序不重要
circuit.addGate("ncphase",  3, range(0, 3), {
    params: {
        qubit_number: cphase3_options.qubit_number,
        phi: toPI(30)
    }
});


circuit.run()
showInDebuggerArea(circuit)
console.log(circuit.stateAsString())

