# 量子编程语言文档
这个文档是浙江大学网页版量子模拟器的api文档

# 量子电路
创建一个量子电路

    
    import QCEngine from '../simulator/MyQCEngine'  //导入包
    var qc = new QCEngine()  //初始化一个量子芯片和对应的仿真引擎
    qc.reset(4);  //设置涉及的量子比特数


## 未完成功能
### 设置是否进行仿真
可以通过`var qc = new QCEngine(simulate=false)`来关闭仿真引擎

### save(circuit_type)
可以导出为json, Q#, Qiskit等格式

# 门

`qc.write(value)`


# 变量类型

## 量子整型 (`QInt`)

### 加法
`QInt.add(value, condition=undefined)`

### 减法

### 加平方

### 傅里叶

### 逆傅里叶

## 量子浮点数




