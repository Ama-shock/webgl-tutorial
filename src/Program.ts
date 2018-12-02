import {VertexShader, FragmentShader} from './Shader';
import {Buffer, ElementBuffer} from './Buffer';

let ctx = WebGLRenderingContext.prototype;
enum ProgramParameter {
    'deleteStatus' = ctx.DELETE_STATUS,
    'linkStatus' = ctx.LINK_STATUS,
    'validateStatus' = ctx.VALIDATE_STATUS,
    'attachedShaders' = ctx.ATTACHED_SHADERS,
    'activeAttributes' = ctx.ACTIVE_ATTRIBUTES,
    'activeUniform' = ctx.ACTIVE_UNIFORMS,
}

export abstract class Program implements WebGLProgram {
    static create(ctx: WebGLRenderingContext): Program{
        let program = ctx.createProgram() as any;
        if(!program) throw new Error("Error Occured in Creating Program.");
        program.context = ctx;
        program.element = ElementBuffer.create(ctx);
        program.shaders = [];
        program.attributes = [];
        program.uniforms = [];
        return program;
    }
    readonly context!: WebGLRenderingContext;
    readonly element!: ElementBuffer;
    readonly shaders!: (VertexShader|FragmentShader)[];
    readonly attributes!: Attribute[];
    readonly uniforms!: Uniform[];

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

    draw(){
        for(let attribute of this.attributes) attribute.draw();
        this.context.useProgram(this);
        for(let uniform of this.uniforms) uniform.draw();
        
        this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, 4);
        //this.context.drawElements(this.context.TRIANGLES, 3, this.context.UNSIGNED_SHORT, 0);
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

    setUniform(name: string, value: number|Float32List) {
        if(!this.linked) this.link();
        let unif = this.uniforms.find(u=>u.name == name);
        if(!unif){
            unif = new Uniform(this, name);
            this.uniforms.push(unif);
        }
        unif.value = value;
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
    
    private _value?: number|Float32List;
    private changed: boolean = false;
    get value(): number|Float32List{return this._value || 0;}
    set value(v: number|Float32List){
        this.changed = true;
        this._value = v;
    }
    
    draw(){
        if(!this.changed) return;
        this.changed = false;
        this.sendData(this.value);
    }

    private sendData(v: number|Float32List){
        if([Array, Float32Array, Float64Array].find(c=>v instanceof c)){
            let value = v as number[];
            switch(value.length){
                case 1:
                this.context.uniform1fv(this.location, value);
                return;

                case 2:
                this.context.uniform2fv(this.location, value);
                return;
                
                case 3:
                this.context.uniform3fv(this.location, value);
                return;
                
                case 4:
                this.context.uniformMatrix2fv(this.location, false, value);
                return;
                
                case 9:
                this.context.uniformMatrix3fv(this.location, false, value);
                return;
                
                case 16:
                this.context.uniformMatrix4fv(this.location, false, value);
                return;
                
                default:
                this.context.uniform1fv(this.location, value);
                return;
            }
        }
        
        this.context.uniform1f(this.location, v as number);
    }
}