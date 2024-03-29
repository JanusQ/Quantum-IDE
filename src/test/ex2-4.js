import { showInDebuggerArea } from '../simulator/CommonFunction';
import QCEngine from '../simulator/MyQCEngine'


function ex2_4(){
    var qc = new QCEngine()
    var {qint} = qc
    
    
    // Programming Quantum Computers
    //   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
    //   O'Reilly Media
    
    // To run this online, go to http://oreilly-qc.github.io?p=2-4
    
    // debugger
    qc.reset(3);
    qc.discard();
    var a = qint.new(1, 'alice');
    var fiber = qint.new(1, 'fiber');
    var b = qint.new(1, 'bob');
    
    function random_bit(q) {
        q.write(0);
        q.had();
    
        const r = q.read()
        console.log(r)
        return r;
    }
    
    // Generate two random bits
    qc.label('get two random bits');
    var send_had = random_bit(a);
    // console.log(send_had)
    
    var send_value = random_bit(a);
    qc.label('');
    
    // Prepare Alice's qubit
    a.write(0);
    qc.label('set value');
    qc.nop();
    if (send_value)
        a.not();
    qc.nop();
    qc.label('');
    qc.nop();
    qc.label('apply had');
    qc.nop();
    if (send_had)
        a.had();
    qc.nop();
    qc.label('');
    
    // Send the qubit!
    fiber.exchange(a);
    
    // Activate the spy
    var spy_is_present = true;
    if (spy_is_present)
    {
        var spy_had = 1;
        qc.nop();
        qc.label('spy');
        if (spy_had)
            fiber.had();
        let stolen_data = fiber.read();
        fiber.write(0);
        if (stolen_data)
            fiber.not();
        if (spy_had)
            fiber.had();
        qc.label('');
        qc.nop();
    }
    
    // Receive the qubit!
    var recv_had = random_bit(b);
    fiber.exchange(b);
    qc.label('apply had');
    qc.nop();
    if (recv_had)
        b.had();
    qc.nop();
    qc.label('');
    qc.nop();
    qc.label('read value');
    qc.nop();
    let recv_val = b.read();
    qc.nop();
    qc.label('');
    qc.nop();
    
    // Now Alice emails Bob to tell
    // him her had setting and value.
    // If the had setting matches and the
    // value does not, there's a spy!
    if (send_had == recv_had)
        if (send_value != recv_val)
            qc.print('Caught a spy!\n');
    
    showInDebuggerArea(qc.circuit)
    // qc.operations.forEach((op, i)=>{
    //     const {operation, state_str, result} = op
    //     console.log(operation)
    //     if(operation == 'read'){
    //         console.log(result)
    //     }
    //     console.log(state_str)
    // })
    
    
    // debugger
}

for (var i = 0; i < 4; i++){
    ex2_4()
}
