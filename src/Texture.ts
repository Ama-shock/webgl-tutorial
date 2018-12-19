import {TextureType, TextureFilter, TextureMipmap, TextureWrap, TextureFormat, TextureColorBit} from './Enums';

type Filters = [TextureFilter|TextureMipmap, TextureFilter];
type Wraps = [TextureWrap, TextureWrap];
export type TextureParam = {
    level: number;
    format: TextureFormat;
    colorMap: TextureColorBit;
    width: number;
    height: number;
    border: number;
};

export abstract class Texture implements WebGLTexture{
    static create(ctx: WebGLRenderingContext, no: number, type: TextureType): Texture{
        if(no < 0 || no > 31) throw new Error('Invalid Texture No.');
        let texture = ctx.createTexture() as any;
        if(!texture) throw new Error("Error Occured in Creating Texture.");
        texture.context = ctx;
        texture.textureNo = no;
        texture.type = type;
        texture.changed = true;
        texture.parameter = {
            level: 0,
            format: TextureFormat.rgba,
            colorMap: TextureColorBit.byte,
            width: 1,
            height: 1,
            border: 0
        };
        texture.source = new Uint8Array([255, 255, 255, 255]);
        ctx.activeTexture(ctx.TEXTURE0 + no);
        texture.update();
        return texture;
    }
    readonly context!: WebGLRenderingContext;
    readonly textureNo!: number;
    readonly type!: TextureType;

    private changed!: boolean;

    get width(): number{
        if(!this.source) return 0;
        if(ArrayBuffer.isView(this.source)) return this.parameter.width;
        return this.source.width;
    }
    get height(): number{
        if(!this.source) return 0;
        if(ArrayBuffer.isView(this.source)) return this.parameter.height;
        return this.source.height;
    }
    get canMipmap(): boolean{
        let w = this.width;
        let h = this.height;
        return w > 1 && !(w & (w-1)) && h > 1 && !(h & (h-1));
    }

    private source!: TexImageSource|ArrayBufferView;
    private parameter!: TextureParam;
    setPlane(source: ArrayBufferView, param: Partial<TextureParam> & {width: number, height: number}): void;
    setPlane(source: TexImageSource, param?: Partial<TextureParam>): void;
    setPlane(source: TexImageSource|ArrayBufferView, param?: Partial<TextureParam>) {
        if(this.type != TextureType.plane) throw new Error('Calling setPlane of CubeTexture.');
        this.source = source;
        this.changed = true;
        if(!param) return;
        for(let k in param){
            let val = param[k as keyof TextureParam];
            if(val) this.parameter[k as keyof TextureParam] = val;
        }
        this.update();
    }

    private update(){
        this.context.bindTexture(this.type, this);
        if(this.canMipmap && this.filters[0] in TextureMipmap){
            this.context.texParameteri(this.type, this.context.TEXTURE_WRAP_S, this.wraps[0]);
            this.context.texParameteri(this.type, this.context.TEXTURE_WRAP_T, this.wraps[1]);
            this.context.texParameteri(this.type, this.context.TEXTURE_MIN_FILTER, this.filters[0]);
            this.context.texParameteri(this.type, this.context.TEXTURE_MAG_FILTER, this.filters[1]);
            this.context.generateMipmap(this.type);
        }else{
            this.context.texParameteri(this.type, this.context.TEXTURE_WRAP_S, TextureWrap.clamp);
            this.context.texParameteri(this.type, this.context.TEXTURE_WRAP_T, TextureWrap.clamp);
            let min = this.filters[0] in TextureMipmap ? TextureFilter.linear : this.filters[0];
            this.context.texParameteri(this.type, this.context.TEXTURE_MIN_FILTER, min);
            this.context.texParameteri(this.type, this.context.TEXTURE_MAG_FILTER, this.filters[1]);
        }
    }

    private _wraps?: Wraps;
    get wraps(){
        return this._wraps || [TextureWrap.clamp, TextureWrap.clamp];
    }
    set wraps(w: Wraps){
        this._wraps = w;
        this.update();
    }

    private _filters?: Filters;
    get filters(){
        return this._filters || [TextureFilter.nearest, TextureFilter.nearest];
    }
    set filters(f: Filters){
        this._filters = f;
        this.update();
    }

    draw(){
        if(this.source instanceof HTMLVideoElement) this.changed = true;
        if(!this.changed) return;
        this.changed = false;
        this.context.bindTexture(this.type, this);
        if(ArrayBuffer.isView(this.source)){
            this.context.texImage2D(
                this.type,
                this.parameter.level,
                this.parameter.format,
                this.parameter.width,
                this.parameter.height,
                this.parameter.border,
                this.parameter.format,
                this.parameter.colorMap,
                this.source);
        }else{
            this.context.texImage2D(
                this.type,
                this.parameter.level,
                this.parameter.format,
                this.parameter.format,
                this.parameter.colorMap,
                this.source);
        }
    }
    
}
Object.setPrototypeOf(WebGLTexture.prototype, Texture.prototype);
