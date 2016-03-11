/*!
 * @author yomotsu / http://yomotsu.net/
 */

import extendPhong from './extendPhong.js';

var additionalChank = {

  unifroms: {},

  vsHeader: [
    'varying float vAlpha;'
  ].join( '\n' ),

  vsAfter: [
    'vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );',
    'vec3 viewVec = worldPosition.xyz - cameraPosition;',

    'float B = dot( - normalize( viewVec ), normalize( worldNormal ) );',
    'vAlpha = pow( 1. - B, 3.0 ) + 0.1;'
  ].join( '\n' ),

  fsHeader: [
    'varying float vAlpha;'
  ].join( '\n' ),

  fsAfter: [
    'gl_FragColor.w = vAlpha;'
  ].join( '\n' )

};

var ClearCoatMaterial = function ( parameters ) {

  var shaderParams = extendPhong( additionalChank, parameters );

  // console.log( shaderParams.uniforms );
  // console.log( shaderParams.vertexShader );
  // console.log( shaderParams.fragmentShader );

  THREE.ShaderMaterial.call( this, shaderParams );

  this.fog         = true;
  this.lights      = true;
  this.transparent = true;
  this.blending    = THREE.AdditiveBlending;

}

ClearCoatMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );

export default ClearCoatMaterial;
