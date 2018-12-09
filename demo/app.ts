import {Context, Program} from '../src/index';
import rotateSquare from './rotate_square';
import rolingCube from './roling_cube';
import pictureCube from './picture_cube';

const functions = [
    rotateSquare,
    rolingCube,
    pictureCube
];

onload = async ()=>{
    let canvas = document.querySelector('canvas')!;
    canvas.width = 640;
    canvas.height = 480;
    let ctx = Context.create(canvas);
    Object.defineProperty(self, "GLDemos", {value: ctx});

    let current: Program|null = null;
    let inputs = Array.from(document.querySelectorAll('input'));
    inputs.forEach(el=>el.onchange = async ev=>{
        if(current) ctx.removeProgram(current);
        current = await functions[inputs.indexOf(el)](ctx);
    });
    
    while(true){
        ctx.draw();
        await new Promise(res=>requestAnimationFrame(res));
    }
};

