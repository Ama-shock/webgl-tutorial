let ctx = WebGLRenderingContext.prototype;
enum ShaderParameter {
    'shaderType' = ctx.SHADER_TYPE,
    'complete' = ctx.COMPILE_STATUS,
    'delete' = ctx.DELETE_STATUS
}
enum ShaderType {
    'fragment' = ctx.FRAGMENT_SHADER,
    'vertex' = ctx.VERTEX_SHADER
}

const ShaderExtension = {
    frag: ctx.FRAGMENT_SHADER,
    fs: ctx.FRAGMENT_SHADER,
    vert: ctx.VERTEX_SHADER,
    vs: ctx.VERTEX_SHADER,
} as {[ext: string]: number};

export abstract class Shader implements WebGLShader{
    static create(type: ShaderType, ctx: WebGLRenderingContext): Shader{
        let shader = ctx.createShader(type) as any;
        if(!shader) throw new Error("Error Occured in Creating Shader.");
        shader.context = ctx;
        return shader;
    }
    readonly context!: WebGLRenderingContext;

    get shaderType(): ShaderType {
        return this.context.getShaderParameter(this, ShaderParameter.shaderType);
    }
    get complete(): boolean {
        return this.context.getShaderParameter(this, ShaderParameter.complete);
    }
    get delete(): boolean {
        return this.context.getShaderParameter(this, ShaderParameter.delete);
    }
    get info(): string|null {
        return this.context.getShaderInfoLog(this);
    }

    static async load(url: string, ctx: WebGLRenderingContext): Promise<Shader>{
        let res = await fetch(url);
        let src = await res.text();
        let ext = url.substr(url.lastIndexOf('.') +1);
        let shader = this.create(ShaderExtension[ext], ctx);
        shader.compile(src);
        return shader;
    }

    compile(src: string){
        this.context.shaderSource(this, src);
        this.context.compileShader(this);
        if(!this.complete) throw new Error("Error Occured in Compiling Shader.");
    }
    
}

Object.setPrototypeOf(WebGLShader.prototype, Shader.prototype);
