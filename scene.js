/* ==========================================================================
   3D scroll scene (Three.js)
   - Loads your character from SETTINGS.character3D (a .glb file) if set,
     otherwise shows a violet liquid-metal sculpture as a stand-in.
   - The model moves with the page: close-up → turns → profile beside Works.
   You normally don't need to edit this file.
   ========================================================================== */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// SETTINGS comes from data.js (a top-level const, so not on window)
const S = typeof SETTINGS !== "undefined" ? SETTINGS : {};
const canvas = document.getElementById("scene");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ready = () => { if (!window.__sceneReady) { window.__sceneReady = true; dispatchEvent(new Event("scene-ready")); } };

function init() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    document.documentElement.classList.add("no-webgl");
    ready();
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // soft self-shadows (under the nose, chin, collar) give the face real depth
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 7.4);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  // ---- lights (fixed in the world, so the rim light sweeps as the model turns)
  const key = new THREE.DirectionalLight(0xfff1e6, 1.7); key.position.set(-3, 2.5, 4);
  const rim = new THREE.DirectionalLight(0x8b5cf6, 7);   rim.position.set(3.5, 1.6, -3);
  const rim2 = new THREE.DirectionalLight(0xe879f9, 3);  rim2.position.set(-3.6, -1, -2.6);
  const fill = new THREE.HemisphereLight(0xb8a6ff, 0x0a0612, 0.4);
  scene.add(key, rim, rim2, fill);

  // ---- rig: scroll moves the rig, mouse/float moves the inner group
  const rig = new THREE.Group();
  const inner = new THREE.Group();
  rig.add(inner);
  scene.add(rig);

  // ---- halo: glowing ring + soft glow behind the model
  const halo = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.009, 16, 320),
    new THREE.MeshBasicMaterial({ color: 0xc4b5fd, toneMapped: false, transparent: true, opacity: 0.9 })
  );
  const glowTex = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const g = c.getContext("2d"), grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, "rgba(167,139,250,0.9)"); grd.addColorStop(0.35, "rgba(139,92,246,0.35)");
    grd.addColorStop(1, "rgba(139,92,246,0)");
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.55 }));
  glow.scale.set(5.5, 5.5, 1);
  glow.position.z = -1.4;
  ring.position.z = -0.7;
  halo.add(ring); // (soft glow comes from the CSS background so text behind stays visible)
  scene.add(halo);

  // ---- floating dust
  const N = 700, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 14;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xd8ccff, size: 0.018, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  scene.add(dust);

  // ---- stand-in sculpture (liquid metal, GPU displaced)
  const uTime = { value: 0 };
  function makeSculpture() {
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xb59cff, metalness: 1, roughness: 0.1,
      iridescence: 0.55, iridescenceIOR: 1.5, iridescenceThicknessRange: [120, 420],
      clearcoat: 1, clearcoatRoughness: 0.08,
    });
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = uTime;
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", `#include <common>
          uniform float uTime;
          float dispF(vec3 p){
            return 0.16*sin(p.x*2.1+uTime*0.55)*sin(p.y*2.5+uTime*0.45)*sin(p.z*1.9+uTime*0.65)
                 + 0.05*sin(p.y*6.0+p.x*3.0+uTime*1.1)
                 + 0.03*sin(p.z*8.0-p.y*4.0+uTime*0.9);
          }
          vec3 dispP(vec3 p){ return p + normalize(p)*dispF(p); }`)
        .replace("#include <beginnormal_vertex>", `
          vec3 tng = normalize(cross(normal, vec3(0.0, 1.0, 0.0001)));
          vec3 btg = normalize(cross(normal, tng));
          vec3 dP0 = dispP(position);
          vec3 dP1 = dispP(position + tng*0.01);
          vec3 dP2 = dispP(position + btg*0.01);
          vec3 objectNormal = normalize(cross(dP1 - dP0, dP2 - dP0));
          if (dot(objectNormal, normal) < 0.0) objectNormal = -objectNormal;
          #ifdef USE_TANGENT
            vec3 objectTangent = vec3( tangent.xyz );
          #endif`)
        .replace("#include <begin_vertex>", "vec3 transformed = dP0;");
    };
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 192, 192), mat);
    m.scale.set(0.82, 1.0, 0.82);
    return m;
  }
  let model = makeSculpture();
  inner.add(model);

  // ---- your character (.glb)
  // "bust" = head & shoulders, "waist" = waist-up, "full" = full body (see data.js)
  const FRAMING = S.character3D ? (S.characterFraming || "bust") : "sculpture";
  let waitingForModel = false;
  if (S.character3D) {
    waitingForModel = true;
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    loader.setDRACOLoader(draco);
    loader.load(S.character3D, (gltf) => {
      const obj = gltf.scene;
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
      const scale = (2.5 / Math.max(size.y, size.x * 0.8)) * (S.characterScale || 1);
      obj.scale.setScalar(scale);
      obj.position.copy(center).multiplyScalar(-scale);
      // Matte, skin-like finish. 0 = fully matte, 1 = glossy (see characterShine in data.js)
      const shine = Math.min(1, Math.max(0, S.characterShine ?? 0.2));
      obj.traverse((o) => {
        if (o.isMesh && o.material) {
          // Rebuild as a game-style character material. It keeps the model's colour, detail
          // (normal) and gloss (roughness) maps, ignores the "metal" channel AI exports get wrong,
          // and the shader below adds per-material looks: skin, fabric, hair, eyes/lips/glasses.
          const old = o.material;
          const aniso = renderer.capabilities.getMaxAnisotropy();
          [old.map, old.normalMap, old.roughnessMap].forEach((t) => { if (t) { t.anisotropy = aniso; t.needsUpdate = true; } });
          const m = new THREE.MeshPhysicalMaterial({
            map: old.map,
            normalMap: old.normalMap,
            normalScale: new THREE.Vector2(1.0, 1.0),
            roughnessMap: old.roughnessMap || null,   // glossy eyes, lips, glasses; matte cloth
            aoMap: old.aoMap || null,
            metalness: 0,
            roughness: 1,
            specularIntensity: 0.5 + shine * 0.5,
            specularColor: new THREE.Color(0xfff6f0),
            sheen: 0.25,
            sheenRoughness: 0.5,
            sheenColor: new THREE.Color(0xd9c8ff),
            envMapIntensity: 0.45 + shine * 0.5,
          });
          o.material = m;
          o.castShadow = true;
          o.receiveShadow = true;
          // soft fade at the bottom cut, so a bust / waist-up model dissolves into the dark
          // instead of ending in a hard edge (characterFade in data.js, 0 = off)
          const fade = Math.max(0, S.characterFade ?? (FRAMING === "full" ? 0 : 0.22));
          // "blend" melts the model into the site: deep shadows take on the background's violet
          // instead of going pure black, and the outline softens into the haze, so it reads as
          // part of the scene rather than a cut-out pasted on top (characterBlend in data.js)
          const blend = Math.min(1, Math.max(0, S.characterBlend ?? 0.6));
          o.geometry.computeBoundingBox();
          const gb = o.geometry.boundingBox;
          const uMinY = { value: gb.min.y }, uFadeH = { value: Math.max(1e-5, (gb.max.y - gb.min.y) * fade) };
          const uBlend = { value: blend }, uFadeOn = { value: fade > 0 ? 1 : 0 };
          m.transparent = true;
          const uObjScale = { value: scale };
          const uDetail = { value: Math.max(0, S.characterDetail ?? 1) };
          m.onBeforeCompile = (sh) => {
            Object.assign(sh.uniforms, { uMinY, uFadeH, uBlend, uFadeOn, uObjScale, uDetail });
            sh.vertexShader = sh.vertexShader
              .replace("#include <common>", "#include <common>\nvarying float vFadeY;\nvarying vec3 vObj;")
              .replace("#include <begin_vertex>", "#include <begin_vertex>\nvFadeY = position.y;\nvObj = position;");
            sh.fragmentShader = sh.fragmentShader
              .replace("#include <common>", `#include <common>
              varying float vFadeY;
              varying vec3 vObj;
              uniform float uMinY, uFadeH, uBlend, uFadeOn, uObjScale, uDetail;
              float mSkin, mCloth, mHair;
              // small 3D value noise for micro detail (pores, cloth weave)
              float h3(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
              float vnoise(vec3 x) {
                vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
                return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
                           mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z);
              }`)
              // sharper colour texture + material masks read from the colour
              .replace("#include <map_fragment>", `
              {
                vec4 c = texture2D(map, vMapUv);
                vec2 px = 1.0 / vec2(textureSize(map, 0));
                vec3 blur = (texture2D(map, vMapUv + vec2(px.x, 0.0)).rgb + texture2D(map, vMapUv - vec2(px.x, 0.0)).rgb +
                             texture2D(map, vMapUv + vec2(0.0, px.y)).rgb + texture2D(map, vMapUv - vec2(0.0, px.y)).rgb) * 0.25;
                c.rgb = clamp(c.rgb + (c.rgb - blur) * 0.55 * uDetail, 0.0, 1.0);
                diffuseColor *= c;
                vec3 g = sqrt(c.rgb);                                   // ~display values
                float lum = dot(g, vec3(0.299, 0.587, 0.114));
                float sat = (max(g.r, max(g.g, g.b)) - min(g.r, min(g.g, g.b))) / max(max(g.r, max(g.g, g.b)), 1e-3);
                mSkin  = smoothstep(0.22, 0.4, sat) * smoothstep(0.3, 0.45, lum) * step(g.b, g.g) * step(g.g, g.r);
                mCloth = (1.0 - smoothstep(0.08, 0.2, sat)) * (1.0 - smoothstep(0.18, 0.32, lum));
                mHair  = (1.0 - mSkin) * (1.0 - mCloth) * (1.0 - smoothstep(0.25, 0.45, lum)) * step(g.b, g.r);
              }`)
              // per-material gloss: skin has a soft sheen of oil, cloth stays matte, hair is satin
              .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
              roughnessFactor = mix(roughnessFactor, 0.5, mSkin * 0.85);
              roughnessFactor = mix(roughnessFactor, 0.86, mCloth);
              roughnessFactor = mix(roughnessFactor, 0.42, mHair * 0.8);
              roughnessFactor = clamp(roughnessFactor, 0.18, 1.0);`)
              // micro detail on top of the model's own normal map: skin pores, fabric weave
              .replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>
              {
                vec3 wp = vObj * uObjScale;
                float fs = 260.0, fc = 620.0;
                float fadeS = 1.0 - smoothstep(0.35, 0.9, length(fwidth(wp * fs)));
                float fadeC = 1.0 - smoothstep(0.35, 0.9, length(fwidth(wp * fc)));
                float hgt = (vnoise(wp * fs) - 0.5) * 0.0011 * mSkin * fadeS
                          + (vnoise(wp * fc * vec3(1.0, 0.35, 1.0)) - 0.5) * 0.0009 * mCloth * fadeC;
                hgt *= uDetail;
                vec3 dpx = dFdx(-vViewPosition), dpy = dFdy(-vViewPosition);
                float dhx = dFdx(hgt), dhy = dFdy(hgt);
                vec3 r1 = cross(dpy, normal), r2 = cross(normal, dpx);
                float det = dot(dpx, r1);
                vec3 grad = sign(det) * (dhx * r1 + dhy * r2);
                normal = normalize(abs(det) * normal - grad);
              }`)
              // fake subsurface scattering: light bleeds warm through skin instead of going grey
              .replace("#include <opaque_fragment>", `
              {
                float ndl = dot(normal, normalize(vec3(-0.45, 0.4, 0.55)));
                float scatter = smoothstep(-0.35, 0.35, ndl) * (1.0 - smoothstep(0.35, 0.9, ndl));
                outgoingLight += diffuseColor.rgb * vec3(0.55, 0.16, 0.08) * scatter * mSkin * 0.35;
                outgoingLight *= mix(vec3(1.0), vec3(1.04, 0.99, 0.96), mSkin);
              }
              #include <opaque_fragment>`)
              .replace("#include <dithering_fragment>", `#include <dithering_fragment>
              {
                vec3 haze = vec3(0.105, 0.075, 0.205);            // the site's dim violet
                float ndv = clamp(dot(normalize(vNormal), normalize(vViewPosition)), 0.0, 1.0);
                float edge = 1.0 - ndv;
                float luma = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
                // lift the darkest areas into the violet haze
                gl_FragColor.rgb += haze * (1.0 - smoothstep(0.0, 0.25, luma)) * 0.35 * uBlend;
                // outline takes on the background colour (colour only: the model stays solid)
                gl_FragColor.rgb = mix(gl_FragColor.rgb, haze * 1.6, pow(edge, 4.0) * 0.35 * uBlend);
                // soft fade at the bottom cut
                if (uFadeOn > 0.5) gl_FragColor.a *= smoothstep(uMinY, uMinY + uFadeH, vFadeY);
              }`);
          };
          m.needsUpdate = true;
          o.frustumCulled = false;
          o.userData.fade = { uMinY, uFadeH, uFadeOn };
        }
      });
      // Depth pre-pass: an invisible copy of the model is drawn first so that only the surface
      // nearest the camera gets painted. Without it, the (fade-enabled) transparent model lets
      // the back of the head, ears and inner jacket show through itself.
      const meshes = [];
      obj.traverse((o) => { if (o.isMesh && o.userData.fade) meshes.push(o); });
      meshes.forEach((o) => {
        const f = o.userData.fade;
        const depthMat = new THREE.MeshBasicMaterial({
          colorWrite: false, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
        });
        depthMat.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, f);
          sh.vertexShader = sh.vertexShader
            .replace("#include <common>", "#include <common>\nvarying float vFadeY;")
            .replace("#include <begin_vertex>", "#include <begin_vertex>\nvFadeY = position.y;");
          sh.fragmentShader = sh.fragmentShader
            .replace("#include <common>", "#include <common>\nvarying float vFadeY;\nuniform float uMinY, uFadeH, uFadeOn;")
            .replace("void main() {", "void main() {\nif (uFadeOn > 0.5 && smoothstep(uMinY, uMinY + uFadeH, vFadeY) < 0.02) discard;");
        };
        const pre = new THREE.Mesh(o.geometry, depthMat);
        pre.renderOrder = -1;
        pre.frustumCulled = false;
        o.add(pre);
      });
      // portrait lighting for a real face: angled key for shape, low fill for shadows,
      // violet rim from behind for separation from the dark background
      key.position.set(-3.6, 3.4, 3.4);
      key.intensity = 3.4;
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      Object.assign(key.shadow.camera, { left: -3.5, right: 3.5, top: 3.5, bottom: -3.5, near: 0.5, far: 16 });
      key.shadow.camera.updateProjectionMatrix();
      key.shadow.bias = -0.0015;   // no striping ("shadow acne") across the face
      key.shadow.normalBias = 0.06;
      key.shadow.radius = 4;
      rim.position.set(3.4, 2.4, -2.6);
      rim.intensity = 4.2;
      rim2.intensity = 1.2;
      // cool, weak fill from the other side: shadow side stays dark but not black
      const fill2 = new THREE.DirectionalLight(0xb9b2ff, 0.55);
      fill2.position.set(4, 0.6, 3);
      scene.add(fill2);
      fill.intensity = 0.16;
      scene.environmentIntensity = 0.3;
      renderer.toneMappingExposure = 1.12;
      const holder = new THREE.Group();
      holder.add(obj);
      holder.rotation.y = THREE.MathUtils.degToRad(S.characterTurn || 0);
      inner.remove(model);
      model = holder;
      inner.add(model);
      ring.scale.setScalar(1.05);
      waitingForModel = false;
      window.__characterStatus = "loaded";
      ready();
    }, undefined, (err) => {
      window.__characterStatus = "failed: " + (err && err.message);
      console.warn("Could not load 3D character, using the sculpture instead:", err);
      waitingForModel = false;
      ready();
    });
    setTimeout(ready, 8000); // never block the page for too long
  }

  // ---- scroll choreography -------------------------------------------------
  let keys = [];
  const st = { x: 0, y: 0, ry: 0, rx: 0, z: 7.4, op: 1 };
  const cur = { ...st };
  const top = (el) => el.getBoundingClientRect().top + scrollY;
  function buildKeys() {
    const vh = innerHeight, q = (s) => document.querySelector(s);
    const intro = q(".intro"), resume = q("#resume"), works = q("#works"), rec = q("#recognition");
    if (!intro || !resume || !works || !rec) return;
    const mob = innerWidth < 900;
    const X = mob ? 0.25 : 1;
    const max = document.documentElement.scrollHeight - vh;
    // Camera shots per model type: [y, z, ry] for each stage.
    // y moves the model up/down (negative = down), z is camera distance, ry is turn.
    const SHOTS = {
      // head & shoulders (and the stand-in sculpture): close-up in About
      bust: {
        hero:   mob ? [-0.95, 9.6, -0.28] : [-0.05, 7.4, -0.34],
        introA: [0.1, 5.0, -0.45],  introB: [0.22, 3.9, -0.8],
        resume: [0, 6.6, 0.8],      worksA: [-0.62, 6.8, 1.45], worksB: [-0.58, 6.8, 1.62],
        rec:    [0, 9, 3.1],        end:    [0.32, 7.6, Math.PI * 2],
      },
      // waist-up: face & chest first, then the camera pulls back to reveal the rest
      waist: {
        hero:   mob ? [-1.35, 7.0, -0.2] : [-0.55, 4.6, -0.22],
        introA: [-0.32, 5.6, -0.45], introB: [-0.1, 6.5, -0.7],
        resume: [0, 7.0, 0.8],       worksA: [-0.62, 7.4, 1.45], worksB: [-0.6, 7.4, 1.6],
        rec:    [0, 9.5, 3.1],       end:    [0.1, 7.4, Math.PI * 2],
      },
      // full body: face & chest first, slowly revealing the whole body
      full: {
        hero:   mob ? [-1.25, 4.2, -0.2] : [-0.85, 2.8, -0.2],
        introA: [-0.55, 4.2, -0.45], introB: [-0.25, 6.0, -0.7],
        resume: [0, 8.0, 0.8],       worksA: [0, 7.6, 1.45],    worksB: [0, 7.6, 1.6],
        rec:    [0, 10, 3.1],        end:    [0, 8.0, Math.PI * 2],
      },
    };
    const sh = SHOTS[FRAMING] || SHOTS.bust;
    const k = (at, x, s, rx, op) => ({ at, x, y: s[0], z: s[1], ry: s[2], rx, op });
    keys = [
      k(0,                                    0,          sh.hero,   0,    1),
      k(top(intro) - vh * 0.15,               1.0 * X,    sh.introA, 0.04, mob ? 0.4 : 1),
      k(top(intro) + intro.offsetHeight - vh, 1.12 * X,   sh.introB, 0.06, mob ? 0.28 : 1),
      k(top(resume) + vh * 0.2,               -1.9 * X,   sh.resume, 0,    mob ? 0.12 : 0.22),
      k(top(works) - vh * 0.3,                -1.72 * X,  sh.worksA, 0,    mob ? 0.3 : 1),
      k(top(works) + works.offsetHeight - vh, -1.72 * X,  sh.worksB, 0,    mob ? 0.3 : 1),
      k(top(rec) + vh * 0.1,                  0,          sh.rec,    0,    0.22),
      k(max,                                  0,          sh.end,    0,    0.6),
    ];
    for (let i = 1; i < keys.length; i++) keys[i].at = Math.max(keys[i].at, keys[i - 1].at + 1);
  }
  const smooth = (t) => t * t * (3 - 2 * t);
  let override = null;
  function sample(y) {
    if (override) return override;
    if (!keys.length) return st;
    if (y <= keys[0].at) return keys[0];
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1];
      if (y <= b.at) {
        const t = smooth((y - a.at) / (b.at - a.at));
        for (const k in st) st[k] = a[k] + (b[k] - a[k]) * t;
        return st;
      }
    }
    return keys[keys.length - 1];
  }

  // ---- input
  let mx = 0, my = 0, imx = 0, imy = 0;
  addEventListener("pointermove", (e) => {
    mx = (e.clientX / innerWidth) * 2 - 1;
    my = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  let zf = 1;
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // wider lens (30 -> 38 deg) for natural perspective; zf keeps the same framing
    const base = w / h < 0.8 ? 44 : 30, fov = w / h < 0.8 ? 52 : 38;
    camera.fov = fov;
    zf = Math.tan(THREE.MathUtils.degToRad(base / 2)) / Math.tan(THREE.MathUtils.degToRad(fov / 2));
    camera.updateProjectionMatrix();
    buildKeys();
  }
  addEventListener("resize", resize);
  window.__scene = { rebuild: buildKeys };
  resize();
  addEventListener("load", buildKeys);
  setTimeout(buildKeys, 1200);

  // ---- loop
  const clock = new THREE.Clock();
  let first = true;
  function update(t, k) {
    uTime.value = reduce ? 0 : t;
    const tgt = sample(scrollY);
    for (const p in cur) cur[p] += (tgt[p] - cur[p]) * k;

    rig.position.set(cur.x, cur.y, 0);
    rig.rotation.set(cur.rx, cur.ry, 0);
    camera.position.z = cur.z * zf;
    canvas.style.opacity = cur.op.toFixed(3);

    imx += (mx - imx) * 0.05; imy += (my - imy) * 0.05;
    inner.rotation.y = imx * 0.28 + (reduce ? 0 : Math.sin(t * 0.32) * 0.09);
    inner.rotation.x = imy * 0.12;
    inner.position.y = reduce ? 0 : Math.sin(t * 0.8) * 0.045;

    halo.position.set(cur.x, cur.y + 0.05, 0);
    ring.rotation.set(Math.PI * 0.5 - 0.22 + imy * 0.1, imx * 0.15, t * 0.05);
    ring.rotation.x = 0.12 + imy * 0.08; // mostly facing camera, slight tilt
    glow.material.opacity = 0.45 + Math.sin(t * 1.3) * 0.08;

    dust.rotation.y = t * 0.012;
    dust.position.y = Math.sin(t * 0.2) * 0.1;

    renderer.render(scene, camera);
  }
  // debug helper: jump the animation to its resting state for the current scroll position
  window.__scene.settle = () => { for (let i = 0; i < 80; i++) update(clock.getElapsedTime(), 0.25); return { ...cur }; };
  // debug helper: force a pose, e.g. __scene.pose({x:0,y:0,ry:0,rx:0,z:8,op:1}); __scene.pose(null) to release
  window.__scene.pose = (p) => { override = p ? { ...cur, ...p } : null; return window.__scene.settle(); };
  window.__scene.box = () => { const b = new THREE.Box3().setFromObject(model); return { min: b.min.toArray(), max: b.max.toArray() }; };
  function frame() {
    update(clock.getElapsedTime(), 0.075);
    if (first) { first = false; if (!waitingForModel) ready(); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

init();
