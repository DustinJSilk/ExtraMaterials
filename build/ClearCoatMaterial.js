/*!
 * @author yomotsu / http://yomotsu.net/
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ClearCoatMaterial = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extendPhong = require('./extendPhong.js');

var _extendPhong2 = _interopRequireDefault(_extendPhong);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var additionalChank = {

  unifroms: {
    // viewVector:
    envMap2: { type: "t", value: null }
  },

  vsHeader: [
  // 'varying vec3 debug;',
  'uniform float refractiveRatio;', 'varying vec3  vFrasnelReflect;', 'varying float vFrasnelAlpha;'].join('\n'),

  // http://marupeke296.com/DXPS_PS_No7_FresnelReflection.html
  vsAfter: ['vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );', 'vec3 viewVec = worldPosition.xyz - cameraPosition;', 'float A = refractiveRatio;', 'float B = dot( - normalize( viewVec ), normalize( worldNormal ) );', 'float C = sqrt( 1.0 - A * A * ( 1.0 - B * B ) );', 'float Rs = ( A * B - C ) * ( A * B - C ) / ( ( A * B + C ) * ( A * B + C ) );', 'float Rp = ( A * C - B ) * ( A * C - B ) / ( ( A * C + B ) * ( A * C + B ) );', 'vFrasnelAlpha = ( Rs + Rp ) * 0.5;', 'vFrasnelReflect = reflect( normalize( viewVec ), worldNormal );'

  // ,'debug = vec3(1,1,1);'
  ].join('\n'),

  fsHeader: [
  // 'varying vec3 debug;',
  'uniform samplerCube envMap2;', 'varying vec3  vFrasnelReflect;', 'varying float vFrasnelAlpha;'].join('\n'),

  fsAfter: ['vec4 frasnelEnvColor = textureCube( envMap2, vFrasnelReflect );',
  // 'vec3 frasnelRefColor = frasnelEnvColor.xyz * vec3( vFrasnelAlpha );',
  'vec3 frasnelRefColor = irradiance * frasnelEnvColor.xyz * vec3( vFrasnelAlpha );', 'vec3 outgoingLight2 = gl_FragColor.xyz * vec3( 1.0 - vFrasnelAlpha ) + frasnelRefColor;', '#ifdef USE_FOG', 'outgoingLight2 = mix( outgoingLight2, fogColor, fogFactor );', '#endif', 'gl_FragColor = vec4( outgoingLight2, diffuseColor.a );'].join('\n')

}; /*!
    * @author yomotsu / http://yomotsu.net/
    */

var ClearCoatMaterial = function ClearCoatMaterial(parameters) {

  var shaderParams = (0, _extendPhong2.default)(additionalChank, parameters);

  // console.log( shaderParams.uniforms );
  // console.log( shaderParams.vertexShader );
  // console.log( shaderParams.fragmentShader );

  shaderParams.uniforms.refractiveRatio = {
    type: 'f',
    value: parameters && parameters.refractiveRatio || 0.6
  };
  shaderParams.uniforms.envMap2.value = textureCube;

  THREE.ShaderMaterial.call(this, shaderParams);

  this.fog = true;
  this.lights = true;
  this.side = THREE.DoubleSide;
};

ClearCoatMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);

