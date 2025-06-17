document.addEventListener('DOMContentLoaded', () => {
    const scene = document.getElementById('scene');
    if (!scene) return;

    const messages = [
        "Khoa chúc thi tốt", "Thi tốt nhé ❤️", "12 mãi yêuu!",
    ];

    const Z_RANGE = { min: -1000, max: 400 };
    const OPACITY_RANGE = { min: 0.15, max: 1.0 };
    const SPAWN_INTERVAL = 80;

    function createFallingText() {
        const text = document.createElement('span');
        text.className = 'falling-text';
        text.style.willChange = 'transform, opacity, filter';

        const message = messages[Math.floor(Math.random() * messages.length)];
        text.innerText = message;

        const baseSize = 3.2;
        const minSize = 1.1;
        const fontSize = Math.max(minSize, baseSize - message.length * 0.1);
        text.style.fontSize = `${fontSize}rem`;

        text.style.visibility = 'hidden';
        scene.appendChild(text);

        const textWidth = text.offsetWidth;
        const maxLeft = window.innerWidth - textWidth;
        const left = Math.random() * maxLeft;

        const zPos = Math.random() * (Z_RANGE.max - Z_RANGE.min) + Z_RANGE.min;
        const opacity = OPACITY_RANGE.min +
            ((zPos - Z_RANGE.min) / (Z_RANGE.max - Z_RANGE.min)) * (OPACITY_RANGE.max - OPACITY_RANGE.min);
       const blur = Math.max(0, 2 - zPos / 400); // Giảm độ mờ, rõ chữ hơn

        const scale = 1 - (Math.abs(zPos) / 2000);

        text.style.left = `${left}px`;
        text.style.setProperty('--z-pos', `${zPos}px`);
        text.style.setProperty('--initial-opacity', opacity.toFixed(2));
        text.style.setProperty('--blur', `${blur}px`);
        text.style.setProperty('--rotate', `${Math.random() * 30 - 15}deg`);
        text.style.setProperty('--scale', scale.toFixed(2));
        text.style.zIndex = Math.round(1000 + zPos);
        text.style.transform = `translateZ(${zPos}px) scale(${scale}) rotate(${Math.random() * 30 - 15}deg)`;
        text.style.opacity = opacity.toFixed(2);
        text.style.filter = `blur(${blur}px)`;

        const fallDuration = Math.random() * 5 + 7;
        text.style.animation = `fall ${fallDuration}s linear forwards, fadeOut ${fallDuration + 1}s ease-in forwards`;

        text.style.visibility = 'visible';

        text.addEventListener('animationend', (e) => {
            if (e.animationName === 'fall') {
                requestAnimationFrame(() => text.remove());
            }
        });
    }

    let lastTime = 0;
    function spawnLoop(time) {
        if (!lastTime || time - lastTime > SPAWN_INTERVAL) {
            createFallingText();
            lastTime = time;
        }
        requestAnimationFrame(spawnLoop);
    }
    requestAnimationFrame(spawnLoop);

    // Rotate scene smoothly
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    const easing = 0.08;
    function rotateScene() {
        currentX += (targetX - currentX) * easing;
        currentY += (targetY - currentY) * easing;
        scene.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
        requestAnimationFrame(rotateScene);
    }
    rotateScene();

    function updateRotation(e) {
        const x = e.clientX ?? e.touches?.[0]?.clientX;
        const y = e.clientY ?? e.touches?.[0]?.clientY;
        if (x == null || y == null) return;

        const percentX = (x / window.innerWidth - 0.5) * 2;
        const percentY = (y / window.innerHeight - 0.5) * 2;

        targetY = -percentX * 10; // giảm để tránh quay quá nhanh
        targetX = percentY * 10;
    }
    

    document.addEventListener('mousemove', updateRotation, { passive: true });
    document.addEventListener('touchmove', updateRotation, { passive: true });
    document.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });
    document.addEventListener('touchend', () => { targetX = 0; targetY = 0; });
});
// Ngẫu nhiên màu neon cho mỗi text
const neonColors = ['#0ff', '#f0f', '#0f0', '#ff0', '#f66', '#6ff'];
const neonColor = neonColors[Math.floor(Math.random() * neonColors.length)];
text.style.color = neonColor;
text.style.textShadow = `
  0 0 2px ${neonColor},
  0 0 6px ${neonColor},
  0 0 12px ${neonColor}
`;

// Hỗ trợ xoay điện thoại (xoay toàn diện: ngang, dọc, xoay tròn)
// Hỗ trợ xoay điện thoại (xoay toàn diện: ngang, dọc, xoay tròn)
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (event) => {
        const { beta, gamma, alpha } = event;

        // Giới hạn tránh xoay quá mức
        const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

        const x = clamp(beta || 0, -90, 90);     // lên/xuống
        const y = clamp(gamma || 0, -90, 90);    // trái/phải
        const z = clamp(alpha || 0, 0, 360);     // quay quanh trục (lắc vòng vòng)

        // Biến đổi thành target rotation
        targetX = (x - 45) * 0.5;  // nghiêng lên/xuống ảnh hưởng rotateX
        targetY = -y * 0.5;        // nghiêng trái/phải ảnh hưởng rotateY

        // Option nâng cao (nếu bạn muốn khung xoay nhẹ theo hướng quay z)
        scene.style.transform = `rotateX(${targetX}deg) rotateY(${targetY}deg) rotateZ(${(z - 180) * 0.02}deg)`;
    }, true);
}


if (
  typeof DeviceOrientationEvent !== 'undefined' &&
  typeof DeviceOrientationEvent.requestPermission === 'function'
) {
  DeviceOrientationEvent.requestPermission()
    .then((response) => {
      if (response === 'granted') {
        // Đã được cấp quyền
      }
    })
    .catch(console.error);
}
