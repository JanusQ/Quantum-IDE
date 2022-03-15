// 马科夫序列
qc.reset(2);
var a = qint.new(1, 'a')
var b = qint.new(1, 'b')
a.write(1)
b.write(0)

qc.startlabel('preprae')
qc.cry(90, a.bits(0x1), b.bits(0x1));
qc.endlabel('preprae')


// // [
// //     ["cos(theta / 2)","-1 * sin(theta / 2)"],
// //     ["sin(theta / 2)","cos(theta / 2)"]
// // ]

// // [
// //     [1,0,0,0],
// //     [0,1,0,0],
// //     [0,0,"cos(theta / 2)","-1 * sin(theta / 2)"],
// //     [0,0,"sin(theta / 2)","cos(theta / 2)"]
// // ]

// let theta1to1 = probability => {  //1去1的概率
//     return asin(sqrt(probability)) / pi * 180 * 2
// }
// let theta0to1 = probability => {  //0去1的概率
//     return acos(sqrt(probability)) / pi * 180 * 2
// }

// var num_qubits = 7;
// qc.reset(num_qubits);

// let setConditional = (probability, control, target, from_zero) => {
//     let theta = undefined
//     if(from_zero){
//         theta = theta0to1(probability)
//     }else{
//         theta = theta1to1(probability)
//     }
//     qc.cry(theta, control.bits(0x1), target.bits(0x1))
// }

// let flip = (control, target) => {
//     qc.cnot(control.bits(0x1), target.bits(0x1))
// }

// var step_1 = qint.new(1, 's1t')
// var not_step_1 = qint.new(1, 'ns1')
// var step_2 = qint.new(1, 's2')
// var not_step_2 = qint.new(1, 'ns2')
// var step_3 = qint.new(1, 's3')
// var not_step_3 = qint.new(1, 'ns3')

// var estimation =  qint.new(1, 'ρ')

// qc.write(0x2a)  //现在不write第一个是空的

// // qc.startlabel('preprae')
// // qc.endlabel('preprae')

// qc.ry(theta1to1(0.6), 0x1,)
// flip(step_1, not_step_1)

// // setConditional(0.3, step_1, step_2, false)
// qc.startlabel('preprae')
// setConditional(0.4, not_step_1, step_2, true)
// qc.endlabel('preprae')

// // flip(step_2, not_step_2)

// // qc.cry(theta1to1(0.3), not_step_1.bits(0x1), step_2.bits(0x1))

// // qc.cry(theta1to1(0.2), 0x1, 0x2)
// // qc.cry(45, 0x2, 0x4)
// // // qc.cry(45, 0x4, 0x8)
// // qc.endlabel('preprae')

// // 8 + 16 + 32

// estimation.write(0x1)
// qc.cphase(30, 0x1, 0x10)
// qc.cphase(30, 0x2, 0x10)
// qc.cphase(30, 0x4, 0x10)
// qc.cphase(10, 0x1, 0x38)

// TODO：还是不要用二进制了，太难受了
// qc.cphase(10, 0x1, 0x38)
// qc.cphase(10, 0x2, 0x38)
// qc.cphase(10, 0x4, 0x38)

// all.QFT()