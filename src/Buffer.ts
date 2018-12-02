
let ctx = WebGLRenderingContext.prototype;
enum BufferType {
    'array' = ctx.ARRAY_BUFFER,
    'elementArray' = ctx.ELEMENT_ARRAY_BUFFER,
}

enum DataType {
    'float' = ctx.FLOAT,
}

enum BufferParameter {
    'size' = ctx.BUFFER_SIZE,
    'usage' = ctx.BUFFER_USAGE,
}

enum BufferUsage {
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
    readonly bufferType!: BufferType;
    
    get size(): number {
        return this.context.getBufferParameter(this.bufferType, BufferParameter.size);
    }
    
    get usage(): BufferUsage {
        return this.context.getBufferParameter(this.bufferType, BufferParameter.usage);
    }

    bind(){
        this.context.bindBuffer(this.bufferType, this);
    }

    private _dimension: number = 0;
    private _dateType: DataType = 0;
    get dimension(): number{return this._dimension || 0;}
    get dataType(): DataType{return this._dateType || 0;}
    private setData(usage: BufferUsage, array: ArrayBuffer|ArrayBufferView, dimension: number){
        this.bind();
        this.context.bufferData(this.bufferType, array, usage);
        this._dimension = dimension;
        this._dateType = DataType.float;
    }
    
    setStatic(array: ArrayBuffer|ArrayBufferView, dimension: number){
        this.setData(BufferUsage.static, array, dimension);
    }
    setDynamic(array: ArrayBuffer|ArrayBufferView, dimension: number){
        this.setData(BufferUsage.dynamic, array, dimension);
    }
    setStream(array: ArrayBuffer|ArrayBufferView, dimension: number){
        this.setData(BufferUsage.stream, array, dimension);
    }
}
Object.setPrototypeOf(WebGLBuffer.prototype, BufferBase.prototype);

export abstract class Buffer extends BufferBase {
    static create(ctx: WebGLRenderingContext): Buffer{
        let buffer = super.create(ctx) as any;
        buffer.bufferType = BufferType.array;
        return buffer;
    }
}

export abstract class ElementBuffer extends BufferBase {
    static create(ctx: WebGLRenderingContext): Buffer{
        let buffer = super.create(ctx) as any;
        buffer.bufferType = BufferType.elementArray;
        return buffer;
    }
}