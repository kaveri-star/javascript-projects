// Select Elements
const artworks = document.querySelectorAll('.artwork');
const thumbnails = document.querySelectorAll('.thumbnail');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const playPauseButton = document.getElementById('playPause');
const fullscreenButton = document.getElementById('fullscreen');
const toggleDescriptions = document.getElementById('toggleDescriptions');
const modal = document.getElementById('artworkModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.getElementById('closeModal');

let currentIndex = 0;
let isPlaying = true;
let slideshowInterval;

// Show Artwork
function showArtwork(index) {
  artworks.forEach((artwork, i) => {
    artwork.classList.toggle('active', i === index);
  });
}

// Slideshow
function startSlideshow() {
  slideshowInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % artworks.length;
    showArtwork(currentIndex);
  }, 2000);
  isPlaying = true;
  playPauseButton.textContent = 'Pause';
}

function stopSlideshow() {
  clearInterval(slideshowInterval);
  isPlaying = false;
  playPauseButton.textContent = 'Play';
}

// Event Listeners
playPauseButton.addEventListener('click', () => (isPlaying ? stopSlideshow() : startSlideshow()));
nextButton.addEventListener('click', () => {
  stopSlideshow();
  currentIndex = (currentIndex + 1) % artworks.length;
  showArtwork(currentIndex);
});
prevButton.addEventListener('click', () => {
  stopSlideshow();
  currentIndex = (currentIndex - 1 + artworks.length) % artworks.length;
  showArtwork(currentIndex);
});
thumbnails.forEach((thumbnail, index) => thumbnail.addEventListener('click', () => {
  currentIndex = index;
  stopSlideshow();
  showArtwork(currentIndex);
}));
fullscreenButton.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenButton.textContent = 'Exit Fullscreen';
  } else {
    document.exitFullscreen();
    fullscreenButton.textContent = 'Enter Fullscreen';
  }
});
toggleDescriptions.addEventListener('click', () => {
  const descriptions = document.querySelectorAll('.artwork p');
  descriptions.forEach((desc) => (desc.style.display = desc.style.display === 'none' ? 'block' : 'none'));
  toggleDescriptions.textContent = toggleDescriptions.textContent === 'Hide Descriptions' ? 'Show Descriptions' : 'Hide Descriptions';
});
artworks.forEach((artwork) => artwork.addEventListener('click', () => {
  modal.style.display = 'flex';
  modalImg.src = artwork.querySelector('img').src;
  modalCaption.textContent = artwork.querySelector('p').textContent;
}));
closeModal.addEventListener('click', () => (modal.style.display = 'none'));

// Initialize
showArtwork(currentIndex);
startSlideshow();
