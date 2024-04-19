// console.log(window.MathJax.tex2svg('\\frac{1}{x^2-1}', {display: false}))

let base2notation = {}

// 在index html里面直接掉包的，代码极其ugly
// 传入一个数字base 返回 |base> 的 svg dom节点
function getDirac(base){
    if(base2notation[base]){
        return base2notation[base]
    }

    let dom =  window.MathJax.tex2svg('\\ket{' + base + '}', {display: false})
    base2notation[base] = dom.getElementsByTagName('svg')[0]
    return base2notation[base]
}


export {
    getDirac
}