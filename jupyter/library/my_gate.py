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
from my_quantum_tool import *


pauli_z = Qobj([[1, 0], [0, -1]])
pauli_x = dot(sqrtnot(), sqrtnot())  
qeye_2 = qeye(2)

def ccphase(args):
    qubit_num = args['qubit_num']
    rotation = args['rotation']
    # controlled rotation X
    state_num = 2**qubit_num
    mat = np.zeros((state_num, state_num), dtype=np.complex)
    for i in range(state_num):
        mat[i][i] = 1
#     mat[state_num-1][state_num-1] = getComplex((1, rotation))
    mat[state_num-4:state_num,state_num-4:state_num] = cphase(rotation/180*pi)
    return Qobj(mat, dims=[qubit_num*[2]]*2)

def ncnot(args):
    #有n个c的not
    control_num = args['control_num']

    qubit_num = control_num + 1
    state_num = 2**qubit_num
    mat = np.zeros((state_num, state_num), dtype=np.complex)

    for i in range(state_num):
        state_str = binaryString(i, qubit_num)
        if all([state == '1' for state in state_str[:-1]]):
            mat[i][i] = 0
            if i % 2 == 0:
                mat[i][i+1] = 1
            else:
                mat[i][i-1] = 1
        else:
            mat[i][i] = 1

    return Qobj(mat, dims=[qubit_num*[2]]*2)


# 两控制非门
def ccnot(controls, target, N = 3,):
    assert len(controls) == 2  #controls 现在大于2的时候不对
    assert target not in controls

    CCNOT = tensor(*([qeye_2] * N)) * 3
    
    for control in controls:
        _ = [qeye_2] * N
        _[control] = pauli_z
        CCNOT += tensor(*_) 
    
        
    _ = [qeye_2] * N
    for control in controls:
        _[control] = pauli_z
    CCNOT -= tensor(*_) 
    
    _ = [qeye_2] * N
    for control in controls:
        _[control] = qeye_2 - pauli_z
    _[target] = pauli_x
    CCNOT += tensor(*_)
    return CCNOT / 4


# 单比特非门
not_gate = pauli_x

def cswap(control, targets, N=3):  #还没有测试过N=其他数字的时候
    assert N >= 3
    t0, t1 = targets
    return dot(ccnot([t0, control], t1, N), ccnot([t1, control], t0, N), ccnot([t0, control], t1, N))

# 以后可以加下别名
# qutip_gates = {
#     'SNOT': snot,  # N 矩阵数量, target 目标比特,
#     # 'HAD': snot,
# }

# def my_cnot(arg_value):
#     return

def multi_qubit_had(arg_value):
    circuit = arg_value['circuit']
    
    op_qubits = circuit.parseQubitNotation(arg_value['target'])
    N = len(op_qubits) #circuit.qubit_number  #再qutip里面应该是被控制的比特的数量
    
    operations = []
    for _ in range(N):
        # if i in op_qubits:
        operations.append(snot())
        # else:
        #     operations.append(qeye_2)
    # print(type(tensor(*operations)))
    return tensor(*operations)
