import { pow2, binary, binary2qubit1, range, binary2int,} from '../simulator/CommonFunction'
import * as deepcopy from 'deepcopy';

// 这里放了一些计算门需要的函数
class Qobject {
    // 行，列
    constructor(r, c) {
        this.rows = r;
        this.cols = c;
        this.data = [];
        let i, j;
        for (i = 0; i < r; i++) {
            this.data[i] = [];
        }
        for (i = 0; i < r; i++) {
            for (j = 0; j < c; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    copy(){
        let new_obj = new Qobject(this.rows, this.cols);
        new_obj.data = deepcopy(this.data) 
        return new_obj;
    }
}


function dot()
{
    if(arguments.length == 1)
        return arguments[0];  
    
    let i = 1;
    let result = arguments[0];
    
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
    let res = new Qobject(m1.rows,m2.cols);

    let i,j,k;
    for(i=0;i<r;i++)
    {
        for(j=0;j<c;j++)
        {
            let tmp = 0;
            for(k=0;k<mu;k++)
            {
                tmp += m1.con[i][k] * m2.con[k][j]; 
            }
            res.con[i][j] = tmp;
        }
    }
    return res;
}

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

function innerTensor(t1, t2) {
    let row = t1.rows * t2.rows;
    let col = t1.cols * t2.cols;
    let result = new Qobject(row, col);
    let i, j;

    for (i = 0; i < row; i++) {
        for (j = 0; j < col; j++) {
            result.data[i][j] = t1.data[Math.floor(i / t2.rows)][Math.floor(j / t2.cols)] * t2.data[i % t2.rows][j % t2.cols];

        }
    }
    return result;
}


//-------------------------------------------------------------//
function identity(N) {
    let id = new Qobject(N, N);
    let i;
    for (i = 0; i < N; i++) {
        id.data[i][i] = 1;
    }
    return id;
}


function fockDm(dim, N) {
    let res = new Qobject(dim, dim);
    res.data[N][N] = 1;
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


//------------WARNING PERMUTE IS NOT RIGHT---------------
function permute(qobj, p) {
    // debugger

    // TODO: 注意下有没有这样其他没有返回新的object的
    let qubit_num = p.length;
    let state_num = qobj.rows

    if(2**qubit_num != state_num) {
        console.error(qobj, 'can not be permuted by ', p, 'becase they don\'t have same number of qubit')
        debugger
    }
    let new_qobj = new Qobject(qobj.rows, qobj.cols);

    let state2new_state = {}
    for(let state = 0; state < state_num; state++) {
        let binary_state = binary(state, qubit_num)
        binary_state.reverse()  //低位在后
        let new_binary_state = p.map(value=>binary_state[value])
        let new_state = binary2int(new_binary_state)
        
        state2new_state[state] = new_state
        // console.log(state, new_state, binary_state, new_binary_state, p)

    }

    // console.log(state2new_state)
    // let state_mask = new Qobject(qobj.rows, qobj.cols).data

    // debugger
    // 先换行
    for(let state1 = 0; state1 < state_num; state1++) {
        for(let state2 = 0; state2 < state_num; state2++) {

            let new_state1 = state2new_state[state1]
            let new_state2 = state2new_state[state2] 
            
            new_qobj.data[new_state1][new_state2] = qobj.data[state1][state2]
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
        p[i] = i;
    }

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

    //result = permute(result,p);

    //console.log(result);
    return result;

}

function controlledGate(U, N = 2, control = 0, target = 1, control_value = 1) {
    if (N == 2 && control == 0 && target == 1) {
        let tar1 = tensor(fockDm(2, 1 - control_value), identity(2));
        let tar2 = tensor(fockDm(2, control_value), U);
        for (let i = 0; i < tar1.rows; i++) {
            for (let j = 0; j < tar1.cols; j++) {
                tar1.data[i][j] += tar2.data[i][j];
            }
        }
        return tar1;
    }

    let U2 = controlledGate(U, undefined, undefined, undefined, control_value);
    console.log(U2)

    return gateExpand2toN(U2, N, control, target);
}


// -------test------------
// target = 1;
// N = 3;
// U = new Qobject(2,2);

// U.data = [[0,1],
//          [1,0]];

// console.log(gateExpand1toN(U,N,target));

export {
    Qobject,
    tensor,
    innerTensor,
    identity,
    fockDm,
    gateExpand1toN,
    permute,
    exchange,
    controlledGate,
    dot,
}