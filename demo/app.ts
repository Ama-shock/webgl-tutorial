import {Context} from '../src/index';
import {mat4} from 'gl-matrix';

let list = [Context.create(), Context.create()];
Object.defineProperty(self, "GLDemos", {value: list});
onload = ()=>{
    list.forEach(ctx=>{
        ctx.canvas.width = 640;
        ctx.canvas.height = 480;
        document.body.appendChild(ctx.canvas);
    })
    rotateSquare(list[0]);
    rolingCube(list[1]);
};

async function rotateSquare(gl: Context) {
    let vertex = await fetch("rotate_square.vert").then(res=>res.text());
    let fragment = await fetch("gl.frag").then(res=>res.text());

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

    while(true){
        program.setUniform('time', Date.now() % 3000 / 3000);
        await new Promise(res=>requestAnimationFrame(res));
        gl.draw();
    }
}

async function rolingCube(gl: Context) {
    let vertex = await fetch("roling_cube.vert").then(res=>res.text());
    let fragment = await fetch("gl.frag").then(res=>res.text());

    let program = gl.addProgram(36);
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
    program.setUniform('uPMatrix', pMat);
    
    const mvMat = mat4.create();
    mat4.translate(mvMat, mvMat, [0.0, 0.0, -6.0]);
    program.setUniform('uMVMatrix', mvMat);
    
    let vertices = [
        // 前面
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        
        // 背面
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,
        
        // 上面
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,
        
        // 底面
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
        
        // 右側面
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
        
        // 左側面
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ];
    program.setAttribute('aVertexPosition', new Float32Array(vertices), 3);
    
    let rawColors = [
        [1.0,  1.0,  1.0,  1.0],    // 前面: 白
        [1.0,  0.0,  0.0,  1.0],    // 背面: 赤
        [0.0,  1.0,  0.0,  1.0],    // 上面: 緑
        [0.0,  0.0,  1.0,  1.0],    // 底面: 青
        [1.0,  1.0,  0.0,  1.0],    // 右側面: 黄
        [1.0,  0.0,  1.0,  1.0]     // 左側面: 紫
    ];
    let colors: number[] = [];
    for(let c of rawColors){
        colors = colors.concat(c, c, c, c);
    }
    program.setAttribute('aVertexColor', new Float32Array(colors), 4);

    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];
    program.setElement(new Uint16Array(indices));

    while(true){
        program.setUniform('time', Date.now() % 3000 / 3000);
        await new Promise(res=>requestAnimationFrame(res));
        gl.draw();
    }
}