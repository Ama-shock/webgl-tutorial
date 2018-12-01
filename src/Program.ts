import {Shader} from './Shader';

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
        program._shaders = [];
        return program;
    }
    readonly context!: WebGLRenderingContext;
    private _shaders!: Shader[];

    get delete(): boolean {
        return this.context.getProgramParameter(this, ProgramParameter.deleteStatus);
    }
    get link(): boolean {
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
    
    get shaders(): ReadonlyArray<Shader>{return this._shaders;}
    async loadShader(url: string): Promise<Shader> {
        let shader = await Shader.load(url, this.context);
        this._shaders.push(shader);
        return shader;
    }

    init(){
        let gl = this.context;
        for(let shader of this._shaders) gl.attachShader(this, shader);
        gl.linkProgram(this);
        if (!this.link) throw new Error("Shader Program cannot be Linked.");
        gl.useProgram(this);
    }
    
    getAttribute(name: string): number{
        let attr = this.context.getAttribLocation(this, name);
        this.context.enableVertexAttribArray(attr);
        this.context.vertexAttribPointer(attr, 3, this.context.FLOAT, false, 0, 0);
        return attr;
    }
    getUniform(name: string, matrix: Float32List): WebGLUniformLocation|null{
        let uniform = this.context.getUniformLocation(this, name);
        this.context.uniformMatrix4fv(uniform, false, matrix);
        return uniform;
    }
}

Object.setPrototypeOf(WebGLProgram.prototype, Program.prototype);