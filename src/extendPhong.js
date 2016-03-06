export default function ( additionalChank, parameters ) {

  var uniforms = THREE.UniformsUtils.merge( [

    THREE.ShaderLib.phong.uniforms,
    ( additionalChank.unifroms || '' ),

  ] );

  var vertexShader = [

    "#define PHONG",

    "varying vec3 vViewPosition;",

    "#ifndef FLAT_SHADED",

    " varying vec3 vNormal;",

    "#endif",

    THREE.ShaderChunk[ "common" ],
    THREE.ShaderChunk[ "uv_pars_vertex" ],
    THREE.ShaderChunk[ "uv2_pars_vertex" ],
    THREE.ShaderChunk[ "displacementmap_pars_vertex" ],
    THREE.ShaderChunk[ "envmap_pars_vertex" ],
    THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
    THREE.ShaderChunk[ "color_pars_vertex" ],
    THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
    THREE.ShaderChunk[ "skinning_pars_vertex" ],
    THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
    THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

    ( additionalChank.vsHeader || '' ),

    "void main() {",

      THREE.ShaderChunk[ "uv_vertex" ],
      THREE.ShaderChunk[ "uv2_vertex" ],
      THREE.ShaderChunk[ "color_vertex" ],

      THREE.ShaderChunk[ "beginnormal_vertex" ],
      THREE.ShaderChunk[ "morphnormal_vertex" ],
      THREE.ShaderChunk[ "skinbase_vertex" ],
      THREE.ShaderChunk[ "skinnormal_vertex" ],
      THREE.ShaderChunk[ "defaultnormal_vertex" ],

    "#ifndef FLAT_SHADED", // Normal computed with derivatives when FLAT_SHADED

    " vNormal = normalize( transformedNormal );",

    "#endif",

      THREE.ShaderChunk[ "begin_vertex" ],
      THREE.ShaderChunk[ "displacementmap_vertex" ],
      THREE.ShaderChunk[ "morphtarget_vertex" ],
      THREE.ShaderChunk[ "skinning_vertex" ],
      THREE.ShaderChunk[ "project_vertex" ],
      THREE.ShaderChunk[ "logdepthbuf_vertex" ],

    " vViewPosition = - mvPosition.xyz;",

      THREE.ShaderChunk[ "worldpos_vertex" ],
      THREE.ShaderChunk[ "envmap_vertex" ],
      THREE.ShaderChunk[ "lights_phong_vertex" ],
      THREE.ShaderChunk[ "shadowmap_vertex" ],

      ( additionalChank.vsAfter || '' ),

    "}"

  ].join( "\n" );

  var fragmentShader = [

    "#define PHONG",

    "uniform vec3 diffuse;",
    "uniform vec3 emissive;",
    "uniform vec3 specular;",
    "uniform float shininess;",
    "uniform float opacity;",

    THREE.ShaderChunk[ "common" ],
    THREE.ShaderChunk[ "color_pars_fragment" ],
    THREE.ShaderChunk[ "uv_pars_fragment" ],
    THREE.ShaderChunk[ "uv2_pars_fragment" ],
    THREE.ShaderChunk[ "map_pars_fragment" ],
    THREE.ShaderChunk[ "alphamap_pars_fragment" ],
    THREE.ShaderChunk[ "aomap_pars_fragment" ],
    THREE.ShaderChunk[ "lightmap_pars_fragment" ],
    THREE.ShaderChunk[ "emissivemap_pars_fragment" ],
    THREE.ShaderChunk[ "envmap_pars_fragment" ],
    THREE.ShaderChunk[ "fog_pars_fragment" ],
    THREE.ShaderChunk[ "bsdfs" ],
    THREE.ShaderChunk[ "ambient_pars" ],
    THREE.ShaderChunk[ "lights_pars" ],
    THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
    THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
    THREE.ShaderChunk[ "bumpmap_pars_fragment" ],
    THREE.ShaderChunk[ "normalmap_pars_fragment" ],
    THREE.ShaderChunk[ "specularmap_pars_fragment" ],
    THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

    ( additionalChank.fsHeader || '' ),

    "void main() {",

    " vec4 diffuseColor = vec4( diffuse, opacity );",
    " ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );",
    " vec3 totalEmissiveLight = emissive;",

      THREE.ShaderChunk[ "logdepthbuf_fragment" ],
      THREE.ShaderChunk[ "map_fragment" ],
      THREE.ShaderChunk[ "color_fragment" ],
      THREE.ShaderChunk[ "alphamap_fragment" ],
      THREE.ShaderChunk[ "alphatest_fragment" ],
      THREE.ShaderChunk[ "specularmap_fragment" ],
      THREE.ShaderChunk[ "normal_fragment" ],
      THREE.ShaderChunk[ "emissivemap_fragment" ],

      // accumulation
      THREE.ShaderChunk[ "lights_phong_fragment" ],
      THREE.ShaderChunk[ "lights_template" ],

      // modulation
      THREE.ShaderChunk[ "aomap_fragment" ],

      "vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveLight;",

      THREE.ShaderChunk[ "envmap_fragment" ],
      THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

      THREE.ShaderChunk[ "fog_fragment" ],

    " gl_FragColor = vec4( outgoingLight, diffuseColor.a );",

      ( additionalChank.fsAfter || '' ),

    "}"

  ].join( "\n" );

  var shaderParams = {
    vertexShader   : vertexShader,
    fragmentShader : fragmentShader,
    uniforms       : THREE.UniformsUtils.clone( uniforms ),
    defines        : {},
    extensions     : {}
  }

  if ( parameters ) {

    if ( parameters.color ) {

      shaderParams.uniforms.diffuse.value.setHex( parameters.color );

    }

    if ( parameters.map ) {

      shaderParams.uniforms.map.value  = parameters.map;
      shaderParams.defines.USE_MAP = '';
      shaderParams.uniforms.offsetRepeat.value.setZ( parameters.map.repeat.x );
      shaderParams.uniforms.offsetRepeat.value.setW( parameters.map.repeat.y );

    }

    if ( parameters.normalMap ) {

      shaderParams.uniforms.normalMap.value = parameters.normalMap;
      shaderParams.defines.USE_NORMALMAP = '';
      shaderParams.extensions.derivatives = true;
      shaderParams.uniforms.offsetRepeat.value.setZ( parameters.normalMap.repeat.x );
      shaderParams.uniforms.offsetRepeat.value.setW( parameters.normalMap.repeat.y );

    }

    if ( parameters.normalScale ) {

      shaderParams.uniforms.normalScale.value.copy( parameters.normalScale );

    }

  }

  return shaderParams;

};