exports.default = ClearCoatMaterial;
module.exports = exports['default'];

},{"./extendPhong.js":2}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (additionalChank, parameters) {

  var uniforms = THREE.UniformsUtils.merge([THREE.ShaderLib.phong.uniforms, additionalChank.unifroms || '']);

  var vertexShader = ["#define PHONG", "varying vec3 vViewPosition;", "#ifndef FLAT_SHADED", " varying vec3 vNormal;", "#endif", THREE.ShaderChunk["common"], THREE.ShaderChunk["uv_pars_vertex"], THREE.ShaderChunk["uv2_pars_vertex"], THREE.ShaderChunk["displacementmap_pars_vertex"], THREE.ShaderChunk["envmap_pars_vertex"], THREE.ShaderChunk["lights_phong_pars_vertex"], THREE.ShaderChunk["color_pars_vertex"], THREE.ShaderChunk["morphtarget_pars_vertex"], THREE.ShaderChunk["skinning_pars_vertex"], THREE.ShaderChunk["shadowmap_pars_vertex"], THREE.ShaderChunk["logdepthbuf_pars_vertex"], additionalChank.vsHeader || '', "void main() {", THREE.ShaderChunk["uv_vertex"], THREE.ShaderChunk["uv2_vertex"], THREE.ShaderChunk["color_vertex"], THREE.ShaderChunk["beginnormal_vertex"], THREE.ShaderChunk["morphnormal_vertex"], THREE.ShaderChunk["skinbase_vertex"], THREE.ShaderChunk["skinnormal_vertex"], THREE.ShaderChunk["defaultnormal_vertex"], "#ifndef FLAT_SHADED", // Normal computed with derivatives when FLAT_SHADED

  " vNormal = normalize( transformedNormal );", "#endif", THREE.ShaderChunk["begin_vertex"], THREE.ShaderChunk["displacementmap_vertex"], THREE.ShaderChunk["morphtarget_vertex"], THREE.ShaderChunk["skinning_vertex"], THREE.ShaderChunk["project_vertex"], THREE.ShaderChunk["logdepthbuf_vertex"], " vViewPosition = - mvPosition.xyz;", THREE.ShaderChunk["worldpos_vertex"], THREE.ShaderChunk["envmap_vertex"], THREE.ShaderChunk["lights_phong_vertex"], THREE.ShaderChunk["shadowmap_vertex"], additionalChank.vsAfter || '', "}"].join("\n");

  var fragmentShader = ["#define PHONG", "uniform vec3 diffuse;", "uniform vec3 emissive;", "uniform vec3 specular;", "uniform float shininess;", "uniform float opacity;", THREE.ShaderChunk["common"], THREE.ShaderChunk["color_pars_fragment"], THREE.ShaderChunk["uv_pars_fragment"], THREE.ShaderChunk["uv2_pars_fragment"], THREE.ShaderChunk["map_pars_fragment"], THREE.ShaderChunk["alphamap_pars_fragment"], THREE.ShaderChunk["aomap_pars_fragment"], THREE.ShaderChunk["lightmap_pars_fragment"], THREE.ShaderChunk["emissivemap_pars_fragment"], THREE.ShaderChunk["envmap_pars_fragment"], THREE.ShaderChunk["fog_pars_fragment"], THREE.ShaderChunk["bsdfs"], THREE.ShaderChunk["ambient_pars"], THREE.ShaderChunk["lights_pars"], THREE.ShaderChunk["lights_phong_pars_fragment"], THREE.ShaderChunk["shadowmap_pars_fragment"], THREE.ShaderChunk["bumpmap_pars_fragment"], THREE.ShaderChunk["normalmap_pars_fragment"], THREE.ShaderChunk["specularmap_pars_fragment"], THREE.ShaderChunk["logdepthbuf_pars_fragment"], additionalChank.fsHeader || '', "void main() {", " vec4 diffuseColor = vec4( diffuse, opacity );", " ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );", " vec3 totalEmissiveLight = emissive;", THREE.ShaderChunk["logdepthbuf_fragment"], THREE.ShaderChunk["map_fragment"], THREE.ShaderChunk["color_fragment"], THREE.ShaderChunk["alphamap_fragment"], THREE.ShaderChunk["alphatest_fragment"], THREE.ShaderChunk["specularmap_fragment"], THREE.ShaderChunk["normal_fragment"], THREE.ShaderChunk["emissivemap_fragment"],

  // accumulation
  THREE.ShaderChunk["lights_phong_fragment"], THREE.ShaderChunk["lights_template"],

  // modulation
  THREE.ShaderChunk["aomap_fragment"], "vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveLight;", THREE.ShaderChunk["envmap_fragment"], THREE.ShaderChunk["linear_to_gamma_fragment"], THREE.ShaderChunk["fog_fragment"], " gl_FragColor = vec4( outgoingLight, diffuseColor.a );", additionalChank.fsAfter || '', "}"].join("\n");

  var shaderParams = {
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: THREE.UniformsUtils.clone(uniforms),
    defines: {},
    extensions: {}
  };

  if (parameters) {

    if (parameters.color) {

      shaderParams.uniforms.diffuse.value.setHex(parameters.color);
    }

    if (parameters.map) {

      shaderParams.uniforms.map.value = parameters.map;
      shaderParams.defines.USE_MAP = '';
      shaderParams.uniforms.offsetRepeat.value.setZ(parameters.map.repeat.x);
      shaderParams.uniforms.offsetRepeat.value.setW(parameters.map.repeat.y);
    }

    if (parameters.normalMap) {

      shaderParams.uniforms.normalMap.value = parameters.normalMap;
      shaderParams.defines.USE_NORMALMAP = '';
      shaderParams.extensions.derivatives = true;
      shaderParams.uniforms.offsetRepeat.value.setZ(parameters.normalMap.repeat.x);
      shaderParams.uniforms.offsetRepeat.value.setW(parameters.normalMap.repeat.y);
    }

    if (parameters.normalScale) {

      shaderParams.uniforms.normalScale.value.copy(parameters.normalScale);
    }
  }

  return shaderParams;
};

;
module.exports = exports['default'];

},{}]},{},[1])(1)
});