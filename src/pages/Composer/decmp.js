
// let gates = [
//     { name: "cz", qubit: [0, 1] },
//     { name: "cz", qubit: [2, 3] },
//     { name: "i", qubit: [4] }, 


//     { name: "i", qubit: [5] },
//     { name: "cz", qubit: [6, 7] },
//     { name: "cz", qubit: [8, 15] },
//     { name: "cz", qubit: [16, 17] },
//     { name: "cz", qubit: [9, 14] },
//     { name: "cz", qubit: [10, 11] },
//     { name: "cz", qubit: [12, 13] },
// ]

function copy(element){
    return JSON.parse(JSON.stringify(element));
    
}

// export  function decompose_gates(gates){
//     let result = [];
//     let tmp = [];
//     let left = 0;
//     let right = 0;
//     let ql,qr;
//     while(gates.length !== 0){
//         left=-1;
//         right=-1;
//         let new_gates=[];
//         tmp=[];
//         for(let i=0;i<gates.length;i++){
//             if(gates[i]['qubit']?.length==1){
//                 ql=gates[i]['qubit']['0'];
//                 qr=gates[i]['qubit']['0'];
//             }
//             else{
//                 ql=gates[i]['qubit']['0'];
//                 qr=gates[i]['qubit']['1'];
//             }
            
//             if(left==-1){
//                 left = ql;
//                 right = qr;
//                 tmp.push(copy(gates[i]));
//             }
//             else{
//                 if(qr>=left&&right>=ql){
//                     new_gates.push(copy(gates[i]));
//                 }
//                 else{
//                     tmp.push(copy(gates[i]));
//                     left = Math.min(left,ql);
//                     right= Math.max(right,qr);
//                 }
                
//             }
//             // console.log(left,right);
            
//         }
//         // console.log(copy(tmp));
//         gates=new_gates;
//         result.push(copy(tmp));
//     }
//     return result;
// }
export function decompose_gates(gates){
    let result = [];
    let tmp = [];
    let left = 0;
    let right = 0;
    let ql,qr;
    while(gates.length !== 0){
        left=-1;
        right=-1;
        let new_gates=[];
        tmp=[];
        for(let i=0;i<gates.length;i++){
            gates[i]['qubit'].sort(function(a, b){return a - b});
            if(gates[i]['qubit'].length==1){
                ql=gates[i]['qubit'][0];
                qr=gates[i]['qubit'][0];
            }
            else{
                ql=gates[i]['qubit'][0];
                qr=gates[i]['qubit'][gates[i]['qubit'].length-1];
            }
            
            if(left==-1){
                left = ql;
                right = qr;
                tmp.push(copy(gates[i]));
            }
            else{
                if(qr>=left&&right>=ql){
                    new_gates.push(copy(gates[i]));
                }
                else{
                    tmp.push(copy(gates[i]));
                    left = Math.min(left,ql);
                    right= Math.max(right,qr);
                }
                
            }
            // console.log(left,right);
            
        }
        // console.log(copy(tmp));
        gates=new_gates;
        result.push(copy(tmp));
    }
    result.sort(function(a,b){
        let m1=-1,m2=-1;
        for(let i=0;i<a.length;i++){
            m1=Math.max(a[i]['qubit'].length,m1);
        }
        for(let i=0;i<b.length;i++){
            m2=Math.max(b[i]['qubit'].length,m2);
        }

        return m2-m1;
    });
    return result;
}

// let res = decompose_gates(gates);
// console.log(res[0],res[1],res[2]);