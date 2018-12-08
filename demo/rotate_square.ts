import {mat4} from 'gl-matrix';
import {Context} from '../src/index';

export default async function rotateSquare(gl: Context) {
    let vertex = await fetch("rotate_square.vert").then(res=>res.text());
    let fragment = await fetch("simple_color.frag").then(res=>res.text());

    let program = gl.addProgram(4);
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
    
    program.onDraw = ()=>{
        program.setUniform('time', Date.now() % 3000 / 3000);
    };
    
    return program;
}
