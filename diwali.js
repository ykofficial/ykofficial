/* =====================================================
   YK OFFICIAL | DIWALI 2026
   POSTER IMAGE POPUP
   Same functionality | New Design
===================================================== */

(() => {
  "use strict";

  if (window.__YK_DIWALI_POSTER__) return;
  window.__YK_DIWALI_POSTER__ = true;

  const POSTER = "diwaliposter.png";
  const KEY = "yk_diwali_mix_2026";

  const style = document.createElement("style");

  style.textContent = `
    #ykMix, #ykMix * {
      box-sizing: border-box;
    }

    #ykMix {
      font-family: Arial, sans-serif;
      position: relative;
      z-index: 2147483000;
    }

    #ykMix .overlay {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100vh;
      height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 15px;
      background: rgba(3,5,12,.97);
      opacity: 0;
      visibility: hidden;
      transition: .45s ease;
      isolation: isolate;
    }

    #ykMix .overlay.open {
      opacity: 1;
      visibility: visible;
    }

    #ykMix .background {
      position: absolute;
      inset: 0;
      z-index: -2;
      background:
        radial-gradient(ellipse at center,#51300d,transparent 65%),
        linear-gradient(145deg,#05050b,#15100e,#070711);
    }

    #ykMix canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
    }

    #ykMix .poster-wrap {
      position: relative;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 12px;
    }

    #ykMix .poster {
      display: block;
      width: auto;
      height: auto;
      max-width: min(100%,1400px);
      max-height: 88dvh;
      object-fit: contain;
      border-radius: 12px;
      box-shadow:
        0 18px 80px #000b,
        0 0 35px #ffb84d30;
      animation: ykPosterIn .7s ease both;
    }

    @keyframes ykPosterIn {
      from {
        opacity: 0;
        transform: scale(.93);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    #ykMix .close {
      position: absolute;
      top: 18px;
      right: 19px;
      z-index: 10;
      width: 42px;
      height: 42px;
      color: white;
      background: #111827d9;
      border: 1px solid #ffffff70;
      border-radius: 50%;
      font-size: 25px;
      cursor: pointer;
      transition: .3s;
    }

    #ykMix .close:hover {
      background: #c18a3a;
      transform: rotate(90deg);
    }

    #ykMix .mini {
      position: fixed;
      top: 15px;
      left: 15px;
      z-index: 2147482999;
      padding: 11px 16px;
      border-radius: 50px;
      background: linear-gradient(120deg,#211609,#111020);
      color: #ffe3a4;
      border: 1px solid #dcae61;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 1px;
      box-shadow: 0 0 25px #f3a93f66;
      cursor: pointer;
      animation: ykMini 1.8s infinite;
    }

    @keyframes ykMini {
      50% {
        transform: translateY(-5px);
      }
    }

    #ykMix .hidden {
      display: none !important;
    }

    #ykMix .error {
      display: none;
      color: white;
      text-align: center;
      padding: 25px;
      line-height: 1.8;
      background: #111827;
      border-radius: 12px;
    }

    @media(max-width:600px) {
      #ykMix .overlay {
        padding: 8px;
      }

      #ykMix .poster-wrap {
        padding: 4px;
      }

      #ykMix .poster {
        max-width: 100%;
        max-height: 85dvh;
        border-radius: 8px;
      }

      #ykMix .close {
        top: 12px;
        right: 12px;
        width: 38px;
        height: 38px;
      }

      #ykMix .mini {
        top: 12px;
        left: 12px;
      }
    }

    @media(prefers-reduced-motion:reduce) {
      #ykMix * {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  document.head.appendChild(style);

  // CREATE POPUP
  const root = document.createElement("div");
  root.id = "ykMix";

  root.innerHTML = `
    <button class="mini hidden" id="ykMini">
      🪔 DIWALI 2026 ✨
    </button>

    <div class="overlay" id="ykOverlay">

      <div class="background"></div>

      <canvas id="ykFireworks"></canvas>

      <button class="close" id="ykClose"
        aria-label="Close">×</button>

      <div class="poster-wrap">

        <img
          src="${POSTER}"
          class="poster"
          id="ykPoster"
          alt="YK OFFICIAL Diwali Poster">

        <div class="error" id="ykError">
          <strong>Poster not found!</strong><br>
          Please check diwaliposter.png location.
        </div>

      </div>

    </div>
  `;

  document.body.appendChild(root);

  const overlay = root.querySelector("#ykOverlay");
  const mini = root.querySelector("#ykMini");
  const canvas = root.querySelector("#ykFireworks");
  const ctx = canvas.getContext("2d");

  const poster = root.querySelector("#ykPoster");

  poster.onerror = () => {
    poster.style.display = "none";
    root.querySelector("#ykError").style.display = "block";
  };

  // FIREWORKS
  let width = 0;
  let height = 0;
  let particles = [];
  let rockets = [];
  let animationFrame = null;
  let lastLaunch = 0;
  let active = false;

  const colors = [
    "#ffcb65",
    "#ff634f",
    "#c58aff",
    "#55d9ff",
    "#fff2be",
    "#ff8fc9"
  ];

  function resize() {
    const dpr = Math.min(
      window.devicePixelRatio || 1, 2
    );

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  window.addEventListener("resize",resize);
  resize();

  function burst(x,y,color) {
    const count = 65 + Math.floor(
      Math.random() * 35
    );

    for(let i=0;i<count;i++) {
      const angle = Math.random()*Math.PI*2;
      const speed = 1.2+Math.random()*5.2;

      particles.push({
        x,y,
        vx:Math.cos(angle)*speed,
        vy:Math.sin(angle)*speed,
        life:1,
        decay:.009+Math.random()*.014,
        size:1+Math.random()*2.5,
        color:Math.random()>.35
          ? color
          : colors[
              Math.floor(Math.random()*colors.length)
            ]
      });
    }
  }

  function launch() {
    rockets.push({
      x:width*(.12+Math.random()*.76),
      y:height+5,
      target:height*(.13+Math.random()*.45),
      speed:5+Math.random()*3,
      color:colors[
        Math.floor(Math.random()*colors.length)
      ]
    });
  }

  function animate(time) {
    if(!active) return;

    ctx.clearRect(0,0,width,height);

    if(time-lastLaunch>650) {
      launch();
      lastLaunch=time;
    }

    rockets=rockets.filter(r=>{
      r.y-=r.speed;

      ctx.beginPath();
      ctx.arc(r.x,r.y,2.5,0,Math.PI*2);
      ctx.fillStyle=r.color;
      ctx.shadowBlur=15;
      ctx.shadowColor=r.color;
      ctx.fill();
      ctx.shadowBlur=0;

      if(r.y<=r.target) {
        burst(r.x,r.y,r.color);
        return false;
      }

      return true;
    });

    particles=particles.filter(p=>{
      p.x+=p.vx;
      p.y+=p.vy;

      p.vx*=.985;
      p.vy*=.985;
      p.vy+=.035;

      p.life-=p.decay;

      if(p.life<=0) return false;

      ctx.globalAlpha=Math.max(0,p.life);

      ctx.beginPath();
      ctx.arc(p.x,p.y,p.size,0,Math.PI*2);

      ctx.fillStyle=p.color;
      ctx.shadowBlur=12;
      ctx.shadowColor=p.color;
      ctx.fill();

      ctx.shadowBlur=0;

      return true;
    });

    ctx.globalAlpha=1;

    animationFrame=requestAnimationFrame(animate);
  }

  function startFireworks() {
    if(active) return;

    active=true;
    lastLaunch=0;

    animationFrame=requestAnimationFrame(animate);
  }

  function stopFireworks() {
    active=false;

    if(animationFrame!==null) {
      cancelAnimationFrame(animationFrame);
    }

    particles=[];
    rockets=[];

    ctx.clearRect(0,0,width,height);
  }

  // OPEN POPUP
  function openPoster() {
    overlay.classList.add("open");
    mini.classList.add("hidden");

    document.body.style.overflow="hidden";

    startFireworks();
  }

  // CLOSE POPUP
  function closePoster() {
    overlay.classList.remove("open");
    mini.classList.remove("hidden");

    document.body.style.overflow="";

    stopFireworks();
  }

  root.querySelector("#ykClose")
    .onclick=closePoster;

  mini.onclick=openPoster;

  overlay.addEventListener("click",e=>{
    if(e.target===overlay) {
      closePoster();
    }
  });

  document.addEventListener("keydown",e=>{
    if(
      e.key==="Escape" &&
      overlay.classList.contains("open")
    ) {
      closePoster();
    }
  });

  // FIRST VISIT AUTO OPEN
  if(!sessionStorage.getItem(KEY)) {

    setTimeout(()=>{
      openPoster();

      sessionStorage.setItem(KEY,"yes");

    },1300);

  } else {

    mini.classList.remove("hidden");

  }

  console.log(
    "YK OFFICIAL | Diwali Poster Ready!"
  );

})();