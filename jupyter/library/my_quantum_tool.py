from collections import defaultdict
import itertools
import re
from numpy import pi
import numpy as np
from numpy.lib.type_check import real
from numpy.matrixlib.defmatrix import matrix
from qutip import *
from qutip.qip.operations import *
from qutip.qip.circuit import QubitCircuit, Gate
import math
import pandas as pd

def calculateStateByHamilton(H, S):
     return dot(H, S)  #汉密顿点乘以当前状态


def MultiQubitBaseState(qubit_num):
    return basis(2**qubit_num, 0)


# 加一个计算张量积的
# 好像也没有办法知道张量积的逆
# 目前只考虑正数
class QInt():
    def __init__(self, qubit_num, initial_probability_distribution):
        self.qubit_num = qubit_num
        self.multi_qubit_state = np.zeros(2**qubit_num)
        # MultiQubitBaseState(qubit_num)

        max_value = max(initial_probability_distribution.keys())
        assert max_value >= self.bound[0] and max_value <= self.bound[1]

        # 归一化
        sum_probability = sum(initial_probability_distribution.values())
        normalized_probability_distribution = {
            value: probability / sum_probability
            for value, probability in initial_probability_distribution.items()
        }

        for value, probability in normalized_probability_distribution.items():
            self.multi_qubit_state[value] = probability

        self.multi_qubit_state = Qobj(self.multi_qubit_state)  #Qobj 是不能赋值的
    # upper and lower bound
    # 基于qubit的数量计算上下界
    @property
    def bound(self):
        return [0, 2**self.qubit_num]

    def state_of_each_qubits(self):
        return

def BaseQubit():
    return Qobj([[1],[0]])
base_qubit = BaseQubit()

def ExcitedQubit():
    return Qobj([[0],[1]])
excited_qubit = ExcitedQubit()

def InitializedState(binary_string):
    state = None
    for binary in binary_string:
        if binary == '1':
            qubit_state = ExcitedQubit()
        else:
            qubit_state = BaseQubit()
            
        if state is None:
            state = qubit_state
        else:
            state = tensor(state, qubit_state)
    return state

def dot(*matrixes):
    if len(matrixes) == 1:
        return matrixes[0]
    # print(matrixes)
    result = np.dot(matrixes[0], matrixes[1])
    for matrix in matrixes[2:]:
        result = np.dot(result, matrix)
    return Qobj(result)

# 为了能让原先的state可以做ptrace
def changeDims(state):
    qubit_num = int(math.log(state.shape[0], 2))
    return Qobj(state, dims =[[2,]*qubit_num, [1]*qubit_num], )

# 获得虚数的指数形式
# def getExp(value):
#     r = abs(value)
#     if r == 0:
#         return [0], 0
#     value /= r
#     if value.real == 0:
#         return r, pi/2
#     theta = math.atan(value.imag/value.real)
#     return r, theta

def getExp(value):
    r = abs(value)
    if r == 0:
        return 0, 0
    cos, sin = value.real/r, value.imag/r
    # print(cos, sin)
    value /= r
    if value.real == 0:
        return round(float(r), 2), round(angle180(pi/2), 2) * (1 if sin > 0 else -1)
    # if value.imag == 0:
    #     return round(float(-r), 2),0  # 180和-180都是没有相位可以看做
    theta = math.atan(sin/cos)
    
#     大于0的时候就是对的了
    if cos < 0:
        if sin>0:
            theta = theta + pi
        else:
            theta = theta - pi

    # print(value, round(float(r), 2), round(angle180(theta), 2))
    return round(float(r), 2), round(angle180(theta), 2)

# (-1+0j) = 1.0 -180.0  

def getExpState(qobj):
    exp_obj = []
    for row in qobj:
        new_row = []
#         print(row)
        for column in row:
            r, theta = getExp(column)
            new_row.append((r, theta))
        exp_obj.append(new_row)
    return exp_obj
# 显示每个态的r和phase
# 还需要加一个态的对齐

# 得到指数形式计算虚数形式
def getComplex(exp):
    r, theta = exp
#     print(theta)
    theta = theta/180 * pi
#     print(r * math.cos(theta), r, math.sin(theta), math.cos(theta), theta)
    real = r * math.cos(theta)  #这个要改成输入
    imag = r * math.sin(theta) * 1j
    value = real + imag
    return value / abs(value)

def complexString(value):
    exp_value = getExp(value)
    r, phase = exp_value
    if round(value, 4) == 0:
        return ''
    
    if phase == 0:
        return str(r)
    
    return '|'.join([str(r), str(round(phase),)])


def density(state):
    return dot(state, state.dag())

# 得到范围是[-180, +180]度的角度
def angle180(angle_pi):
    angle = 180 * angle_pi / np.pi
    while angle > 180:
        angle -= 360
    while angle < -180:
        angle += 360
    return  float(angle)

# 输入状态输出概率
def state2prob(state):
    state = state.full().reshape((state.shape[0]))
    return Qobj(state * state)

