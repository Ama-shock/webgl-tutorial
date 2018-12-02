import {Context} from '../src/index';
import {mat4} from 'gl-matrix';

let gl = Context.create();
Object.defineProperty(self, "GLDemo", {value: gl});

onload = ()=>{
    gl.canvas.width = 640;
    gl.canvas.height = 480;
    document.body.appendChild(gl.canvas);
    start();
};

async function start() {
    let vertex = await fetch("gl.vert").then(res=>res.text());
    let fragment = await fetch("gl.frag").then(res=>res.text());

    let program = gl.addProgram();
    program.addVertexShader(vertex);
    program.addFragmentShader(fragment);
    
    const pMat = mat4.create();
    mat4.perspective(
        pMat,
        45 * Math.PI / 180,
        gl.canvas.clientWidth / gl.canvas.clientHeight,
        0.1,
        100.0
    );
    
    const mvMat = mat4.create();
    mat4.translate(mvMat, mvMat, [0.0, 0.0, -6.0]);

    program.setUniform('uPMatrix', pMat);
    program.setUniform('uMVMatrix', mvMat);
    
    let vertices = [
        1.0,  1.0,
        -1.0, 1.0,
        1.0,  -1.0,
        -1.0, -1.0
    ];
    program.setAttribute('aVertexPosition', new Float32Array(vertices), 2);
    var colors = [
        1.0,  1.0,  1.0,  1.0,    // 白
        1.0,  0.0,  0.0,  1.0,    // 赤
        0.0,  1.0,  0.0,  1.0,    // 緑
        0.0,  0.0,  1.0,  1.0     // 青
    ];
    program.setAttribute('aVertexColor', new Float32Array(colors), 4);

    while(true){
        program.setUniform('time', Date.now() % 3000 / 3000);
        await new Promise(res=>requestAnimationFrame(res));
        gl.draw();
    }
}