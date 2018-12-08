
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uNMatrix;
uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform float time;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

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
  mat3 dir = rotateX(rX) * rotateY(rY) * rotateZ(rZ);
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition * dir, 1.0);
  vTextureCoord = aTextureCoord;

  highp vec3 ambientLight = vec3(0.2, 0.2, 0.2);
  highp vec3 directionalLightColor = vec3(1, 1, 1);
  highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
  highp vec4 transformedNormal = uNMatrix * vec4(aVertexNormal * dir, 1.0);
  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  vLighting = ambientLight + (directionalLightColor * directional);
}
