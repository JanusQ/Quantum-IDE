import QuantumCircuit from '../simulator/QuantumCircuit'

import { showInDebuggerArea } from '../simulator/CommonFunction';

// 测试了自定义的一步一步走的代码
// 注意不要修改已经跑过的量子电路

//
// 8-bit quantum random number generator
//
// Assuming we have <div id="drawing"></div> somewhere in HTML


var quantumRandom = function() {

    var circuit = new QuantumCircuit();
    circuit.myStartRun()

    let column = 0 
    for(var i = 0; i < 4; i++) {
        //
        // add Hadamard gate to the end (-1) of i-th wire
        //
        if(i == 0){
            circuit.addGate("h", column++, i,);   
        }else{
            // 必须使用condition
            circuit.addGate("h", column++, i, { 
                // condition: { 
                //     creg: 'r' + (i-1),
                //     value: 1
                // }
            }); 
        }

        // circuit.myStepRun()  //应该是runTo
        // console.log(circuit.stateAsString(), circuit.cregsAsString(), );

        //
        // add measurement gate to i-th qubit which will store result 
        // into classical register "c", into i-th classical bit
        //
        // circuit.addMeasure(i, 'c' + i, 0);   //注意经典比特的名字不能直接用0,会起不了作用

        // // debugger
        // circuit.resetQubit(i, 1);  //没有起作用

        // reset有时候起作用，有时候没起，因为应该是跑到现在的跑完
        // 发现: -1好像是加载没有依赖的下一个
        circuit.addGate("reset", column++,  i);  //第二位是比特, 只能set到1?

        // circuit.myStepRun()  //应该是runTo
        // console.log(circuit.stateAsString(), circuit.cregsAsString(), );

        circuit.addGate("x", column++,  i);  //x 解释not
        // // 可以用着建一个write1,和write0
        // // Use circuit as a gate in another circuit

        // circuit.addMeasure(i, 'r' + i, 0);   //注意经典比特的名字不能直接用0,会起不了作用
            // run circuit
        // debugger
        // circuit.continue();

        circuit.myStepRun()  //应该是runTo到当前最后一个column
        console.log(circuit.stateAsString(), circuit.cregsAsString(), );
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