// 马科夫序列
// qc.reset(2);
// var a = qint.new(1, 'a')
// var b = qint.new(1, 'b')
// a.write(1)
// b.write(0)

// qc.startlabel('preprae')
// qc.cry(90, a.bits(0x1), b.bits(0x1));
// qc.endlabel('preprae')


// [
//     ["cos(theta / 2)","-1 * sin(theta / 2)"],
//     ["sin(theta / 2)","cos(theta / 2)"]
// ]

// [
//     [1,0,0,0],
//     [0,1,0,0],
//     [0,0,"cos(theta / 2)","-1 * sin(theta / 2)"],
//     [0,0,"sin(theta / 2)","cos(theta / 2)"]
// ]

let theta1to1 = probability => {  //1去1的概率
    return asin(sqrt(probability)) / pi * 180 * 2
}
let theta0to1 = probability => {  //0去1的概率
    return acos(sqrt(probability)) / pi * 180 * 2
}

var num_qubits = 7;
qc.reset(num_qubits);

let setConditional = (probability, control, target, from_zero) => {
    // debugger
    let theta = undefined
    if(from_zero){
        probability = 1-probability
        theta = theta0to1(probability)
    }else{
        theta = theta1to1(probability)
    }
    // console.log(theta)
    cry(theta, [...control.bits([1]), ...target.bits([1])])
}

let flip = (control, target) => {
    cnot([...control.bits([1]), ...target.bits([1])])
}

var step_1 = qint.new(1, 'QS1')
var not_step_1 = qint.new(1, 'NQS1')
var step_2 = qint.new(1, 'S2')
var not_step_2 = qint.new(1, 'NQS2')
var step_3 = qint.new(1, 'S3')
// var not_step_3 = qint.new(1, 'ns3')

var estimation =  qint.new(1, 'ρ')


//qc.write(0b0101010)  //现在不write第一个是空的
x([1,3,5])



startlabel('Calculate probability')


startlabel('ry 101°')
ry(theta1to1(0.6), [1])
qc.endlabel('ry 101°')

startlabel('cnot')
flip(step_1, not_step_1)
endlabel('cnot')

startlabel('cry 66°')
setConditional(0.3, step_1, step_2, false)
endlabel('cry 66°')

setConditional(0.4, not_step_1, step_2, true) 
flip(step_2, not_step_2)


setConditional(0.2, step_2, step_3, false)  //0.66 * 0.1
setConditional(0.1, not_step_2, step_3, true) //0.34 * 0.8
endlabel('Calculate probability')

// flip(step_3, not_step_3)
// // qc.cry(theta1to1(0.3), not_step_1.bits(0x1), step_2.bits(0x1))

// // qc.cry(theta1to1(0.2), 0x1, 0x2)
// // qc.cry(45, 0x2, 0x4)
// // // qc.cry(45, 0x4, 0x8)
// // qc.endlabel('preprae')

// // 8 + 16 + 32
// estimation.write(0x1)

let estimation_bit = estimation.bits([1])
// qc.cphase(10, step_1.bits(0x1), estimation_bit)
// qc.cphase(20, not_step_1.bits(0x1), estimation_bit)
// qc.cphase(15, step_2.bits(0x1), estimation_bit)
// qc.cphase(30, not_step_2.bits(0x1), estimation_bit)
// qc.cphase(200, step_3.bits(0x1), estimation_bit)
// qc.cphase(10, not_step_3.bits(0x1), estimation_bit)

startlabel('Sum')
setConditional(0.1, step_1, estimation, false) //0.34 * 0.8
// setConditional(0.02, not_step_1, estimation, false) //0.34 * 0.8
setConditional(0.1, step_2, estimation, false) //0.34 * 0.8
// setConditional(0.04, not_step_2, estimation, false) //0.34 * 0.8
setConditional(0.6, step_3, estimation, false) //0.34 * 0.8
// setConditional(0.03, not_step_3, estimation, false) //0.34 * 0.8
endlabel('Sum')

// qc.cphase(10, 0x1, 0x38)
// qc.cphase(10, 0x2, 0x38)
// qc.cphase(10, 0x4, 0x38)

// all.QFT()