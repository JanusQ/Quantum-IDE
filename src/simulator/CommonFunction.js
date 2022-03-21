import { cos, sin, round, pi, complex } from 'mathjs'
import { create, all } from 'mathjs'
import d3Draw from './D3Draw'
import { Matrix, inverse } from 'ml-matrix';
const config = {}
const math = create(all, config)


// import { create, all } from 'mathjs'
// const math = create(all)
const options = {
    write1Background: 'yellow',
    write1FontColor: 'blue',
    write0FontColor: 'blue'
}
const d3 = new d3Draw(options)
function showInDebuggerArea(circuit) {
    // SVG is returned as string
    let svg = circuit.exportSVG(true)
    // console.log(svg)
    let container = document.getElementById('circuit_view') //index.html里面预留的部分

    // add SVG into container
    container.innerHTML = svg
}
function exportSVG(qc) {
    d3.clear()
    d3.exportD3SVG(qc)
}
function restore() {
    d3.restore()
}
function createFile(circuit, type) {
    let file
    if (type === 'svg') {
        file = circuit.exportSVG(true)
    } else if (type === 'js') {
        file = circuit.exportJavaScript('', true)
    }
    return file
}

// 单个qubit的位数转换为qcEngine里面的二进制
function pow2(qubit) {
    return 2 ** qubit
}

// int转换为二进制
function binary(num, qubit_num = 0) {
    //定义变量存放字符串
    let result = []
    while (true) {
        //取余
        let remiander = num % 2
        //将余数倒序放入结果中
        result = [remiander, ...result] //+是字符串的拼接
        //求每次除2的商
        num = ~~(num / 2)
        // num= num>>1;
        if (num === 0) break
    }
    // console.log(num, result)
    return [...range(0, qubit_num - result.length).map((_) => 0), ...result]
}

function binary2int(binary) {
    let value = 0
    binary.forEach((elm, index) => {
        if (elm == 1) {
            value += 2 ** (binary.length - index - 1)
        }
    })
    return value
}

// 二进制计算qubit为1的状态的位数
function binary2qubit1(state_value) {
    let qubit2value = binary(state_value)
    let qubits = []
    for (let qubit = 0; qubit < qubit2value.length; qubit++) {
        if (qubit2value[qubit] == 1) {
            qubits.push(qubit2value.length - qubit - 1)
        }
    }

    // 小的在后
    qubits.sort()
    qubits.reverse()

    return qubits // 确定下是不是从小到大
}

// 转成qcengine的格式
function qubit12binary(qubits) {
    qubits = unique(qubits)
    return qubits.reduce((sum, val) => sum | pow2(val), 0)
}

function range(start, end, reverse = false) {
    let array = []

    for (let i = start; i < end; i++) {
        array.push(i)
    }

    if (reverse) {
        array.reverse()
    }
    return array
}

function toPI(rotation) {
    return (rotation / 180) * Math.PI
}

// rotation给的是pi的
function getComplex(exp) {
    //{r, phi}
    // debugger
    return complex(exp)
}

function getExp(complex_value) {
    return complex_value.toPolar() //{r, phi}
}

function unique(list) {
    return [...new Set(list)]
}


function calibrate(phase, ZERO = false) {
    while (phase < 0) {
        phase += Math.PI * 2;
    }
    while (phase > 2 * Math.PI) {
        phase -= Math.PI * 2;
    }
    if (ZERO == true) {
        if (Math.abs(phase - Math.PI * 2) < 1e-5)
            phase -= Math.PI * 2;
    }
    return phase;
}

function isPure(state, precision = 1e-5) {// state: state vector of a grouped qubits  
    let mat = density(state);
    let trace = math.trace(mat);

    if (Math.abs(1 - trace.re) > precision)
        return false;
    else
        return true;
}

function conj_tran(mat) {
    let mat_tr = math.transpose(mat);
    for (let i = 0; i < mat_tr.size()[0]; i++) {
        for (let j = 0; j < mat_tr.size()[1]; j++) {
            mat_tr.set([i, j], mat_tr.get([i, j]).conjugate());
        }
    }
    return mat_tr;
}

