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
    '2d' = ctx.TEXTURE_2D,
}

export enum TextureFilter {
    'min' = ctx.TEXTURE_MIN_FILTER,
    'mag' = ctx.TEXTURE_MAG_FILTER,
}

export enum TextureLinear {
    'linear' = ctx.LINEAR,
    'linear_mipmap_linear' = ctx.LINEAR_MIPMAP_LINEAR,
    'linear_mipmap_nearest' = ctx.LINEAR_MIPMAP_NEAREST,
    'nearest' = ctx.NEAREST,
    'nearest_mipmap_linear' = ctx.NEAREST_MIPMAP_LINEAR,
    'nearest_mipmap_nearest' = ctx.NEAREST_MIPMAP_NEAREST,
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
