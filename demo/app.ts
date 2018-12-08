import {Context} from '../src/index';
import rotateSquare from './rotate_square';
import rolingCube from './roling_cube';
import pictureCube from './picture_cube';

let ctx = Context.create();
Object.defineProperty(self, "GLDemos", {value: ctx});
onload = async ()=>{
    ctx.canvas.width = 640;
    ctx.canvas.height = 480;
    document.body.appendChild(ctx.canvas);

    //await rotateSquare(ctx);
    //await rolingCube(ctx);
    await pictureCube(ctx);
    
    while(true){
        ctx.draw();
        await new Promise(res=>requestAnimationFrame(res));
    }
};

