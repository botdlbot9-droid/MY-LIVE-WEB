// ============================================================
// 🔴 अपना .m3u8 लिंक यहाँ डालें (बदलते समय GitHub पर push करें)
// ============================================================
const DEFAULT_VIDEO_URL = "https://example.com/stream.m3u8";

let hls = null;
const video = document.getElementById('videoPlayer');
const viewerCountEl = document.getElementById('viewerCount');
const errorMsg = document.getElementById('errorMsg');
const inputField = document.getElementById('videoUrlInput');

// 👁️ लाइव व्यूअर काउंट (सिम्युलेटेड)
function startViewerCounter() {
  let count = Math.floor(Math.random() * 40) + 12;
  viewerCountEl.textContent = count;
  setInterval(() => {
    let change = Math.floor(Math.random() * 7) - 3;
    let newCount = parseInt(viewerCountEl.textContent) + change;
    if (newCount < 5) newCount = 5 + Math.floor(Math.random() * 10);
    if (newCount > 150) newCount = 120 + Math.floor(Math.random() * 30);
    viewerCountEl.textContent = newCount;
  }, 7000);
}
startViewerCounter();

// 🎬 वीडियो लोड करने का फंक्शन
function loadVideo(url) {
  if (!url) url = document.getElementById('videoUrlInput').value.trim();
  if (!url || url === "") {
    errorMsg.textContent = "❌ कृपया एक वैध .m3u8 लिंक डालें!";
    errorMsg.classList.add('show');
    return;
  }
  errorMsg.classList.remove('show');
  if (hls) { hls.destroy(); hls = null; }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.play().catch(e => console.warn('Autoplay blocked:', e));
    return;
  }

  if (Hls.isSupported()) {
    hls = new Hls({ enableWorker: true, lowLatencyMode: true, maxBufferLength: 30 });
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      video.play().catch(e => console.warn('Autoplay blocked:', e));
    });
    hls.on(Hls.Events.ERROR, function(event, data) {
      if (data.fatal) {
        errorMsg.textContent = "❌ वीडियो लोड करने में त्रुटि। लिंक एक्सपायर हो सकता है।";
        errorMsg.classList.add('show');
      }
    });
  } else {
    errorMsg.textContent = "❌ आपका ब्राउज़र HLS स्ट्रीम सपोर्ट नहीं करता।";
    errorMsg.classList.add('show');
  }
}

function loadVideoFromInput() {
  loadVideo();
}

// Enter दबाने पर लोड हो
document.getElementById('videoUrlInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') loadVideoFromInput();
});

// पेज लोड होने पर DEFAULT लिंक लोड करें
window.addEventListener('load', function() {
  if (DEFAULT_VIDEO_URL && DEFAULT_VIDEO_URL !== "https://example.com/stream.m3u8") {
    document.getElementById('videoUrlInput').value = DEFAULT_VIDEO_URL;
    loadVideo(DEFAULT_VIDEO_URL);
  }
});
