import { cos, sin, round, pi, complex } from 'mathjs'
import d3Draw from './D3Draw'
import {Matrix} from 'ml-matrix';
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
	let container = document.getElementById('d3_drawing') //index.html里面预留的部分

	// add SVG into container
	container.innerHTML = svg
}
function exportSVG(qc) {
	const options = {
		data: qc,
	}

	d3.exportD3SVG(qc)
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

// TODO: 判断这几个比特组成的状态是不是纯态
function isPure(qubits, state) {

}

function isUnitary(operator){

}

function isNormalized(vector){
	
}

function get_binary(dec,len)
{
    let bin = [];
    let k = 0;
    for(k=0;k<len;k++)
    {
        bin[k] = 0;
    }
    k = len-1;
    while(dec > 0)
    {
        bin[k] = dec%2;
        dec = Math.floor(dec/2);
        k--;
    }    
    return bin;    
}

function not_equal(bin1,bin2,range)
{
    let i = 0;
    let j = 0;
    for(i=range[0];i<range[1];i++)
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
    let std = get_binary(num, range[1]-range[0]);
    
    for(i=0; i<state_vector.length; i++)
    {
        let tmp = get_binary(i,total);
        
        if(not_equal(std,tmp,range))
            continue;
        
        res += state_vector[i];
    }
    
    return res;
}

function get_varstate(state_vector,var_index)
{
    let res = {};

    // for(i=0;i<state_vector.length;i++)
    // {
    //     state_vector[i]=state_vector[i]*state_vector[i];
    // }
    
    for(key in var_index)
    {       
        res[key] = {};
        res[key]['prob'] = [];
        res[key]['magn'] = [];
        let i = 0;
        let bits = var_index[key][1] - var_index[key][0];
        let prob = 0;
        for(i=0; i<Math.pow(2,bits); i++)
        {
            prob = sum(state_vector,i,var_index[key],Math.log2(state_vector.length));
            res[key]['prob'][i] = prob;
            res[key]['magn'][i] = Math.sqrt(prob);
        }        
    }
    
    return res;
}

function alt_tensor(l1,l2)
{   
	let res = [];
    let k = 0;
    
    for(i=0;i<l1.length;i++)
    {
    	for(j=0;j<l2.length;j++)
        {
            let med = l1[i].concat([l2[j]]);
            res[k] = med;
            k++;
        }
    }
    return res;
}

function state_filtered(state_vector, var_index, filter)
{
    let i = 0;
    let neo_sv = [];
    let com = [];
    for(key in filter)
    {
        if(com.length==0)
        {
            for(i = 0 ;i<filter[key].length;i++)
                com[i]=[filter[key][i]];
            continue;
        }
        com = alt_tensor(com,filter[key]);
    }
    
    let k = 0;
    let total = Math.log2(state_vector.length);
    for(i=0; i<com.length; i++)
    {
        let tmp = com[i];
        let index = 0;
        
        let j = 0;
        
        for (key in var_index)
        {
            index += tmp[j] * (Math.pow(2,total-var_index[key][1]));
            j++;
        }
        
        neo_sv[k] = index;
        k++;
    }
    return neo_sv;
    
}

function density(braket)
{ 
    let mat = new Matrix([braket]);
    let mat_tr = mat.transpose();
    let res = mat_tr.mmul(mat);
    
    return res;
}

function linear_entropy(var_state)
{
    let mat = density(var_state);
    mat = mat.mmul(mat);
    
    let trace = 0;
    let i = 0;
    for(i=0; i<var_state.length; i++)
    {
        trace += mat.get(i,i);
    }

    return 1 - trace;
}

function get_entropy(vars)
{
    let i = 0;
    let ent = 0;
    for(i=0;i<vars.length;i++)
    {
        ent += linear_entropy(vars[i]);
    }
    return ent/vars.length;
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
	get_varstate,
	state_filtered,
	get_entropy,
}
