var num_qubits = 4;
reset(num_qubits);
var VQA = qint.new(4, 'VQA');
var idx = 0;

// Variational parameters trained beforehand
const thetas = [ 2.97912137,  4.36397437, -0.94883431,  1.79264587,  1.18614999,
       -0.11809916,  0.78876682,  1.55067278,  2.54177941,  3.25756554,
        2.0279375 ,  4.13034822,  1.8833371 ,  5.15216223,  0.28284741,
        4.03765907,  2.13497348,  3.68046373,  1.14136942,  1.5260679 ,
        4.17331205,  5.64994524,  2.19170944,  4.11802839,  5.176497  ,
        5.67010498,  0.45503647,  0.01342555,  0.31689492,  5.41603853,
        1.08848587,  1.40094821,  5.70707169,  3.73582681,  4.11161217,
        2.04256095,  4.24335789,  5.83713765,  0.14619889,  4.77341347,
        6.01152216,  4.76416402,  2.87720809,  5.35577372,  0.51085965,
        4.11225704,  5.77743092,  1.45190027,  2.2500812 ,  0.53298616,
        0.00687271,  3.87231747, -0.15198408,  2.42123052,  3.31042371,
        1.29049101,  2.913083  ,  0.34089598,  3.95251614,  4.33978566,
        0.32933688,  2.55597183,  4.20099868,  2.61357159, -0.54596679,
        3.16502274,  4.35779955,  3.22130834,  5.61923775,  3.60241213,
        5.71400044,  0.87759816]
const pic_embedding_thetas = [0.00000000, 0.00756953, 0.16148326, 0.1892382, 0.18671502, 
        0.15307268, 0.00252318, 0.00000000, 0.00000000, 0.17157597,
        0.15980115, 0.15307268, 0.15559585, 0.15980115, 0.14213891,
        0.00000000, 0.00000000, 0.18166867, 0.17914549, 0.14886738, 
        0.14802632, 0.18671502, 0.15727797, 0.00000000, 0.00000000, 
        0.00000000, 0.16652961, 0.16232432, 0.16316538, 0.18419185,
        0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.16652961,
        0.16905279, 0.16821173, 0.16400644, 0.00000000, 0.00000000,
        0.00000000, 0.00000000, 0.16905279, 0.16989385, 0.16905279, 
        0.16400644, 0.00000000, 0.00000000, 0.00000000, 0.00000000,
        0.16652961, 0.16737067, 0.16737067, 0.16484750, 0.00000000,
        0.00000000, 0.00000000, 0.00084106, 0.16989385, 0.16568856, 
        0.16484750, 0.17073491, 0.00000000, 0.00000000, 0.00000000,
        0.17755446, 0.12257785, 0.00000000, 0.00000000, 0.00125498,
        0.00000000, 0.00000000];
const pi = 3.14159265;

// Set the parameterized circuits to train the network 
startlabel("parameterizedQC_1");
// The parameters to be trained are comprised of pre-set thetas and embedded parameters from the pictures
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
idx += 1
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
endlabel("parameterizedQC_1");

// Entanglement part of the VQA circuit
startlabel("entanglement_1");
cnot([0, 1])
cnot([1, 2])
cnot([2, 3])
endlabel("entanglement_1");

// The deeper network usually improves prediction accuracy yet takes more training time, and it may lead to more coherence error.
// In this example, we set the unit depth to 6.

startlabel("parameterizedQC_2");
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
idx += 1
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
endlabel("parameterizedQC_2");

startlabel("entanglement_2");
cnot([0, 1])
cnot([1, 2])
cnot([2, 3])
endlabel("entanglement_2");

startlabel("parameterizedQC_3");
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
idx += 1
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
endlabel("parameterizedQC_3");

startlabel("entanglement_3");
cnot([0, 1])
cnot([1, 2])
cnot([2, 3])
endlabel("entanglement_3");

startlabel("parameterizedQC_4");
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
idx += 1
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
endlabel("parameterizedQC_4");

startlabel("entanglement_4");
cnot([0, 1])
cnot([1, 2])
cnot([2, 3])
endlabel("entanglement_4");

startlabel("parameterizedQC_5");
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
idx += 1
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
endlabel("parameterizedQC_5");

startlabel("entanglement_5");
cnot([0, 1])
cnot([1, 2])
cnot([2, 3])
endlabel("entanglement_5");

startlabel("parameterizedQC_6");
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rz(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
idx += 1
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [0])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [1])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [2])
idx += 1;
rx(180/pi*(thetas[idx] + pic_embedding_thetas[idx]), [3])
endlabel("parameterizedQC_6");

startlabel("entanglement_6");
cnot([0, 1])
cnot([1, 2])
cnot([2, 3])
endlabel("entanglement_6");