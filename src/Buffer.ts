
let ctx = WebGLRenderingContext.prototype;
enum BufferType {
    'array' = ctx.ARRAY_BUFFER,
    'elementArray' = ctx.ELEMENT_ARRAY_BUFFER,
}

enum DataType {
    'float' = ctx.FLOAT,
    'int' = ctx.INT,
}

const DataTypeTable:  {[className: string]: DataType} = {
    Uint8ClampedArray: DataType.int,
    Uint8Array: DataType.int,
    Uint16Array: DataType.int,
    Uint32Array: DataType.int,
    Int8Array: DataType.int,
    Int16Array: DataType.int,
    Int32Array: DataType.int,
    Float32Array: DataType.float,
    Float64Array: DataType.float,
    DataView: DataType.float,
    ArrayBuffer: DataType.float,
    Array: DataType.float
};

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
        this.bind();
        return this.context.getBufferParameter(this.bufferType, BufferParameter.size);
    }
    
    get usage(): BufferUsage {
        this.bind();
        return this.context.getBufferParameter(this.bufferType, BufferParameter.usage);
    }

    bind(){
        this.context.bindBuffer(this.bufferType, this);
    }

    private _dimension: number = 0;
    private _dataType: DataType = 0;
    private _length: number = 0;
    get length(){return this._length;}

    get dimension(): number{return this._dimension || 0;}
    get dataType(): DataType{return this._dataType || 0;}
    private setData(
        usage: BufferUsage,
        array: ArrayBuffer|ArrayBufferView,
        dimension: number,
        dataType?: typeof Object
    ){
        this.bind();
        this.context.bufferData(this.bufferType, array, usage);
        this._dimension = dimension;
        this._dataType = DataTypeTable[(dataType || array.constructor).name];
        this._length = array.byteLength;
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