def stringBinary(binary_string):
    value = 0
    for index, value in enumerate(binary_string):
        if value == '1':
            index = len(binary_string) - index - 1
            value += 2** index
    print(binary_string, value)
    return value

def binaryString(intger, length = None):
    binary_string = bin(intger).replace('0b','')
    if length is None or length < len(binary_string):
        length = len(binary_string)
    length = int(length)
    return '0' * (length - len(binary_string)) + binary_string

def paresGateMatrix(matrix):
    assert matrix.isunitary  #不是isherm吗
    # assert matrix.isherm  #不是isherm吗
    
    length = matrix.shape[0]
    qubit_num = int(math.log2(length))
#     print(length)
    print_str = ''
    for i in range(length):
        print_str += binaryString(i, qubit_num) + '\t'
    print(print_str)

    for i in range(length):
        print_str = ''
        for j in range(length):
#             print(i, j)
            value = matrix[i][0][j]
            if value == 0:
                print_str += '0\t'
            else:
                exp_value = getExp(value)
                print_str += '|'.join([str(exp_value[0]), str(round(exp_value[1]),)]) + '\t'
        print_str += binaryString(i, qubit_num)
        print(print_str)

def paresGateMatrixPd(matrix, global_phase = 0):
    assert matrix.isunitary  #不是isherm吗
    # assert matrix.isherm  #不是isherm吗

    length = matrix.shape[0]
    qubit_num = int(math.log2(length))

        
    data = {
        binaryString(qubit1, qubit_num): [
            0
            for qubit2 in range(length)
        ]
        for qubit1 in range(length)
    }

    for i in range(length):
        ib = binaryString(i, qubit_num)
        for j in range(length):
#             print(i, j)
            value = matrix[i][0][j]
            if value == 0:
                data[ib][j] = ''
            else:
                data[ib][j] = complexString(value)
                # exp_value = getExp(value)
                # phase = global_phase + exp_value[1]
                # if phase == 0:
                #      data[ib][j] = str(exp_value[0])
                # else:
                #     data[ib][j] = '|'.join([str(exp_value[0]), str(round(phase),)])


    df=pd.DataFrame(data,index=[binaryString(qubit, qubit_num) for qubit in range(length)])
    return df

def parseEvolutionPd(matrix, state, global_phase = 0):
    assert matrix.isunitary  #不是isherm吗

    length = matrix.shape[0]
    qubit_num = int(math.log2(length))

    data = {
        binaryString(qubit1, qubit_num): [
            0
            for qubit2 in range(length)
        ] + [None]
        for qubit1 in range(length)
    }

    for target_state in range(length):
        target_state_binary = binaryString(target_state, qubit_num)
        final_value = 0
        for source_state in range(length):
            state_value = state[source_state][0][0]
            gate_value = matrix[target_state][0][source_state]
            
            gate_label = complexString(gate_value)
            
            value = state_value * gate_value
            value_label = complexString(value)
            
            final_value += value

            if value != 0:
                data[target_state_binary][source_state] = gate_label  + '=>' + value_label
            else:
                data[target_state_binary][source_state] = gate_label

        data[target_state_binary][length] = complexString(final_value)
    df=pd.DataFrame(data,index=[f'{binaryString(base, qubit_num)}: {complexString(state[base][0][0])}' for base in range(length)] + ['result'])
    return df

# def parseStateVec(state):
#     qubit_num = int(math.log2(state.shape[0]))
#     for i in range(state.shape[0]):
#         print(binaryString(i, qubit_num),  '\t', getExp(state[i][0][0]))

def parseStateVecPd(state, global_phase = 0):
    qubit_num = int(math.log2(state.shape[0]))
    length = state.shape[0]
    data = {}
    for qubit in range(length):
        value = state[qubit][0][0]
        if value == 0:
            data[binaryString(qubit, qubit_num)] = ''
        else:
            data[binaryString(qubit, qubit_num)] = complexString(value)
            # exp_value = getExp(value)
            # phase = global_phase + exp_value[1]
            # if phase == 0:
            #     data[binaryString(qubit, qubit_num)] = str(exp_value[0])
            # else:
            #     data[binaryString(qubit, qubit_num)] = '|'.join([str(exp_value[0]), str(round(phase),)])

    df=pd.DataFrame(data,index=['state'])
    return df

# int1 = QInt(5,  {1: 0.5, 4: 0.5})
# print(int1)


# arr1 = np.array([[0.5], [0.3]])
# arr2 = np.array([[0.4], [0.6]])
# arr3 = np.array([0.7, 0.8])
# kronx = np.kron(arr1,arr2)
# print(kronx)

# list1 = [0, 1]
# list2 = [0, 1]

# # 00 10 01 11

# for a, b in itertools.product(list1, list2):
#     print(a, b, a * b)

# 再拆一个根据基得到矩阵的

def getMeasureMatrix(read_indexs, qubit_number):
    return

