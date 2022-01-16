import QuantumCircuit from '../simulator/QuantumCircuit'

import { showInDebuggerArea } from '../simulator/CommonFunction';
import { write1, write0 } from '../simulator/MyGate';

// 测试了自定义的门，注意所有门的生成都是要写成数组的
// 注意不要修改已经改过的部分的代码

//
// 8-bit quantum random number generator
//
// Assuming we have <div id="drawing"></div> somewhere in HTML


var quantumRandom = function() {

    var circuit = new QuantumCircuit();


    // register it as a gate in another circuit
    circuit.registerGate("write0", write0);
    circuit.registerGate("write1", write1);

    circuit.myStartRun()

    let column = 0 
    for(var qubit = 0; qubit < 4; qubit++) {
        //
        // add Hadamard gate to the end (-1) of i-th wire
        //
        if(qubit == 0){
            circuit.addGate("h", column++, qubit,);   
        }else{
            // 必须使用condition
            circuit.addGate("h", column++, qubit, { 
                // condition: { 
                //     creg: 'r' + (i-1),
                //     value: 1
                // }
            }); 
        }

        //注意经典比特的名字不能直接用0,会起不了作用
        circuit.addGate("measure", column++, qubit, {
            creg: {
                name: "c" + qubit,
                bit: 0
            }
        });

        // 发现: -1好像是加载没有依赖的下一个
        circuit.addGate('write0', column++, [qubit])  // 自己定义的门不管几个都要写成数组的形式

        // circuit.addGate("reset", column++,  qubit);
        // circuit.addGate("x", column++,  qubit);

        circuit.addGate("measure", column++, qubit, {
            creg: {
                name: "r" + qubit,
                bit: 0
            }
        });
        circuit.myStepRun()  //应该是runTo到当前最后一个column
        console.log(circuit.stateAsString(), circuit.cregsAsString(), );

        // 尽量不要用append
    }

    // run circuit
    // circuit.run();  // continue不是接着计算

    circuit.myEndRun()
    // circuit.myAllRun()
    showInDebuggerArea(circuit)
    // return value of register "c"

    console.log(circuit.cregsAsString(), circuit.stateAsString());
    return
};

// Usage - print random number to terminal
quantumRandom()