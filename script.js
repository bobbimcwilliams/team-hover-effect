// hover effect js -> scroll to bottom

!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t(require("three"), require("gsap/TweenMax")))
    : "function" == typeof define && define.amd
    ? define(["three", "gsap/TweenMax"], t)
    : (e.hoverEffect = t(e.THREE, e.TweenMax));
})(this, function (e, t) {
  return (
    (t = t && t.hasOwnProperty("default") ? t.default : t),
    function (n) {
      function i() {
        for (var e = arguments, t = 0; t < arguments.length; t++)
          if (void 0 !== e[t]) return e[t];
      }
      console.log(
        "%c Hover effect by Robin Delaporte: https://github.com/robin-dela/hover-effect ",
        "color: #bada55; font-size: 0.8rem"
      );
      var r = n.parent,
        o = n.displacementImage,
        a = n.image1,
        s = n.image2,
        f = i(n.imagesRatio, 1),
        d = i(n.intensity1, n.intensity, 1),
        l = i(n.intensity2, n.intensity, 1),
        u = i(n.angle, Math.PI / 4),
        v = i(n.angle1, u),
        m = i(n.angle2, 3 * -u),
        c = i(n.speedIn, n.speed, 1.6),
        p = i(n.speedOut, n.speed, 1.2),
        g = i(n.hover, !0),
        h = i(n.easing, Expo.easeOut),
        y = i(n.video, !1);
      if (r)
        if (a && s && o) {
          var x = new e.Scene(),
            F = new e.OrthographicCamera(
              r.offsetWidth / -2,
              r.offsetWidth / 2,
              r.offsetHeight / 2,
              r.offsetHeight / -2,
              1,
              1e3
            );
          F.position.z = 1;
          var w = new e.WebGLRenderer({ antialias: !1, alpha: !0 });
          w.setPixelRatio(2),
            w.setClearColor(16777215, 0),
            w.setSize(r.offsetWidth, r.offsetHeight),
            r.appendChild(w.domElement);
          var L = function () {
              w.render(x, F);
            },
            H = new e.TextureLoader();
          H.crossOrigin = "";
          var E,
            W,
            V = H.load(o, L);
          if (((V.magFilter = V.minFilter = e.LinearFilter), y)) {
            var M = function () {
              requestAnimationFrame(M), w.render(x, F);
            };
            M(),
              ((y = document.createElement("video")).autoplay = !0),
              (y.loop = !0),
              (y.src = a),
              y.load();
            var P = document.createElement("video");
            (P.autoplay = !0), (P.loop = !0), (P.src = s), P.load();
            var R = new e.VideoTexture(y),
              T = new e.VideoTexture(P);
            (R.magFilter = T.magFilter = e.LinearFilter),
              (R.minFilter = T.minFilter = e.LinearFilter),
              P.addEventListener(
                "loadeddata",
                function () {
                  P.play(),
                    ((T = new e.VideoTexture(P)).magFilter = e.LinearFilter),
                    (T.minFilter = e.LinearFilter),
                    (C.uniforms.texture2.value = T);
                },
                !1
              ),
              y.addEventListener(
                "loadeddata",
                function () {
                  y.play(),
                    ((R = new e.VideoTexture(y)).magFilter = e.LinearFilter),
                    (R.minFilter = e.LinearFilter),
                    (C.uniforms.texture1.value = R);
                },
                !1
              );
          } else
            (R = H.load(a, L)),
              (T = H.load(s, L)),
              (R.magFilter = T.magFilter = e.LinearFilter),
              (R.minFilter = T.minFilter = e.LinearFilter);
          var U = f;
          r.offsetHeight / r.offsetWidth < U
            ? ((E = 1), (W = r.offsetHeight / r.offsetWidth / U))
            : ((E = (r.offsetWidth / r.offsetHeight) * U), (W = 1));
          var C = new e.ShaderMaterial({
              uniforms: {
                intensity1: { type: "f", value: d },
                intensity2: { type: "f", value: l },
                dispFactor: { type: "f", value: 0 },
                angle1: { type: "f", value: v },
                angle2: { type: "f", value: m },
                texture1: { type: "t", value: R },
                texture2: { type: "t", value: T },
                disp: { type: "t", value: V },
                res: {
                  type: "vec4",
                  value: new e.Vector4(r.offsetWidth, r.offsetHeight, E, W)
                },
                dpr: { type: "f", value: window.devicePixelRatio }
              },
              vertexShader:
                "\nvarying vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n",
              fragmentShader:
                "\nvarying vec2 vUv;\n\nuniform float dispFactor;\nuniform float dpr;\nuniform sampler2D disp;\n\nuniform sampler2D texture1;\nuniform sampler2D texture2;\nuniform float angle1;\nuniform float angle2;\nuniform float intensity1;\nuniform float intensity2;\nuniform vec4 res;\nuniform vec2 parent;\n\nmat2 getRotM(float angle) {\n  float s = sin(angle);\n  float c = cos(angle);\n  return mat2(c, -s, s, c);\n}\n\nvoid main() {\n  vec4 disp = texture2D(disp, vUv);\n  vec2 dispVec = vec2(disp.r, disp.g);\n\n  vec2 uv = 0.5 * gl_FragCoord.xy / (res.xy) ;\n  vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);\n\n\n  vec2 distortedPosition1 = myUV + getRotM(angle1) * dispVec * intensity1 * dispFactor;\n  vec2 distortedPosition2 = myUV + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);\n  vec4 _texture1 = texture2D(texture1, distortedPosition1);\n  vec4 _texture2 = texture2D(texture2, distortedPosition2);\n  gl_FragColor = mix(_texture1, _texture2, dispFactor);\n}\n",
              transparent: !0,
              opacity: 1
            }),
            b = new e.PlaneBufferGeometry(r.offsetWidth, r.offsetHeight, 1),
            D = new e.Mesh(b, C);
          x.add(D),
            g &&
              (r.addEventListener("mouseenter", _),
              r.addEventListener("touchstart", _),
              r.addEventListener("mouseleave", z),
              r.addEventListener("touchend", z)),
            window.addEventListener("resize", function (t) {
              r.offsetHeight / r.offsetWidth < U
                ? ((E = 1), (W = r.offsetHeight / r.offsetWidth / U))
                : ((E = (r.offsetWidth / r.offsetHeight) * U), (W = 1)),
                (D.material.uniforms.res.value = new e.Vector4(
                  r.offsetWidth,
                  r.offsetHeight,
                  E,
                  W
                )),
                w.setSize(r.offsetWidth, r.offsetHeight),
                L();
            }),
            (this.next = _),
            (this.previous = z);
        } else console.warn("One or more images are missing");
      else console.warn("Parent missing");
      function _() {
        t.to(C.uniforms.dispFactor, c, {
          value: 1,
          ease: h,
          onUpdate: L,
          onComplete: L
        });
      }
      function z() {
        t.to(C.uniforms.dispFactor, p, {
          value: 0,
          ease: h,
          onUpdate: L,
          onComplete: L
        });
      }
    }
  );
});

// your custom code

new hoverEffect({
  parent: document.querySelector(".img1"),
  intensity: 0.3,
  image1:
    "https://images.unsplash.com/photo-1529995049601-ef63465a463f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  image2:
    "https://images.unsplash.com/photo-1565600563874-1ac13eae7170?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  displacementImage: "https://i.postimg.cc/28jsM5QJ/4.png",
  imagesRatio: "1.5"
});

// *********************
// This Code is for only the floating card in right bottom corner
// **********************

const WebCifarIcon = document.querySelector("#webCifar-icon");
const WebCifarEl = document.querySelector("#webCifar");
const close = WebCifarEl.querySelector(".close");
const youtubeLink = document.querySelector(".youtubeLink");

WebCifarIcon.addEventListener("click", () => {
  WebCifarEl.classList.add("active");
});
close.addEventListener("click", () => {
  WebCifarEl.classList.remove("active");
});

youtubeLink.setAttribute("href", "https://youtu.be/3RNzWyXigMc");