function isUnitary(operator, precision = 1e-5) {
    let mat = math.matrix(operator);

    let mat_tr = conj_tran(mat);

    let res = math.multiply(mat, mat_tr);

    for (let i = 0; i < mat_tr.size()[0]; i++) {
        for (let j = 0; j < mat_tr.size()[1]; j++) {
            let tmp = res.get([i, j]);

            tmp = tmp.re * tmp.re + tmp.im * tmp.im;
            if (i == j) {
                if (Math.abs(tmp - 1) > precision)
                    return false;
            }
            else {
                if (Math.abs(tmp - 0) > precision)
                    return false;
            }
        }
    }

    return true;
}

function isNormalized(vector, precision = 1e-5) {
    let len = vector.length;
    let res = 0;
    for (let i = 0; i < len; i++) {
        res += vector[i].re * vector[i].re + vector[i].im * vector[i].im;
    }

    if (Math.abs(res - 1) < precision)
        return true;
    else
        return false;
}

function not_equal(bin1, bin2, range) {
    let i = 0;
    let j = 0;
    for (i = range[0]; i < range[1]; i++) {
        if (bin1[j] != bin2[i])
            return true;
        j++;
    }
    return false;
}

function sum(state_vector, num, range, total) {
    let i = 0;
    let res = 0;
    let std = binary(num, range[1] - range[0]);
    std = std.reverse();

    for (i = 0; i < state_vector.length; i++) {
        let tmp = binary(i, total);
        tmp = tmp.reverse();

        if (not_equal(std, tmp, range)) {
            continue;
        }
        res += state_vector[i];
    }

    return res;
}

function average_sum(state_vector, num, range, total, probs) {
    let i = 0;
    let res = 0;
    let std = binary(num, range[1] - range[0]);
    std = std.reverse();
    let count = 0;
    for (i = 0; i < state_vector.length; i++) {
        let tmp = binary(i, total);
        tmp = tmp.reverse();

        if (not_equal(std, tmp, range)) {
            continue;
        }
        res += state_vector[i] * probs[i];
        //count++;
    }

    return res;
}

function alt_tensor(l1, l2, key) {
    let res = [];
    let k = 0;

    for (let i = 0; i < l1.length; i++) {
        for (let j = 0; j < l2.length; j++) {
            let med = { ...l1[i] };//.concat([l2[j]]);
            med[key] = l2[j];
            res[k] = med;
            k++;
        }
    }

    return res;
}

function density(fake_vector) // input is an array 
{
    let mat = math.matrix([fake_vector]);
    let mat_tr = conj_tran(mat);
    let den = math.multiply(mat_tr, mat);

    return den;
}

function linear_entropy(density_matrix, type = undefined) {
    //console.log(fake_vector);
    let mat;
    if (type == 'vec')
        mat = density(density_matrix);
    else
        mat = density_matrix;

    mat = math.multiply(mat, mat);

    let trace = complex(0, 0);
    let i = 0;

    for (i = 0; i < mat.size()[0]; i++) {
        trace = math.add(trace, mat.get([i, i]));
    }
    //console.log(trace);
    return 1 - trace.re;
}

function average(list, index, probs, type = undefined) {
    let res = 0;
    if (type == 'magns') {
        for (let i = 0; i < index.length; i++) {
            res += list[index[i]];
        }
        res = Math.sqrt(res);
    }
    else if (type == 'probs') {
        for (let i = 0; i < index.length; i++) {
            res += list[index[i]];
        }
        res = res;
    }
    else {
        let totalprob = 0;
        for (let i = 0; i < index.length; i++) {
            totalprob += probs[index[i]];
        }
        if(totalprob != 0){
            for (let i = 0; i < index.length; i++) {
                res += list[index[i]] * probs[index[i]] / totalprob;
            }
        }
        else
            res = 0;
    }
    return res;
}

function spec(total, num, remain, maps, values) {
    let done = binary(0, total);
    let res = binary(0, total);
    let cri = binary(num, remain);
    cri = cri.reverse();

    for (let key in values) {
        let ran = maps[key];
        let tmp = binary(values[key], ran[1] - ran[0]);

        tmp = tmp.reverse();
        let k = 0;
        for (let i = ran[0]; i < ran[1]; i++) {
            res[i] = tmp[k];
            done[i] = 1;
            k++;
        }
    }

    let k = 0;
    for (let i = 0; i < total; i++) {
        if (done[i] == 0) {
            res[i] = cri[k];

            done[i] = 1;
            k++;
        }
    }
    res = res.reverse();

    return res;
}

