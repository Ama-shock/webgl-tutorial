import {ProgramParameter, TextureType} from './Enums';
import {VertexShader, FragmentShader} from './Shader';
import {Buffer, ElementBuffer} from './Buffer';
import {Texture, TextureParam} from './Texture';

export abstract class Program implements WebGLProgram {
    static create(ctx: WebGLRenderingContext, index: number|Uint8Array|Uint16Array|Uint32Array): Program{
        let program = ctx.createProgram() as any;
        if(!program) throw new Error("Error Occured in Creating Program.");
        program.context = ctx;
        program.shaders = [];
        program.attributes = [];
        program.uniforms = [];
        program.textures = [];
        if(typeof index == 'number'){
            program.indexLength = index;
        }else{
            program.indexLength = index.length;
            program.indexBuffer = ElementBuffer.create(ctx);
            program.indexBuffer.setStatic(index, 0);
        }
        return program;
    }
    readonly context!: WebGLRenderingContext;
    readonly shaders!: (VertexShader|FragmentShader)[];
    readonly attributes!: Attribute[];
    readonly uniforms!: Uniform[];
    readonly textures!: Texture[];
    private indexLength!: number;
    private indexBuffer?: ElementBuffer;

    get deleted(): boolean {
        return this.context.getProgramParameter(this, ProgramParameter.deleteStatus);
    }
    get linked(): boolean {
        return this.context.getProgramParameter(this, ProgramParameter.linkStatus);
    }
    get validate(): boolean {
        return this.context.getProgramParameter(this, ProgramParameter.validateStatus);
    }
    get attachedShaders(): number {
        return this.context.getProgramParameter(this, ProgramParameter.attachedShaders);
    }
    get activeAttributes(): number {
        return this.context.getProgramParameter(this, ProgramParameter.activeAttributes);
    }
    get activeUniform(): number {
        return this.context.getProgramParameter(this, ProgramParameter.activeUniform);
    }

    link(){
        this.shaders.forEach(shader=>this.context.attachShader(this, shader));
        this.context.linkProgram(this);
        if (!this.linked) throw new Error("Shader Program cannot be Linked.");
    }

    onDraw?: (program: Program)=>void;
    draw(){
        this.onDraw && this.onDraw(this);
        for(let attribute of this.attributes) attribute.draw();
        this.context.useProgram(this);
        for(let uniform of this.uniforms) uniform.draw();

        if(!this.indexBuffer){
            this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, this.indexLength);
            return;
        }

        this.context.drawElements(
            this.context.TRIANGLES,
            this.indexLength,
            this.context.UNSIGNED_SHORT,
            0
        );
    }
    
    addVertexShader(src: string){
        let shader = VertexShader.create(this.context, src);
        this.shaders.push(shader);
    }

    addFragmentShader(src: string){
        let shader = FragmentShader.create(this.context, src);
        this.shaders.push(shader);
    }

    setAttribute(name: string, array: ArrayBuffer|ArrayBufferView, dimension: number){
        if(!this.linked) this.link();
        let attr = this.attributes.find(a=>a.name == name);
        if(!attr){
            attr = new Attribute(this, name);
            this.attributes.push(attr);
        }
        attr.buffer.setStatic(array, dimension);
    }

    setUniform(name: string, value: number|Float32List|Texture) {
        if(!this.linked) this.link();
        let unif = this.uniforms.find(u=>u.name == name);
        if(!unif){
            unif = new Uniform(this, name);
            this.uniforms.push(unif);
        }
        unif.value = value;
    }

    setTexture(){
        let texture = Texture.create(this.context, this.textures.length, TextureType.plane);
        this.textures.push(texture);
        return texture;
    }
}

Object.setPrototypeOf(WebGLProgram.prototype, Program.prototype);


export class Attribute {
    readonly context: WebGLRenderingContext;
    readonly location: number;
    readonly buffer: Buffer;
    constructor(
        program: Program,
        readonly name: string
    ){
        this.context = program.context;
        this.buffer = Buffer.create(this.context);
        this.location = this.context.getAttribLocation(program, name);
    }

    draw(){
        this.buffer.bind();
        this.context.vertexAttribPointer(this.location, this.buffer.dimension, this.buffer.dataType, false, 0, 0);
        this.context.enableVertexAttribArray(this.location);
    }
}


export class Uniform {
    readonly context: WebGLRenderingContext;
    readonly location: WebGLUniformLocation;
    constructor(
        program: Program,
        readonly name: string
    ){
        this.context = program.context;
        let location = this.context.getUniformLocation(program, name);
        if(!location) throw new Error('Not found Uniform location. > '+ name);
        this.location = location;
    }
    
    private _value?: number|Float32List|Texture;
    private changed: boolean = false;
    get value(): number|Float32List|Texture{return this._value || 0;}
    set value(v: number|Float32List|Texture){
        this.changed = true;
        this._value = v;
    }
    
    draw(){
        if(this.value instanceof WebGLTexture){
            (this.value as Texture).draw();
            this.changed = false;
            return;
        }
        if(!this.changed) return;
        this.changed = false;
        this.sendData(this.value as any);
    }

    private sendData(v: number|Float32List){
        let ctx = this.context;
        if([Array, Float32Array, Float64Array].find(c=>v instanceof c)){
            let value = v as number[];
            switch(value.length){
                case 1:
                ctx.uniform1fv(this.location, value);
                return;

                case 2:
                ctx.uniform2fv(this.location, value);
                return;
                
                case 3:
                ctx.uniform3fv(this.location, value);
                return;
                
                case 4:
                ctx.uniformMatrix2fv(this.location, false, value);
                return;
                
                case 9:
                ctx.uniformMatrix3fv(this.location, false, value);
                return;
                
                case 16:
                ctx.uniformMatrix4fv(this.location, false, value);
                return;
                
                default:
                ctx.uniform1fv(this.location, value);
                return;
            }
        }
        
        ctx.uniform1f(this.location, v as number);
    }
}