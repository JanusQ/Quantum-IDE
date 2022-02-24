import { complex } from 'mathjs'
import { create, all } from 'mathjs'
import { isUnitary } from '../simulator/CommonFunction'
const math = create(all, config)


let a = complex(0,0)
let b = complex(1,0)
let c = complex(0,0)
let d = complex(1,0)

const e = math.matrix([[a, b], [c, d]]);

isUnitary(e);