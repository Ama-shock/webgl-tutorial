import {mat4} from 'gl-matrix';
import {Context} from '../src/index';
import { TextureFilter, TextureMipmap } from '../src/Enums';

export default async function videoCube(gl: Context) {
    let vertex = await fetch("picture_cube.vert").then(res=>res.text());
    let fragment = await fetch("picture_cube.frag").then(res=>res.text());
    let video = document.createElement('video') as HTMLVideoElement;
    video.src = 'video.mp4';
    video.preload = 'auto';
    video.autoplay = true;
    video.loop = true;
    await new Promise(r=>video.onplay = r);

    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];
    let program = gl.addProgram(new Uint16Array(indices));
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
    
    const nMat = mat4.create();
    mat4.invert(nMat, mvMat);
    mat4.transpose(nMat, nMat);
    program.setUniform('uNMatrix', nMat);

    
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
    
    const vertexNormals = [
        // Front
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
        // Back
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
        // Top
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
        // Bottom
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
        // Right
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
        // Left
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ];
    program.setAttribute('aVertexNormal', new Float32Array(vertexNormals), 3);

    let textureCoordinates = [
        // 前面
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // 背面
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // 上面
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // 底面
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // 右側面
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // 左側面
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0
    ];
    program.setAttribute('aTextureCoord', new Float32Array(textureCoordinates), 2);

    let texture = program.setTexture();
    texture.filters = [TextureFilter.linear, TextureFilter.linear];
    program.setUniform('uSampler', texture);
    texture.setPlane(video);

    program.onDraw = ()=>{
        program.setUniform('time', Date.now() % 3000 / 3000);
    };
    
    return program;
}