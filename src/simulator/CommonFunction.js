import { cos, sin, round, pi, complex } from 'mathjs'
import { create, all } from 'mathjs'
import d3Draw from './D3Draw'
import {Matrix,inverse} from 'ml-matrix';
const config = { }
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
function restore(){
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

function unique(list){
	return [...new Set(list)]
}


function calibrate(phase)
{
    while(phase < 0)
    {
        phase += Math.PI*2;
    }
    while(phase > 2*Math.PI)
    {
        phase -= Math.PI*2;
    }
    return phase;
}

// TODO: 判断这几个比特组成的状态是不是纯态
function isPure(state, precision = 1e-5) {// state: state vector of a grouped qubits  
    let mat = density(state);
    let trace = math.trace(mat);
    
    if(Math.abs(1-trace.re) > precision)
        return false;
    else
        return true;
}

function conj_tran(mat)
{
    let mat_tr = math.transpose(mat);
    for(let i=0; i<mat_tr.size()[0];i++)
    {
        for(let j=0; j < mat_tr.size()[1];j++)
        {
            mat_tr.set([i,j],mat_tr.get([i,j]).conjugate());
        }
    }
    return mat_tr;
}

function isUnitary(operator, precision = 1e-5){
    let mat = math.matrix(operator);
    
    let mat_tr = conj_tran(mat);

    let res = math.multiply(mat, mat_tr);

    for(let i=0; i<mat_tr.size()[0];i++)
    {
        for(let j=0; j < mat_tr.size()[1];j++){
            let tmp =res.get([i,j]);
            
            tmp = tmp.re*tmp.re + tmp.im*tmp.im;
            if(i == j){
                if(Math.abs(tmp-1) > precision)
                    return false;
            }
            else{
                if(Math.abs(tmp-0) > precision)
                    return false;
            }
        }
    }
    
    return true;
}

function isNormalized(vector, precision = 1e-5){
	let len = vector.length;
    let res = 0;
    for(let i=0; i<len; i++)
    {
        res += vector[i].re * vector[i].re + vector[i].im * vector[i].im;     
    }

    if(Math.abs(res - 1) < precision)
        return true;
    else
        return false;
}

function not_equal(bin1,bin2,range)
{
    let i = 0;
    let j = 0;
    for(i=range[0]; i<range[1]; i++)
    {
        if(bin1[j] != bin2[i])
            return true;
        j++;
    }
    return false;
}

function sum(state_vector, num, range, total)
{
    let i = 0;
    let res = 0;
    let std = binary(num, range[1]-range[0]);
    std = std.reverse();

    for(i=0; i<state_vector.length; i++)
    {
        let tmp = binary(i, total);
        tmp = tmp.reverse();
        
        if(not_equal(std, tmp, range)){
            continue;
        }
        res += state_vector[i];
    }
    
    return res;
}

function alt_tensor(l1,l2,key)
{   
	let res = [];
    let k = 0;
    
    for(let i=0; i<l1.length; i++)
    {
    	for(let j=0; j<l2.length; j++)
        {
            let med = {...l1[i]};//.concat([l2[j]]);
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

function linear_entropy(fake_vector)
{
    let mat = density(fake_vector);
    
    mat = math.multiply(mat, mat);
    
    let trace = complex(0,0);
    let i = 0;
    
    for(i=0; i<fake_vector.length; i++)
    {
        trace = math.add(trace, mat.get([i,i]));
    }
    //console.log(trace);
    return 1 - trace.re;
}

function average(list,index)
{
    let res = 0;
    for(let i=0; i<index.length; i++)
    {
        res += list[index[i]];
    }
    return res/index.length;
}

function spec(total, num, remain, maps, values)
{
    let done = binary(0, total);
    let res = binary(0, total);
    let cri = binary(num,remain);
    cri = cri.reverse();

    for(let key in values)
    {
        let ran = maps[key];
        let tmp = binary(values[key], ran[1]-ran[0]); 
        
        tmp = tmp.reverse();
        let k = 0;
        for(let i=ran[0]; i<ran[1]; i++)
        {
            res[i] = tmp[k];
            done[i] = 1;
            k++;
        } 
    }

    let k = 0;
    for(let i=0; i<total; i++)
    { 
        if(done[i] == 0)
        {
            res[i] = cri[k];
            
            done[i] = 1;
            k++;
        }      
    }
    res = res.reverse();

    return res;
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
    restore
}
