// 这是一个假的QCEngine
// 通过quantum-circuit实现的

// QCEngine的文档
// https://oreilly-qc.github.io/docs/build/index.html
// QCEngine的案例代码
// https://oreilly-qc.github.io/?p=2-4
// import QuantumCircuit from "./quantum-circuit.min.js";

function binary(num) {
    //定义变量存放字符串
    var result = [];
    while (true) {
        //取余
        var remiander = num % 2;
        //将余数倒序放入结果中
        result = [remiander,  ...result];//+是字符串的拼接
        //求每次除2的商
        num = ~~(num / 2);
        // num= num>>1;
        if (num === 0)
            break;
    }
    return result;
}


class QCEngine {
    constructor() {
        var circuit = new QuantumCircuit();
        this.qubit_number = undefined;
    }


    // We always begin by specifying how many qubits we want to associate with our QPU using the qc.reset() method. For example, we could prepare ourselves for a simulation of an 8-qubit QPU as follows:
    // // Request 8 qubits for simulation in our QPU
    // qc.reset(8);

    reset(qubit_number) {
        this.qubit_number = qubit_number
        // 比特全部设为0
    }

    // Considered together these 8 qubits can represent any 8-bit number (or, of course, superpositions of such numbers). Before we begin operating on these qubits we can initialize them to be a binary encoding of some integer value using the qc.write() method:

    // // Write the value 120 to our 8 qubits (01111000)
    // qc.reset(8);
    // qc.write(120);
    write(value) {
        let binary_value = binary(value)
        
    }

    // Hadamard Operation
    had(){

    }

    // measure
    read(){

    }

    // phase门
    phase(rotation, qubits){
        qubits = binary(qubits)
    }

    cnot(control, target){
        control = Math.log2(control)
        target = Math.log2(target)
    }


    QCint(){
        return
    }

}

class QCInt{
    constructor(qc_engine){
        this.qc_engine = qc_engine
    }

    new(){

    }
}