import { pow2, binary, binary2qubit1, range, binary2int,} from '../simulator/CommonFunction'
import * as deepcopy from 'deepcopy';

import {
    create, all,complex
} from 'mathjs'

const config = { };
const math = create(all, config);

// 这里放了一些计算门需要的函数
class QObject {
    // 行，列
    constructor(r, c, content = undefined) {
        this.rows = r;
        this.cols = c;
        this.data = [];
        let i, j;
        for (i = 0; i < r; i++) {
            this.data[i] = [];
        }
        for (i = 0; i < r; i++) {
            for (j = 0; j < c; j++) {
                if(content != undefined)
                    this.data[i][j] = complex(content[i][j]);
                else
                    this.data[i][j] = complex(0, 0);
            }
        }
    }

    copy(){
        let new_obj = new QObject(this.rows, this.cols, this.data);
        //new_obj.data = deepcopy(this.data) 
        return new_obj;
    }
}




function dot()
{
    let tmp = arguments[0];
    let res;
    //console.log("arg",arguments);
    if (tmp instanceof Array) {
        res = tmp[0].copy();
        for (let i = 1; i < tmp.length; i++) {
            res = mt_dot(res, tmp[i]);
        }
        return res;
    }
    
    let i = 1;
    let result = arguments[0].copy();
   
    while (i<arguments.length){
        result = mt_dot(result,arguments[i]);
        i++;
    }

    return result;
}

function mt_dot(m1,m2)
{
    let r=m1.rows;
    let c=m2.cols;
    if(m1.cols != m2.rows){
        throw "rows is not equal to cols";
    }
    let mu = m1.cols;
    let res = new QObject(m1.rows,m2.cols);
    
    let i,j,k;
    for(i=0;i<r;i++)
    {
        for(j=0;j<c;j++)
        {
            let tmp = complex(0,0);
            for(k=0;k<mu;k++)
            {
                tmp = math.add(tmp, math.multiply(m1.data[i][k], m2.data[k][j])); 
            }
            res.data[i][j] = tmp;
        }
    }
    return res;
}

function tensorState(){
    let i;
    let tmp = arguments[0];
    let res;

    for (i = 1; i < arguments.length; i++) {
        tmp = innerTensor(tmp, arguments[i]);
    }



    return tmp.data.map(elm=> elm[0]); 
}


// 这个是用来tensor operator 的
function tensor() {
    let i;
    let tmp = arguments[0];
    let res;

    if (tmp instanceof Array) {
        res = tmp[0];
        for (i = 1; i < tmp.length; i++) {
            res = innerTensor(res, tmp[i]);
        }
        return res;
    }

    for (i = 1; i < arguments.length; i++) {
        tmp = innerTensor(tmp, arguments[i]);

    }
    return tmp;

}

function toQbject(obj){
    if (obj instanceof Array) {
        let new_obj = new Array(obj.length);
        let row = obj.length;
        let column = undefined
        obj.forEach(((elm, index) => {
            if (!(elm instanceof Array)) {
                elm = [elm]
            }

            if(column !== undefined && column !== elm.length){
                console.error(obj, 'does not have same column')
                debugger
            }
            column = elm.length
            new_obj[index] = elm
        }))
        return new QObject(row, column, new_obj)
    }
    return obj
}

function innerTensor(t1, t2) {
    t1 = toQbject(t1)
    t2 = toQbject(t2)

    // debugger
    let row = t1.rows * t2.rows;
    let col = t1.cols * t2.cols;
    let result = new QObject(row, col);
    let i, j;

    for (i = 0; i < row; i++) {
        for (j = 0; j < col; j++) {
            result.data[i][j] = math.multiply(t1.data[Math.floor(i / t2.rows)][Math.floor(j / t2.cols)], t2.data[i % t2.rows][j % t2.cols]);

        }
    }
    return result;
}


//-------------------------------------------------------------//
function identity(N) {
    let id = new QObject(N, N);
    let i;
    for (i = 0; i < N; i++) {
        id.data[i][i] = complex(1,0);
    }
    return id;
}


function fockDm(dim, N) {
    let res = new QObject(dim, dim);
    res.data[N][N] = complex(1,0);
    return res;
}


//console.log(identity(5).data);

function gateExpand1toN(U, N, target) {
    if (N < 1)
        throw "integer N must be larger or equal to 1";

    if (target >= N)
        throw "target must be integer < integer N";


    let result = [];

    for (let i = 0; i < N; i++) {
        result[i] = identity(2);
    }

    result[target] = U;
    //console.log(result);

    return tensor(result);

}


