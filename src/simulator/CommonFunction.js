


function showInDebuggerArea(circuit){
    // SVG is returned as string
    let svg = circuit.exportSVG(true);
    let container = document.getElementById("debug_drawing");  //index.html里面预留的部分

    // add SVG into container
    container.innerHTML = svg;
}


// 单个qubit的位数转换为qcEngine里面的二进制
function pow2(qubit){
    return 2**qubit
}

// int转换为二进制
function binary(num, qubit_num = 0) {
    //定义变量存放字符串
    let result = [];
    while (true) {
        //取余
        let remiander = num % 2;
        //将余数倒序放入结果中
        result = [remiander,  ...result];//+是字符串的拼接
        //求每次除2的商
        num = ~~(num / 2);
        // num= num>>1;
        if (num === 0)
            break;
    }
    // console.log(num, result)
    return [...range(0, qubit_num-result.length).map(_=>0) ,...result];
}

function binary2int(binary) {
    let value = 0;
    binary.forEach((elm, index) => {
        if(elm == 1){
            value += 2**(binary.length-index-1)
        }
    })
    return value;
}


// 二进制计算qubit为1的状态的位数
function binary2qubit1(state_value){
    let qubit2value = binary(state_value)
    let qubits = []
    for(let qubit = 0; qubit < qubit2value.length; qubit++){
        if(qubit2value[qubit] == 1){
            qubits.push(qubit2value.length - qubit)
        }
    }
    return qubits  // 确定下是不是从小到大
}

function range(start, end){
    let array = []

    for(let i = start; i < end; i++){
        array.push(i)
    }

    return array
}

export {
    pow2,
    binary,
    binary2qubit1,
    range,
    showInDebuggerArea,
    binary2int
}