import { showInDebuggerArea } from '../simulator/CommonFunction';
import QuantumCircuit from '../simulator/QuantumCircuit'

//
// 8-bit quantum random number generator
//
// Assuming we have <div id="drawing"></div> somewhere in HTML


var quantumRandom = function() {

    var circuit = new QuantumCircuit();

    circuit.run();
    for(var i = 0; i < 8; i++) {
        //
        // add Hadamard gate to the end (-1) of i-th wire
        //
        if(i == 0){
            circuit.addGate("h", -1, i,);   
        }else{
            // 必须使用condition
            circuit.addGate("h", -1, i, { 
                condition: { 
                    creg: 'c' + (i-1),
                    value: 1
                }
            }); 
        }


        //
        // add measurement gate to i-th qubit which will store result 
        // into classical register "c", into i-th classical bit
        //
        circuit.addMeasure(i, 'c' + i, 0);   //注意经典比特的名字不能直接用0,会起不了作用

            // run circuit
        // debugger
        // circuit.continue();
    }

    // run circuit
    circuit.continue();  // continue不是接着计算

    showInDebuggerArea(circuit)
    // return value of register "c"

    console.log(circuit.cregsAsString());
    return
};

// Usage - print random number to terminal
quantumRandom()