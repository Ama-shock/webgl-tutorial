
let ctx = WebGLRenderingContext.prototype;
enum BufferType {
    'array' = ctx.ARRAY_BUFFER,
    'elementArray' = ctx.ELEMENT_ARRAY_BUFFER,
}

enum BufferParameter {
    'size' = ctx.BUFFER_SIZE,
    'usage' = ctx.BUFFER_USAGE,
}

enum BufferDrawing {
    'static' = ctx.STATIC_DRAW,
    'dynamic' = ctx.DYNAMIC_DRAW,
    'stream' = ctx.STREAM_DRAW,
}

abstract class BufferBase implements WebGLBuffer {
    static create(ctx: WebGLRenderingContext): BufferBase{
        let buffer = ctx.createBuffer() as any;
        if(!buffer) throw new Error("Error Occured in Creating Buffer.");
        buffer.context = ctx;
        return buffer;
    }
    readonly context!: WebGLRenderingContext;
    readonly type!: BufferType;
    
    get size(): number {
        return this.context.getBufferParameter(this.type, BufferParameter.size);
    }
    
    get usage(): BufferDrawing {
        return this.context.getBufferParameter(this.type, BufferParameter.usage);
    }

    private draw(array: ArrayBuffer|ArrayBufferView, draw: BufferDrawing){
        this.context.bindBuffer(this.type, this);
        this.context.bufferData(this.type, array, draw);
    }
    staticDraw(array: ArrayBuffer|ArrayBufferView){
        this.draw(array, BufferDrawing.static);
    }
    dynamicDraw(array: ArrayBuffer|ArrayBufferView){
        this.draw(array, BufferDrawing.dynamic);
    }
    streamDraw(array: ArrayBuffer|ArrayBufferView){
        this.draw(array, BufferDrawing.stream);
    }
}
Object.setPrototypeOf(WebGLBuffer.prototype, BufferBase.prototype);

export abstract class Buffer extends BufferBase {
    static create(ctx: WebGLRenderingContext): Buffer{
        let buffer = super.create(ctx) as any;
        buffer.type = BufferType.array;
        return buffer;
    }
}

export abstract class ElementBuffer extends BufferBase {
    static create(ctx: WebGLRenderingContext): Buffer{
        let buffer = super.create(ctx) as any;
        buffer.type = BufferType.elementArray;
        return buffer;
    }
}