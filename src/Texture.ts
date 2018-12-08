import {TextureType, TextureFilter, TextureLinear} from './Enums';

export abstract class Texture implements WebGLTexture{
    static create(ctx: WebGLRenderingContext, type?: TextureType): Texture{
        let texture = ctx.createTexture() as any;
        if(!texture) throw new Error("Error Occured in Creating Texture.");
        texture.context = ctx;
        texture.type = type || TextureType["2d"];
        texture.changed = false;
        
        return texture;
    }
    readonly context!: WebGLRenderingContext;
    readonly name!: string;
    readonly type!: TextureType;
    changed!: boolean;

    load(image: HTMLImageElement) {
        this.context.bindTexture(this.type, this);
        this.context.texImage2D(this.type, 0, this.context.RGBA, this.context.RGBA, this.context.UNSIGNED_BYTE, image);
        this.context.texParameteri(this.type, TextureFilter.mag, TextureLinear.linear);
        this.context.texParameteri(this.type, TextureFilter.min, TextureLinear.linear_mipmap_nearest);
        this.context.generateMipmap(this.type);
        this.context.bindTexture(this.type, null);
        
        this.changed = true;
    }

    bind(no: number){
        if(no < 0 || no > 31) throw new Error('Invalid Texture No.');
        this.context.activeTexture(this.context.TEXTURE0 + no);
        this.context.bindTexture(this.type, this);
        this.changed = false;
    }
    
}
Object.setPrototypeOf(WebGLTexture.prototype, Texture.prototype);
