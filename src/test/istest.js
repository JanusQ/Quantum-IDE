import { complex } from 'mathjs'
import { create, all } from 'mathjs'
import { isUnitary,calibrate,conj_tran } from '../simulator/CommonFunction'
const config = { };
const math = create(all, config);

console.log("hello 2022");
let a = complex(1,0)
let b = complex(0,0)
let c = complex(0,0)
let d = complex(-1,0)

const e = math.matrix([[a, b], [c, d]]);

console.log(e);
console.log(isUnitary(e));
console.log("end");