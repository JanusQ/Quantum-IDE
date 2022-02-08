
import { showInDebuggerArea } from '../simulator/CommonFunction';
import QCEngine from '../simulator/MyQCEngine'

var qc = new QCEngine()
var {qint} = qc


var n = 4;
qc.reset(n);

qc.had(0x5)
qc.read()

showInDebuggerArea(qc.circuit)

qc.operations.forEach((op, i)=>{
    console.log(op);
})

