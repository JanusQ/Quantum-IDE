export default class dragCircuit {
  constructor() {
    this.circuit = [
      [
        { "name": "cy", "qubit": [3, 4] },
        { "name": "crz", "qubit": [5, 6] },
        { "name": "y", "qubit": [7] },
        { "name": "pvz", "qubit": [0] }
      ],
      [
        { "name": "cz", "qubit": [3, 4] },
        { "name": "rx", "qubit": [7] }
      ],
      [
        { "name": "cz", "qubit": [3, 4] },
        { "name": "y", "qubit": [7] }
      ],
      [
        { "name": "crx", "qubit": [3, 4] },
        { "name": "x", "qubit": [7] }
      ],
      [
        { "name": "ry", "qubit": [1] },
        { "name": "rz", "qubit": [2] },
        { "name": "h", "qubit": [3] },
        { "name": "u1", "qubit": [4] },
        { "name": "u3", "qubit": [5] },
        { "name": "u2", "qubit": [6] }
      ],
      [
        { "name": "cx", "qubit": [3, 4] },
      ],
    ]

  }

  // 添加一个门到指定时间步长的门数组中
  addGate(gate, timeStep) {
    if (
      timeStep >= 0 &&
      timeStep < this.circuit.length &&
      this.circuit[timeStep]
    ) {
      let arr = this.circuit[timeStep]
      let targetQubits = Array.from({ length: gate.qubit[1] - gate.qubit[0] + 1 }, (_, index) => gate.qubit[0] + index);
      let targetQubits1 = gate.qubit
      const filteredArr = arr.filter((obj) =>
        obj.qubit.some((qubit) => targetQubits.includes(qubit))
      )
      const filteredArr1 = arr.filter((obj) =>
        obj.qubit.some((qubit) => targetQubits1.includes(qubit))
      )
      if (filteredArr.length || filteredArr1.length) {
        this.circuit.splice(timeStep, 0, [])
        this.circuit[timeStep].push(gate)
      } else {
        this.circuit[timeStep].push(gate)

      }
      // this.circuit[timeStep] = arr.filter((el) =>!filteredArr.some((d) => JSON.stringify(d) === JSON.stringify(el)))
      // this.circuit[timeStep].push(gate)

    } else if (timeStep > this.circuit.length || !this.circuit[timeStep] || this.circuit[timeStep].length == 0 || this.circuit[timeStep] == null || this.circuit[timeStep] == []) {
      // this.circuit[timeStep - 1] = []
      // this.circuit[timeStep - 1].push(gate)
      this.circuit[timeStep] = []
      this.circuit[timeStep].push(gate)
      // console.log('11',timeStep);
    }
    // console.log(this.circuit, 'circuit');
    // if()
    // console.log(gate, timeStep, 999);
  }

  // 从指定时间步长的门数组中删除一个门
  removeGate(timeStep, gate) {
    let arr = this.circuit[timeStep]
    this.circuit[timeStep] = arr?.filter(
      (obj) =>
        obj?.name !== gate?.name ||
        JSON.stringify(obj?.qubit) !== JSON.stringify(gate?.qubit)
    )
  }
  selectGate(x, gate) {
    // console.log(x,gate,'x,gate');
    const index = this.circuit[x].findIndex(
      (item) =>
        item.name === gate.name &&
        JSON.stringify(item.qubit) === JSON.stringify(gate.qubit)
    )
    return index
  }
  changeGate(x, changeGate, changecontent) {
    const index = this.circuit[x].findIndex(
      (item) =>
        item.name === changeGate.name &&
        JSON.stringify(item.qubit) === JSON.stringify(changeGate.qubit)
    )
    let arr = this.circuit[x]
    arr = arr.filter(obj => obj.name !== changeGate.name || obj.qubit.toString() !== changeGate.qubit.toString());
    let hasCommonValue = arr.some((item) => {
      return item.qubit.some((q) => changecontent?.qubit.includes(q));
    });
    if (!hasCommonValue) {
      this.circuit[x][index] = changecontent
    }
  }
}
