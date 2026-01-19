const arr = []; // particles

const c = document.querySelector("canvas");
const ctx = c.getContext("2d");

const cw = (c.width = 3000);
const ch = (c.height = 3000);

// offscreen canvas for text mask
const c2 = document.createElement("canvas");
c2.width = cw;
c2.height = ch;
const ctx2 = c2.getContext("2d", { willReadFrequently: true });

// text image
const txtImg = document.querySelector(".text-img");

// draw text image AFTER load, centered
function drawTextMask() {
  ctx2.clearRect(0, 0, cw, ch);
  ctx2.drawImage(
    txtImg,
    cw / 2 - txtImg.width / 2,
    ch / 2 - txtImg.height / 2
  );
}

if (txtImg.complete) {
  drawTextMask();
} else {
  txtImg.onload = drawTextMask;
}

// create initial flakes
for (let i = 0; i < 1300; i++) makeFlake(i, true);

function makeFlake(i, ff) {
  arr.push({ i, x: 0, x2: 0, y: 0, s: 0 });

  arr[i].t = gsap.timeline({ repeat: -1, repeatRefresh: true })
    .fromTo(arr[i], {
      x: () => -400 + (cw + 800) * Math.random(),
      y: -15,
      s: () => gsap.utils.random(1.8, 7, 0.1),
      x2: -500
    }, {
      ease: "none",
      y: ch,
      x: "+=" + gsap.utils.random(-400, 400, 1),
      x2: 500
    })
    .seek(ff ? Math.random() * 99 : 0)
    .timeScale(arr[i].s / 37);
}

ctx.fillStyle = "#ffffff";
gsap.ticker.add(render);

function render() {
  ctx.clearRect(0, 0, cw, ch);

  arr.forEach(p => {
    if (p.t && p.t.isActive()) {
      const d = ctx2.getImageData(
        Math.floor(p.x + p.x2),
        Math.floor(p.y),
        1,
        1
      );

      // 🔥 FIXED: relaxed alpha threshold
      if (d.data[3] > 20 && Math.random() > 0.5) {
        p.t.pause();
        if (arr.length < 9000) makeFlake(arr.length, false);
      }
    }

    ctx.beginPath();
    ctx.arc(
      p.x + p.x2,
      p.y,
      p.s * gsap.utils.interpolate(1, 0.2, p.y / ch),
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
}
