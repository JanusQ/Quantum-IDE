import itertools
from operator import contains
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
from my_gate import *

import copy




my_gates = {
    'had':  {
        'matrix_function': multi_qubit_had,
        'name': 'had',
        'args': {
            'targets': None,
        },
        'notation': '给所用比特都添加had',
    }, # todo: 未来校验约束，名字的生成都放里面, 以后可以写个组合的
    'cnot': {
        # 'matrix_function': my_cnot,   #todo：未来可以多控制一
        'original': True,  #是原先的
        'args': {
            'controls': None,
            'targets': None,
        }
    }
}

class MyCircuit():
    def __init__(self, qubit_number = 0):
        self.qubit_state = MultiQubitBaseState(qubit_number)
        # self.initial_state = self.qubit_state

        self.qubit_number = qubit_number

        self.notation2qubits = {}

        self.gates = []

        return

    @property
    def initial_state(self):
        return MultiQubitBaseState(self.qubit_number)

    # 生成一个qutip库里面的电路
    def toQutipCircuit(self):
        qutip_circuit = QubitCircuit(self.qubit_number, reverse_states=False)
        qutip_circuit.user_gates = {
            gate_name: gate_info['matrix_function']
            for gate_name, gate_info in my_gates.items()
            if not gate_info.get('original', False)
        }
        for gate, gate_args, stage_name in self.gates:
            gate_args = dict(gate_args)
            gate = gate.lower()

            gate_info = my_gates[gate]
            default_gate_args = dict(gate_info.get('args', {}))  #默认的输入
            original = gate_info.get('original', False)

            # targets = gate_args.get('targets', [])
            # controls = gate_args.get('controls', [])
            target = gate_args.get('target', None)
            control = gate_args.get('control', None)  

            # print(gate_info, original)
            if original:
                # print(gate_args)
                # if 'target' is not None:
                #     gate_args['target'] = self.parseQubitNotation(target)[0]
                # if 'control'  is not None:
                #     gate_args['control'] = self.parseQubitNotation(control)[0]
                for key, value in default_gate_args.items():
                    if key in gate_args:
                        default_gate_args[key] = value

                if target is not None:
                    # _targets = self.parseQubitNotation(target)
                    # for _ in targets:
                    #     _targets += 
                    default_gate_args['targets'] = self.parseQubitNotation(target)  #_targets
                if control is not None:
                    # _controls = self.parseQubitNotation(control) #[]
                    # for _ in _controls:
                    #     _controls += self.parseQubitNotation(_)
                    default_gate_args['controls'] = self.parseQubitNotation(control)  #_controls

                # print(default_gate_args)
                qutip_circuit.add_gate(gate.upper(), **default_gate_args)
                # targets=targets, controls = controls, target = target, control = control
            else:
                # todo：加上校验
                # print(gate_args)
                gate_args['circuit'] = self
                # targets = gate_args.get('targets', [])
                # controls = gate_args.get('controls', [])
                targets = [] 
                if target is not None:
                    targets += self.parseQubitNotation(target) #[target]

                if control is not None:
                    targets += self.parseQubitNotation(control) #[control]

                # print(targets)
                # _targets = []
                # for qubit_notation in targets:
                #     _targets += self.parseQubitNotation(qubit_notation)
                # targets = _targets
                # for qubit in targets:
                #     qubit += 1
                qutip_circuit.add_gate(gate, targets=targets, arg_value = gate_args )
            assert gate in my_gates  #, Exception('unknown gate', gate, gate_args, stage_name)

        return qutip_circuit
            

    #一组比特用一组range来表示（左包又闭）
    def addQubits(self, qubit_number, name = None, initial_state = None, ):
        start_index = self.qubit_number
        end_index = start_index + qubit_number
        self.qubit_number += qubit_number

        if initial_state is None:
            initial_state = MultiQubitBaseState(qubit_number)
        # print(type(self.qubit_state), type(initial_state))
        self.qubit_state = tensor(self.qubit_state, initial_state)


        id = (start_index, end_index)
        if name is not None:
            self.notation2qubits[name] = id
        return id

    def parseQubitNotation(self, qubits):
        # print(qubits, isinstance(qubits, tuple), len(qubits) == 2, qubits[0] <= qubits[1])
        if isinstance(qubits, tuple) and len(qubits) == 2 and qubits[0] <= qubits[1]:
            # print('hi')
            return list(range(*qubits))
        if isinstance(qubits, str):
            return self.parseQubitNotation(self.notation2qubits[qubits])
        if isinstance(qubits, (list, set, tuple)):
            qubits = list(qubits)
            qubits.sort()
            return qubits
        raise Exception('unknown qubits id', qubits)
        return None

    def measure(self, qubits, get_next_state = False):
        qubits = self.parseQubitNotation(qubits)
        return measure(self.qubit_state, qubits, get_next_state)

    def addGate(self, gate, stage_name=None, **gate_args, ):
        # print(gate_args)
        # assert 'circuit' not in gate_args
        # gate_args['circuit'] = self
        self.gates.append((gate, gate_args, stage_name))
        return len(self.gates) - 1
    
    #算到index对应的地方之后
    # 以后可以加上动态规划
    def calculateTo(self, gate_index = None, stage_name = None):
        assert gate_index is not None or stage_name is not None
        assert not (gate_index is None and stage_name is not None)

        if stage_name is not None:
            for _gate_index, (_gate, _gate_arg, _stage_name) in enumerate(self.gates):
                if _stage_name == stage_name:
                    gate_index = _gate_index
        
        assert gate_index is not None
        assert gate_index < len(self.gates)

        circuit = self.toQutipCircuit()  #先暂时直接用这个计算
        propagators = circuit.propagators()[:gate_index+1]

        # for now_index in range(gate_index+1):
        #     gate = 
        #     gate = self.gates[now_index]
        #     now_state = None
        #     pass
        
        return dot(gate_sequence_product(propagators), self.initial_state)
        # now_state
 
if __name__ == '__main__':
    circuit = MyCircuit()
    control_qubit = circuit.addQubits(1, name = 'control_qubit')
    target_qubit = circuit.addQubits(1, name = 'target_qubit')

    #给两个比特都加上50%的概率
    # circuit.addGate('had', target = control_qubit)
    # add_prob_stage = circuit.addGate('had', target = target_qubit)

    # circuit.toQutipCircuit().propagators()


    #给两个比特都加上50%的概率
    circuit.addGate('cnot', control = control_qubit, target = target_qubit)
    circuit.toQutipCircuit().propagators()