//------------PERMUTE IS RIGHT---------------
function permute(qobj, p) {
    // debugger

    // TODO: 注意下有没有这样其他没有返回新的object的
    let qubit_num = p.length;
    let state_num = qobj.rows

    if(2**qubit_num != state_num) {
        console.error(qobj, 'can not be permuted by ', p, 'becase they don\'t have same number of qubit')
        debugger
    }
    let new_qobj = new QObject(qobj.rows, qobj.cols);
    // debugger
    let state2new_state = {}
    for(let state = 0; state < state_num; state++) {
        let binary_state = binary(state, qubit_num)
        //console.log("binary_state",[...binary_state]);
        // console.log(state, binary_state.join(''))
        //binary_state = binary_state.reverse();
        // binary_state.reverse()  //低位在后
        let new_binary_state = p.map(value=>binary_state[value])
        let j = 0;
        for(let i= binary_state.length-1; i>= 0; i--)
        {
            
            new_binary_state[p[j]] = binary_state[i];
            j++; 
        }
        //console.log(binary_state,new_binary_state);
        new_binary_state = new_binary_state.reverse();
        let new_state = binary2int(new_binary_state)
        
        // binary_state.reverse()
        state2new_state[state] = new_state
        // console.log(state, new_state, binary_state, new_binary_state, p)

    }
    // console.log("state2new",state2new_state);
    // let state_mask = new QObject(qobj.rows, qobj.cols).data

    // debugger
    // 先换行
    //console.log("qobj",qobj.copy())
    for(let state1 = 0; state1 < state_num; state1++) {
        for(let state2 = 0; state2 < state_num; state2++) {

            let new_state1 = state2new_state[state1]
            let new_state2 = state2new_state[state2] 
            //console.log(state1,state2,new_state1,new_state2)
            new_qobj.data[new_state1][new_state2] = complex(qobj.data[state1][state2].re,qobj.data[state1][state2].im)
        }

    }

    return new_qobj;
}

function exchange(array, ia, ib) {
    let xtm = array[ia];
    array[ia] = array[ib];
    array[ib] = xtm;
}

function exchange2d(array, iax, iay, ibx, iby) {
    let value = array[iax][iay]
    array[iax][iay] = array[ibx][iby]
    array[ibx][iby] = value
}


function gateExpand2toN(U, N, control, target) {
    if (N < 2) {
        throw "integer N must be larger or equal to 2";
    }
    if (control >= N || target >= N) {
        throw "control and not target must be integer < integer N";
    }
    if (control == target) {
        throw "target and not control cannot be equal";
    }

    let tmp = [];
    tmp[0] = U;

    let i;
    for (i = 1; i < N - 1; i++) {
        tmp[i] = identity(2);
    }

    let p = [];
    for (i = 0; i < N; i++) {
        p[i] = i; // N - i - 1;
    }
    // [2,1,0]

    // debugger
    if (target == 0 && control == 1) {
        exchange(p, target, control);
    }
    else if (target == 0) {
        exchange(p, target, 1);
        exchange(p, 1, control);
    }
    else {
        exchange(p, 1, target);
        exchange(p, 0, control);
    }

    //console.log(p);

    let result = tensor(tmp);

    // console.log(result);

    result = permute(result, p);

    //console.log(result);
    return result;

}

function controlledGate(U, N = 2, control = 0, target = 1, control_value = 1) {
    if (N == 2 && control == 0 && target == 1) {
        let tar1 = tensor(fockDm(2, 1 - control_value), identity(2));
        let tar2 = tensor(fockDm(2, control_value), U);
        for (let i = 0; i < tar1.rows; i++) {
            for (let j = 0; j < tar1.cols; j++) {
                tar1.data[i][j] =math.add(tar1.data[i][j], tar2.data[i][j]);
            }
        }
        return tar1;
    }

    let U2 = controlledGate(U, undefined, undefined, undefined, control_value);
    // console.log(U2)

    return gateExpand2toN(U2, N, control, target);
}


function groundState(qubit_number, excited_bases = undefined){
    let base_number = pow2(qubit_number)
    let state = range(0, base_number).map(elm => complex(0, 0))

    // debugger
    if(excited_bases == undefined){
        state[0] = complex(1, 0)
    }else{
        let excited_number = excited_bases.length
        let amplitude = math.sqrt(1/excited_number)
        excited_bases.forEach(elm => state[elm] = complex(amplitude, 0))
    }
    
    return state
}

// -------test------------
// target = 1;
// N = 3;
// U = new QObject(2,2);

// U.data = [[0,1],
//          [1,0]];

// console.log(gateExpand1toN(U,N,target));

export {
    QObject,
    tensor,
    innerTensor,
    identity,
    fockDm,
    gateExpand1toN,
    permute,
    exchange,
    controlledGate,
    dot,
    groundState,
    tensorState,
}