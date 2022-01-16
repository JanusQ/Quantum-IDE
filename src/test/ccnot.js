import { showInDebuggerArea } from '../simulator/CommonFunction';
import QuantumCircuit from '../simulator/QuantumCircuit'

// 测试了下控制门也可以用的

var circuit = new QuantumCircuit(3);
circuit.myStartRun()

circuit.addGate("h", 0, 0,);
circuit.addGate("h", 0, 1,);
circuit.myStepRun()  //应该是runTo到当前最后一个column
console.log(circuit.stateAsString(), circuit.cregsAsString(), );



circuit.addGate("ccx", 1, [0, 1, 2],);
circuit.myStepRun()  //应该是runTo到当前最后一个column
console.log(circuit.stateAsString(), circuit.cregsAsString(), );


// 0.50000000+0.00000000i|000>	 25.00000%
// 0.50000000+0.00000000i|001>	 25.00000%
// 0.50000000+0.00000000i|010>	 25.00000%
// 0.00000000+0.00000000i|011>	  0.00000%
// 0.00000000+0.00000000i|100>	  0.00000%
// 0.00000000+0.00000000i|101>	  0.00000%
// 0.00000000+0.00000000i|110>	  0.00000%
// 0.50000000+0.00000000i|111>	 25.00000%
// 0是后面的

showInDebuggerArea(circuit)