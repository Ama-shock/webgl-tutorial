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

abstract class Shader implements WebGLShader{
    static create(ctx: WebGLRenderingContext, src?: string, type?: ShaderType): Shader{
        let shader = ctx.createShader(type!) as any;
        if(!shader) throw new Error("Error Occured in Creating Shader.");
        shader.context = ctx;
        src && shader.compile(src);
        return shader;
    }
    readonly context!: WebGLRenderingContext;

    get type(): ShaderType {
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

    compile(src: string){
        this.context.shaderSource(this, src);
        this.context.compileShader(this);
        if(!this.complete) throw new Error("Error Occured in Compiling Shader.");
    }
    
}
Object.setPrototypeOf(WebGLShader.prototype, Shader.prototype);

export abstract class VertexShader extends Shader {
    static create(ctx: WebGLRenderingContext, src?: string): VertexShader{
        return super.create(ctx, src, ShaderType.vertex);
    }
}

export abstract class FragmentShader extends Shader {
    static create(ctx: WebGLRenderingContext, src?: string): FragmentShader{
        return super.create(ctx, src, ShaderType.fragment);
    }
}
