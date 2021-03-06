
import {Program} from './Program';

declare class ContextBase extends WebGLRenderingContext{}
Object.defineProperty(self, 'ContextBase', {value: Object});

export abstract class Context extends ContextBase{
    static create(canvas?: HTMLCanvasElement): Context{
        let c = canvas instanceof HTMLCanvasElement ? canvas : document.createElement('canvas');
        let ctx = c.getContext("webgl") || c.getContext('experimental-webgl') as any;
        if(!ctx) throw new Error('Not Supported WebGL.');
        ctx.programs = [];
        return ctx;
    }
    readonly programs!: Program[];

    reflesh(){
        this.clearColor(0.0, 0.0, 0.0, 1.0);
        this.enable(this.DEPTH_TEST);
        this.depthFunc(this.LEQUAL);
        this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
    }

    draw(){
        this.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.reflesh();
        this.programs.forEach(program=>program.draw());
    }
    
    addProgram(index: number|Uint8Array|Uint16Array|Uint32Array){
        let program = Program.create(this, index);
        this.programs.push(program);
        return program;
    }
    removeProgram(program: Program){
        let index = this.programs.indexOf(program);
        if(index < 0) return false;
        this.programs.splice(index, 1);
        return true;
    }
}
Object.setPrototypeOf(WebGLRenderingContext.prototype, Context.prototype);
