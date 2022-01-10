


function showInDebuggerArea(circuit){
    // SVG is returned as string
    let svg = circuit.exportSVG(true);
    let container = document.getElementById("debug_drawing");  //index.html里面预留的部分

    // add SVG into container
    container.innerHTML = svg;
}


export {
    showInDebuggerArea
}