/*!
 * @author yomotsu / http://yomotsu.net/
 */

import extendPhong from './extendPhong.js';

var additionalChank = {

  unifroms: {
    // viewVector: 
    envMap2: { type: "t", value: null }
  },

  vsHeader: [
    // 'varying vec3 debug;',
    'uniform float refractiveRatio;',
    'varying vec3  vFrasnelReflect;',
    'varying float vFrasnelAlpha;'
  ].join( '\n' ),

  // http://marupeke296.com/DXPS_PS_No7_FresnelReflection.html
  vsAfter: [
    'vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );',
    'vec3 viewVec = worldPosition.xyz - cameraPosition;',

    'float A = refractiveRatio;',
    'float B = dot( - normalize( viewVec ), normalize( worldNormal ) );',
    'float C = sqrt( 1.0 - A * A * ( 1.0 - B * B ) );',
    'float Rs = ( A * B - C ) * ( A * B - C ) / ( ( A * B + C ) * ( A * B + C ) );',
    'float Rp = ( A * C - B ) * ( A * C - B ) / ( ( A * C + B ) * ( A * C + B ) );',
    'vFrasnelAlpha = ( Rs + Rp ) * 0.5;',
    'vFrasnelReflect = reflect( normalize( viewVec ), worldNormal );'

    // ,'debug = vec3(1,1,1);'
  ].join( '\n' ),

  fsHeader: [
    // 'varying vec3 debug;',
    'uniform samplerCube envMap2;',
    'varying vec3  vFrasnelReflect;',
    'varying float vFrasnelAlpha;'
  ].join( '\n' ),

  fsAfter: [
    'vec4 frasnelEnvColor = textureCube( envMap2, vFrasnelReflect );',
    // 'vec3 frasnelRefColor = frasnelEnvColor.xyz * vec3( vFrasnelAlpha );',
    'vec3 frasnelRefColor = irradiance * frasnelEnvColor.xyz * vec3( vFrasnelAlpha );',

    'vec3 outgoingLight2 = gl_FragColor.xyz * vec3( 1.0 - vFrasnelAlpha ) + frasnelRefColor;',

    '#ifdef USE_FOG',
      'outgoingLight2 = mix( outgoingLight2, fogColor, fogFactor );',
    '#endif',

    'gl_FragColor = vec4( outgoingLight2, diffuseColor.a );'
  ].join( '\n' ),

};

var ClearCoatMaterial = function ( parameters ) {

  var shaderParams = extendPhong( additionalChank, parameters );

  // console.log( shaderParams.uniforms );
  // console.log( shaderParams.vertexShader );
  console.log( shaderParams.fragmentShader );
  shaderParams.uniforms.refractiveRatio = {
    type: 'f',
    value: parameters && parameters.refractiveRatio || 0.6
  }
  shaderParams.uniforms.envMap2.value = textureCube;

  THREE.ShaderMaterial.call( this, shaderParams );

  this.fog    = true;
  this.lights = true;
  this.side   = THREE.DoubleSide;

}

ClearCoatMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );

export default ClearCoatMaterial;
