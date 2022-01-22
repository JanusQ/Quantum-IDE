import { permute, Qobject, gateExpand1toN, controlledGate } from "../simulator/MatrixOperation";


// var U1 = new Qobject(4, 4);
// U1.data = [[1, 2, 3, 4],
// [1, 2, 3, 4],
// [1, 2, 3, 4],
// [1, 2, 3, 4]];

// // console.log(U1.data);
// console.log(permute(U1, [0, 1,]).data);


let target = 1;
let N = 3;
let not = new Qobject(2,2);
not.data = [[0,1],[1,0]]
// console.log(gateExpand1toN(not,N,target));

console.log(controlledGate(not,3,2,1,1).data)
