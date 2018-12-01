
import {Shader} from './Shader';
import {Program} from './Program';
import {Buffer, ElementBuffer} from './Buffer';

declare class ContextBase extends WebGLRenderingContext{}
Object.defineProperty(self, 'ContextBase', {value: Object});

export abstract class Context extends ContextBase{
    static create(canvas?: HTMLCanvasElement): Context{
        let c = canvas instanceof HTMLCanvasElement ? canvas : document.createElement('canvas');
        let ctx = c.getContext("webgl") || c.getContext('experimental-webgl');
        if(!ctx) throw new Error('Not Supported WebGL.');
        return ctx as Context;
    }

    private _buffer?: Buffer;
    private _elementBuffer?: ElementBuffer;
    get buffer(){
        if(!this._buffer) this._buffer = Buffer.create(this);
        return this._buffer;
    }
    
    private _program?: Program;
    get program(){
        if(!this._program) this._program = Program.create(this);
        return this._program;
    }
}
Object.setPrototypeOf(WebGLRenderingContext.prototype, Context.prototype);
