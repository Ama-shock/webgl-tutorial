
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform float time;

varying highp vec2 vTextureCoord;

const float PI = 3.14159265359;
mat3 rotateX(float _angle){
    return mat3(
        1.0, 0.0, 0.0,
        0.0, cos(_angle), -sin(_angle),
        0.0, sin(_angle), cos(_angle)
    );
}
mat3 rotateY(float _angle){
    return mat3(
        cos(_angle), 0.0, sin(_angle),
        0.0, 1.0, 0.0,
        -sin(_angle), 0.0, cos(_angle)
    );
}
mat3 rotateZ(float _angle){
    return mat3(
        cos(_angle), -sin(_angle), 0.0,
        sin(_angle), cos(_angle), 0.0,
        0.0, 0.0, 1.0
    );
}

void main(void) {
  float rX = time * PI * 2.0;
  float rY = time * PI * 2.0;
  float rZ = time * PI * 2.0;
  vec3 pos = rotateX(rX) * rotateY(rY) * rotateZ(rZ) * aVertexPosition;
  gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
  vTextureCoord = aTextureCoord;
}