function normalize(vector, precision = 1e-5) {
    let i;
    let cof = 0;
    for (i = 0; i < vector.length; i++) {
        cof += (vector[i].re * vector[i].re + vector[i].im * vector[i].im);
    }
    //console.log("before",cof);
    cof = Math.sqrt(cof);
    //console.log("aftercof",cof);
    if (Math.abs(cof - 0) > precision) {
        for (i = 0; i < vector.length; i++) {
            vector[i] = math.divide(vector[i], cof);
        }
    }
    //console.log([...vector]);
    return vector;
}


/**
* js数组实现权重概率分配，支持数字比模式(支持2位小数)和百分比模式(不支持小数，最后一个元素多退少补)
* @param  Array  arr  js数组，参数类型[Object,Object,Object……]
* @return  Array      返回一个随机元素，概率为其weight/所有weight之和，参数类型Object
* @author  shuiguang
*/
function weight_rand(arr) {
    //参数arr元素必须含有weight属性，参考如下所示
    //var arr=[{name:'1',weight:1.5},{name:'2',weight:2.5},{name:'3',weight:3.5}];
    //var arr=[{name:'1',weight:'15%'},{name:'2',weight:'25%'},{name:'3',weight:'35%'}];
    //求出最大公约数以计算缩小倍数，perMode为百分比模式
    var per;
    var maxNum = 0;
    var perMode = false;
    //自定义Math求最小公约数方法
    Math.gcd = function (a, b) {
        var min = Math.min(a, b);
        var max = Math.max(a, b);
        var result = 1;
        if (a === 0 || b === 0) {
            return max;
        }
        for (var i = min; i >= 1; i--) {
            if (min % i === 0 && max % i === 0) {
                result = i;
                break;
            }
        }
        return result;
    };

    //使用clone元素对象拷贝仍然会造成浪费，但是使用权重数组对应关系更省内存
    var weight_arr = new Array();
    for (let i = 0; i < arr.length; i++) {
        if ('undefined' != typeof (arr[i].weight)) {
            if (arr[i].weight.toString().indexOf('%') !== -1) {
                per = Math.floor(arr[i].weight.toString().replace('%', ''));
                perMode = true;
            } else {
                per = Math.floor(arr[i].weight * 100);
            }
        } else {
            per = 0;
        }
        weight_arr[i] = per;
        maxNum = Math.gcd(maxNum, per);
    }
    //数字比模式，3:5:7，其组成[0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2]
    //百分比模式，元素所占百分比为15%，25%，35%
    var index = new Array();
    var total = 0;
    var len = 0;
    if (perMode) {
        for (let i = 0; i < arr.length; i++) {
            //len表示存储arr下标的数据块长度，已优化至最小整数形式减小索引数组的长度
            len = weight_arr[i];
            for (let j = 0; j < len; j++) {
                //超过100%跳出，后面的舍弃
                if (total >= 100) {
                    break;
                }
                index.push(i);
                total++;
            }
        }
        //使用最后一个元素补齐100%
        while (total < 100) {
            index.push(arr.length - 1);
            total++;
        }
    } else {
        for (let i = 0; i < arr.length; i++) {
            //len表示存储arr下标的数据块长度，已优化至最小整数形式减小索引数组的长度
            len = weight_arr[i] / maxNum;
            for (let j = 0; j < len; j++) {
                index.push(i);
            }
            total += len;
        }
    }
    //随机数值，其值为0-11的整数，数据块根据权重分块
    var rand = Math.floor(Math.random() * total);
    //console.log(index);
    return arr[index[rand]];
}



export {
    pow2,
    binary,
    binary2qubit1,
    range,
    showInDebuggerArea,
    binary2int,
    toPI,
    getComplex,
    getExp,
    qubit12binary,
    createFile,
    exportSVG,
    unique,
    sum,
    alt_tensor,
    isPure,
    isNormalized,
    isUnitary,
    calibrate,
    linear_entropy,
    average,
    spec,
    conj_tran,
    restore,
    average_sum,
    normalize,
    density,
    weight_rand
}
