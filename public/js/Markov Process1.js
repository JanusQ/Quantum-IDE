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

let theta1to1 = probability => {  
    return asin(sqrt(probability)) / pi * 180 * 2
}
let theta0to1 = probability => {  
    return acos(sqrt(probability)) / pi * 180 * 2
}

var num_qubits = 5;
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
    qc.cry(theta, control.bits(0x1), target.bits(0x1))
}

let flip = (control, target) => {
    qc.cnot(control.bits(0x1), target.bits(0x1))
}

var step_1 = qint.new(1, 'QS1')
var not_step_1 = qint.new(1, 'NQS1')
var step_2 = qint.new(1, 'QS2')
var not_step_2 = qint.new(1, 'NQS2')
var step_3 = qint.new(1, 'QS3')
// var not_step_3 = qint.new(1, 'NS3')

// var estimation =  qint.new(1, 'ρ')

// qc.startlabel('init')
// qc.write(0b0101010)  
qc.write(0b01010)
// qc.endlabel('init')
qc.nop()

// qc.startlabel('preprae')
// qc.endlabel('preprae')

// qc.startlabel('simulation')

let label = 'ry 101°' //'P(S1=0)=0.6'
qc.startlabel(label)
qc.ry(theta1to1(0.6), 0x1,)
qc.endlabel(label)
// qc.nop()

label = 'cnot' //'P(NS1=0|S1=1)=1'
qc.startlabel(label)
flip(step_1, not_step_1)
qc.endlabel(label)

label = 'cry 66 °' //'P(S2=1|S1=0)=0.4'
qc.startlabel(label)
setConditional(0.3, step_1, step_2, false)
// qc.endlabel(label)
// // qc.nop()



// label = 'cry 66 °' //'P(S2=1|S1=0)=0.4'
// qc.startlabel(label)
setConditional(0.4, not_step_1, step_2, true) 
qc.endlabel(label)


flip(step_2, not_step_2)

setConditional(0.2, step_2, step_3, false)  //0.66 * 0.1
setConditional(0.1, not_step_2, step_3, true) //0.34 * 0.8
// qc.endlabel('simulation')  

// flip(step_3, not_step_3)
// // qc.cry(theta1to1(0.3), not_step_1.bits(0x1), step_2.bits(0x1))

// // qc.cry(theta1to1(0.2), 0x1, 0x2)
// // qc.cry(45, 0x2, 0x4)
// // // qc.cry(45, 0x4, 0x8)
// // qc.endlabel('preprae')

// // 8 + 16 + 32
qc.nop()

// estimation.write(0x1)
// let estimation_bit = estimation.bits(0x1)
// qc.cphase(10, step_1.bits(0x1), estimation_bit)
// qc.cphase(20, not_step_1.bits(0x1), estimation_bit)
// qc.cphase(15, step_2.bits(0x1), estimation_bit)
// qc.cphase(30, not_step_2.bits(0x1), estimation_bit)
// qc.cphase(200, step_3.bits(0x1), estimation_bit)
// qc.cphase(10, not_step_3.bits(0x1), estimation_bit)

// qc.startlabel('Sum')
// setConditional(0.1, step_1, estimation, false) //0.34 * 0.8
// // setConditional(0.02, not_step_1, estimation, false) //0.34 * 0.8
// setConditional(0.1, step_2, estimation, false) //0.34 * 0.8
// // setConditional(0.04, not_step_2, estimation, false) //0.34 * 0.8
// setConditional(0.6, step_3, estimation, false) //0.34 * 0.8
// // setConditional(0.03, not_step_3, estimation, false) //0.34 * 0.8
// qc.endlabel('Sum')

// qc.cphase(10, 0x1, 0x38)
// qc.cphase(10, 0x2, 0x38)
// qc.cphase(10, 0x4, 0x38)

// all.QFT()