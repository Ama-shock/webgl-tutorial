import {Context} from '../src/index';

let gh = Context.create();
start(gh);
onload = ()=>{
    document.body.appendChild(gh.canvas);
};

async function start(gl: Context) {
    await gl.program.loadShader("gl.frag");
    await gl.program.loadShader("gl.vert");
    gl.program.init();

    // draw
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    let perspectiveMatrix = [1.8106601238250732, 0, 0, 0, 0, 2.4142136573791504, 0, 0, 0, 0, -1.0020020008087158, -1, 0, 0, -0.20020020008087158, 0];
    let mvMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -6, 1];
    
    let vertices = [
        1.0,  1.0,  0.0,
        -1.0, 1.0,  0.0,
        1.0,  -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];
    gl.buffer.staticDraw(new Float32Array(vertices));
    
    let attribute = gl.program.getAttribute('aVertexPosition');
    let pUniform = gl.program.getUniform('uPMatrix', new Float32Array(perspectiveMatrix));
    let mvUniform = gl.program.getUniform('uMVMatrix', new Float32Array(mvMatrix));
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}