# 测量其中几个比特的概率，需要的话算下之后 状态
def measure(now_state , qubit_indexes, get_next_state=False):
    qubit_number = int(math.log(now_state.shape[0], 2))
    measure_number = len(qubit_indexes)
    
    base2measure_matrix = {}

    measure_base_number = 2**measure_number
    not_measure_base_number = 2**(qubit_number - measure_number)
    total_base_number = 2**qubit_number

    not_measure_qubit_indexes = [
        i
        for i in range(qubit_number)
        if i not in qubit_indexes
    ]

    probs = []
    # 生成每个符合状态的观测矩阵, 以后可以考虑下动态规划
    for base_index in range(measure_base_number):
        measure_bases = [int(_) for _ in bin(base_index)[2:]]
        measure_bases = [0] * (measure_number - len(measure_bases)) + measure_bases
        measure_bases = tuple(measure_bases)

        # 遍历没有被测量的比特（本源量子 p52）
        for other_base_index in range(not_measure_base_number):
            other_bases =  [int(_) for _ in bin(other_base_index)[2:]]
            other_bases = [0] * (qubit_number - measure_number - len(other_bases)) + other_bases
            other_bases = tuple(other_bases)

            total_base_matrixes = [
                None
                for _ in range(qubit_number)
            ]
            for measure_index, qubit_index in enumerate(qubit_indexes):
                total_base_matrixes[qubit_index] = excited_qubit  if measure_bases[measure_index] == 1 else base_qubit

            for other_index, qubit_index in enumerate(not_measure_qubit_indexes):
                # total_base_matrixes[qubit_index]
                # other_bases[other_index]
                total_base_matrixes[qubit_index] = excited_qubit if other_bases[other_index] == 1 else base_qubit

            # print(total_base_matrixes)
            bases_matrix = tensor(*total_base_matrixes)
            # print(total_base_matrixes)
            # return
            bases_matrix = bases_matrix * bases_matrix.dag()  # 应该是dag吧
            # print(bases_matrix, tensor(*total_base_matrixes))
            # print(bases_matrix)
            if measure_bases not in base2measure_matrix:
                base2measure_matrix[measure_bases] = bases_matrix
            else:
                base2measure_matrix[measure_bases] += bases_matrix

        
        bases_matrix = base2measure_matrix[measure_bases]
        base_prob = dot(now_state.dag(), bases_matrix, now_state)
        # bases_matrix.dag(), 
        base_prob = base_prob[0][0][0]

        # print(measure_bases, bases_matrix, base_prob, dot(now_state.trans(), bases_matrix, now_state))
        # assert base_prob.imag == 0,  Exception(base_prob, 'is not real')  # 感觉算出来肯定有虚数

        if get_next_state:
            next_state = None 
            if base_prob != 0:
                next_state = dot(bases_matrix, now_state) / math.sqrt(base_prob.real)
            probs.append((measure_bases, abs(base_prob), next_state))
        else:
            probs.append((measure_bases, abs(base_prob)))
    
    return np.array( probs, dtype=object)


# 给当前的State引入新的qubit, 已经测试过了是可以的
def addQubit(original_state, new_qubit):
    return tensor(original_state, new_qubit)


# 当前的总的状态，门矩阵，门矩阵对应的比特
def calculateSubstate(state, U, qubits):
    total_qubit_num = int(math.log2(state.shape[0]))
    noused_qubits = [qubit for qubit in range(total_qubit_num) if qubit not in qubits]
    qubit_num = len(qubits)
    noused_qubit_num = len(noused_qubits)
    
    state_length = state.shape[0]
    qubit_states2noused_states = defaultdict({})
    qubit2value = defaultdict(0)
    # for qubit_base in range(2**qubit_num):
    #     qubit_base_bin = binaryString(qubit_base, qubit_num)
    #     for noused_qubit_base in range(2**noused_qubit_num):

    for base in range(state_length):
        value = state[base][0][0]
        base_bin = binaryString(base)
        qubit_base_bin = ''.join([base_bin[total_qubit_num-qubit] for qubit in qubits])
        noused_qubit_base_bin = ''.join([base_bin[total_qubit_num-qubit] for qubit in noused_qubits])
        qubit_states2noused_states[qubit_base_bin][noused_qubit_base_bin] = value
        qubit2value[qubit_base_bin] += value
    
    return


if __name__ == '__main__':
    # state = np.array([[0.60355339+0.25j],
    #     [0.10355339-0.25j],
    #     [0.10355339-0.25j],
    #     [0.60355339+0.25j]])
    # # state = np.array([[0],
    # #     [2**(-1/2)],
    # #     [0],
    # #     [2**(-1/2)]])

    # state = Qobj(state)
    # measure(state, [0])
    had_state2 = dot(tensor(snot(), snot()), basis(2**2, 0))
    # paresStateVec(had_state2)
    # paresStateVec(dot(cphase(pi/2), had_state2))
    pass