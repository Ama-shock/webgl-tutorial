let ctx = WebGLRenderingContext.prototype;

export enum ProgramParameter {
    'deleteStatus' = ctx.DELETE_STATUS,
    'linkStatus' = ctx.LINK_STATUS,
    'validateStatus' = ctx.VALIDATE_STATUS,
    'attachedShaders' = ctx.ATTACHED_SHADERS,
    'activeAttributes' = ctx.ACTIVE_ATTRIBUTES,
    'activeUniform' = ctx.ACTIVE_UNIFORMS,
}

export enum TextureType {
    'plane' = ctx.TEXTURE_2D,
    'cubeMap' = ctx.TEXTURE_CUBE_MAP
}
export enum TextureBind {
    'plane' = ctx.TEXTURE_BINDING_2D,
    'cubeMap' = ctx.TEXTURE_BINDING_CUBE_MAP
}
export enum TextureCubeTarget {
    'cubeNX' = ctx.TEXTURE_CUBE_MAP_NEGATIVE_X,
    'cubePX' = ctx.TEXTURE_CUBE_MAP_POSITIVE_X,
    'cubeNY' = ctx.TEXTURE_CUBE_MAP_NEGATIVE_Y,
    'cubePY' = ctx.TEXTURE_CUBE_MAP_POSITIVE_Y,
    'cubeNZ' = ctx.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    'cubePZ' = ctx.TEXTURE_CUBE_MAP_POSITIVE_Z,
}
export enum TextureFormat {
    'alpha' = ctx.ALPHA,
    'rgb' = ctx.RGB,
    'rgba' = ctx.RGBA,
    'luminance' = ctx.LUMINANCE,
    'luminanceAlpha' = ctx.LUMINANCE_ALPHA
}
export enum TextureColorBit {
    'byte' = ctx.UNSIGNED_BYTE,
    'r5g6b5' = ctx.UNSIGNED_SHORT_5_6_5,
    'r4g4b4a4' = ctx.UNSIGNED_SHORT_4_4_4_4,
    'r5g5b5a1' = ctx.UNSIGNED_SHORT_5_5_5_1,
}

export enum TextureFilter {
    'nearest' = ctx.NEAREST,
    'linear' = ctx.LINEAR,
}
export enum TextureMipmap {
    'nearest_nearest' = ctx.NEAREST_MIPMAP_NEAREST,
    'nearest_linear' = ctx.NEAREST_MIPMAP_LINEAR,
    'linear_nearest' = ctx.LINEAR_MIPMAP_NEAREST,
    'linear_linear' = ctx.LINEAR_MIPMAP_LINEAR,
}
export enum TextureWrap {
    'repeat' = ctx.REPEAT,
    'mirrored' = ctx.MIRRORED_REPEAT,
    'clamp' = ctx.CLAMP_TO_EDGE
}

export enum ShaderParameter {
    'shaderType' = ctx.SHADER_TYPE,
    'complete' = ctx.COMPILE_STATUS,
    'delete' = ctx.DELETE_STATUS
}

export enum ShaderType {
    'fragment' = ctx.FRAGMENT_SHADER,
    'vertex' = ctx.VERTEX_SHADER
}

export enum DataType {
    'float' = ctx.FLOAT,
    'int' = ctx.INT,
}

export enum BufferType {
    'array' = ctx.ARRAY_BUFFER,
    'elementArray' = ctx.ELEMENT_ARRAY_BUFFER,
}

export enum BufferParameter {
    'size' = ctx.BUFFER_SIZE,
    'usage' = ctx.BUFFER_USAGE,
}

export enum BufferUsage {
    'static' = ctx.STATIC_DRAW,
    'dynamic' = ctx.DYNAMIC_DRAW,
    'stream' = ctx.STREAM_DRAW,
}
