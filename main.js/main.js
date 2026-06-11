import * as THREE from "../libs/three.module.js";

const homeScreen = document.querySelector("#home-screen");
const spotScreen = document.querySelector("#spot-screen");
const spotSeatScreen = document.querySelector("#spot-seat-screen");
const movieScreen = document.querySelector("#movie-screen");
const scheduleScreen = document.querySelector("#schedule-screen");
const seatMap = document.querySelector("#seat-map");
const selectedSeatsLabel = document.querySelector("#selected-seats");
const seatCountLabel = document.querySelector("#seat-count");
const priceLabel = document.querySelector("#price");
const ticketSeatsLabel = document.querySelector("#ticket-seats");
const nextButton = document.querySelector("#next-btn");
const seatScreen = document.querySelector("#seat-screen");
const ticketScreen = document.querySelector("#ticket-screen");
const seatBackButton = document.querySelector("#seat-back");
const scheduleBackButton = document.querySelector("#schedule-back");
const scheduleNextButton = document.querySelector("#schedule-next");
const ticketBackButton = document.querySelector("#ticket-back");
const toast = document.querySelector("#toast");
const phoneShell = document.querySelector(".phone-shell");
const ticket3dOverlay = document.querySelector("#ticket-3d-overlay");
const movieHero = document.querySelector("#movie-hero");
const movieCopy = document.querySelector("#movie-copy");
const movieName = document.querySelector("#movie-name");
const movieGenre = document.querySelector("#movie-genre");
const movieYear = document.querySelector("#movie-year");
const movieRuntime = document.querySelector("#movie-runtime");
const movieDirector = document.querySelector("#movie-director");
const movieBuyButton = document.querySelector("#movie-buy");
const movieDial = document.querySelector("#movie-dial");
const movieDialWrap = document.querySelector("#movie-dial-wrap");
const movieSearchInput = document.querySelector("#movie-search-input");
const scheduleHero = document.querySelector("#schedule-hero");
const scheduleMovieName = document.querySelector("#schedule-movie-name");
const scheduleDescription = document.querySelector("#schedule-description");
const dateDial = document.querySelector("#date-dial");
const timeDial = document.querySelector("#time-dial");
const ticketMovieTitle = document.querySelector("#ticket-movie-title");
const ticketDate = document.querySelector("#ticket-date");
const ticketTime = document.querySelector("#ticket-time");
const ticketPoster = document.querySelector(".ticket-poster");
const megaModeButton = document.querySelector("#mega-mode-btn");
const megaModeTransition = document.querySelector("#mega-mode-transition");

const movies = [
  {
    title: "INTERSTELLAR",
    image: "../img/인터스텔라.png",
    genre: "Adventure, Drama, Sci-Fi",
    year: "2014",
    runtime: "169min",
    director: "Christopher Nolan",
    description: "A journey beyond the stars where time, love, and humanity meet. Choose a date, then tap a showtime to continue."
  },
  {
    title: "DOCTOR STRANGE",
    image: "../img/닥터스트레인지.jpg",
    genre: "Action, Adventure, Fantasy",
    year: "2016",
    runtime: "115min",
    director: "Scott Derrickson",
    description: "A brilliant surgeon enters a hidden world of mystic arts and impossible dimensions. Choose a date, then tap a showtime to continue."
  },
  {
    title: "LIFE",
    image: "../img/라이프.jpg",
    genre: "Horror, Sci-Fi, Thriller",
    year: "2017",
    runtime: "104min",
    director: "Daniel Espinosa",
    description: "A space crew discovers a life form that may threaten every living thing on Earth. Choose a date, then tap a showtime to continue."
  },
  {
    title: "JOHN WICK",
    image: "../img/john-wick.jpg",
    genre: "Action, Crime, Thriller",
    year: "2019",
    runtime: "131min",
    director: "Chad Stahelski",
    description: "The legendary assassin returns through a neon world of danger, loyalty, and revenge. Choose a date, then tap a showtime to continue."
  }
];

const dates = [
  { day: "MON", date: "21", full: "Dec 21, 2026" },
  { day: "TUE", date: "22", full: "Dec 22, 2026" },
  { day: "WED", date: "23", full: "Dec 23, 2026" },
  { day: "THU", date: "24", full: "Dec 24, 2026" },
  { day: "FRI", date: "25", full: "Dec 25, 2026" }
];

const times = ["09:40", "11:35", "13:15", "15:20", "17:40"];
let selectedMovieIndex = 0;
let selectedDateIndex = 2;
let selectedTimeIndex = 2;
let movieSearchQuery = "";

const seatLayout = [
  { row: "A", seats: ["available", "available", "available", "available", "available", "dim", "dim", "dim", "available", "dim"] },
  { row: "B", seats: ["reserved", "available", "available", "available", "available", "available", "reserved", "reserved", "reserved", "available"] },
  { row: "C", seats: ["available", "available", "available", "available", "empty", "reserved", "reserved", "reserved", "reserved", "reserved"] },
  { row: "D", seats: ["dim", "available", "available", "available", "empty", "reserved", "available", "available", "reserved", "available"] },
  { row: "E", seats: ["available", "dim", "available", "available", "empty", "reserved", "available", "available", "available", "reserved"] },
  { row: "G", seats: ["reserved", "reserved", "available", "available", "empty", "available", "available", "available", "reserved", "empty"] },
  { row: "H", seats: ["reserved", "reserved", "reserved", "reserved", "empty", "available", "available", "available", "reserved", "empty"] },
  { row: "I", seats: ["reserved", "reserved", "reserved", "reserved", "empty", "reserved", "reserved", "dim", "reserved", "empty"] }
];
const selectedSeats = new Set(["G3", "G4"]);
const ticketPrice = 15;
let toastTimer;
let ticketTransitionRunning = false;
let megaModeTransitionRunning = false;
let ticketAnimationFrame = 0;

const ticketTextureCanvas = document.createElement("canvas");
ticketTextureCanvas.width = 636;
ticketTextureCanvas.height = 830;
const ticketTextureContext = ticketTextureCanvas.getContext("2d");
const ticketPosterImage = new Image();
ticketPosterImage.src = movies[0].image;

function roundedRectPath(context, x, y, width, height, radius) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawTicketTexture() {
  const context = ticketTextureContext;
  const width = ticketTextureCanvas.width;
  const height = ticketTextureCanvas.height;
  const posterHeight = 470;

  context.clearRect(0, 0, width, height);
  context.save();
  roundedRectPath(context, 4, 4, width - 8, height - 8, 38);
  context.clip();

  context.fillStyle = "#080615";
  context.fillRect(0, 0, width, height);

  if (ticketPosterImage.complete && ticketPosterImage.naturalWidth) {
    const sourceWidth = ticketPosterImage.naturalWidth;
    const sourceHeight = Math.min(ticketPosterImage.naturalHeight, sourceWidth * 1.12);
    const sourceY = Math.max(0, ticketPosterImage.naturalHeight * 0.19);
    context.drawImage(ticketPosterImage, 0, sourceY, sourceWidth, sourceHeight, 0, 0, width, posterHeight);
  } else {
    const posterGradient = context.createRadialGradient(width / 2, 260, 20, width / 2, 260, 390);
    posterGradient.addColorStop(0, "#170b31");
    posterGradient.addColorStop(0.48, "#2e1155");
    posterGradient.addColorStop(1, "#070513");
    context.fillStyle = posterGradient;
    context.fillRect(0, 0, width, posterHeight);
  }

  const darkOverlay = context.createLinearGradient(0, 0, 0, posterHeight);
  darkOverlay.addColorStop(0, "rgba(3,2,12,.42)");
  darkOverlay.addColorStop(0.5, "rgba(3,2,12,.16)");
  darkOverlay.addColorStop(1, "rgba(4,2,15,.48)");
  context.fillStyle = darkOverlay;
  context.fillRect(0, 0, width, posterHeight);

  context.fillStyle = "rgba(255,255,255,.9)";
  context.font = "400 37px Arial";
  context.textAlign = "center";
  context.letterSpacing = "10px";
  context.fillText(movies[selectedMovieIndex].title.split("").join(" "), width / 2, 100);

  const infoGradient = context.createLinearGradient(0, posterHeight, width, height);
  infoGradient.addColorStop(0, "#9a82c8");
  infoGradient.addColorStop(1, "#65508f");
  context.fillStyle = infoGradient;
  context.fillRect(0, posterHeight, width, height - posterHeight);

  const columns = [95, 376];
  const rows = [548, 660];
  const labels = [["Date", "Time"], ["Screen", "Seats"]];
  const values = [[dates[selectedDateIndex].full, times[selectedTimeIndex]], ["4DX", [...selectedSeats].join(", ")]];

  context.textAlign = "left";
  rows.forEach((rowY, rowIndex) => {
    columns.forEach((columnX, columnIndex) => {
      context.fillStyle = "rgba(24,17,40,.56)";
      context.font = "400 20px Arial";
      context.fillText(labels[rowIndex][columnIndex], columnX, rowY);
      context.fillStyle = "#171122";
      context.font = "600 24px Arial";
      context.fillText(values[rowIndex][columnIndex], columnX, rowY + 43);
    });
  });

  context.fillStyle = "#100b19";
  let barcodeX = 92;
  const barcodeY = 746;
  const barcodeHeight = 58;
  const barcodeWidths = [3, 2, 5, 2, 3, 6, 2, 4, 2, 7, 3, 2, 5, 3, 6, 2, 4, 3, 2, 6];
  for (let index = 0; barcodeX < 548; index += 1) {
    const barWidth = barcodeWidths[index % barcodeWidths.length];
    context.fillRect(barcodeX, barcodeY, barWidth, barcodeHeight);
    barcodeX += barWidth + (index % 3 === 0 ? 4 : 3);
  }

  context.restore();

  context.save();
  context.globalCompositeOperation = "destination-out";
  context.beginPath();
  context.arc(4, posterHeight, 27, 0, Math.PI * 2);
  context.arc(width - 4, posterHeight, 27, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  roundedRectPath(context, 4, 4, width - 8, height - 8, 38);
  context.strokeStyle = "rgba(191,116,255,.72)";
  context.lineWidth = 3;
  context.shadowColor = "rgba(147,54,255,.55)";
  context.shadowBlur = 14;
  context.stroke();
  context.restore();
}

drawTicketTexture();

const ticketRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
ticketRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
ticketRenderer.setClearColor(0x000000, 0);
ticketRenderer.outputColorSpace = THREE.SRGBColorSpace;
ticket3dOverlay.append(ticketRenderer.domElement);

const ticketScene = new THREE.Scene();
const ticketCamera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
ticketCamera.position.z = 13.5;

const ticketGroup = new THREE.Group();
ticketScene.add(ticketGroup);

const ticketCanvasTexture = new THREE.CanvasTexture(ticketTextureCanvas);
ticketCanvasTexture.colorSpace = THREE.SRGBColorSpace;
ticketCanvasTexture.anisotropy = ticketRenderer.capabilities.getMaxAnisotropy();
ticketPosterImage.addEventListener("load", () => {
  drawTicketTexture();
  ticketCanvasTexture.needsUpdate = true;
});

const ticketFront = new THREE.Mesh(
  new THREE.PlaneGeometry(3.18, 4.15),
  new THREE.MeshBasicMaterial({ map: ticketCanvasTexture, transparent: true, side: THREE.FrontSide })
);
ticketFront.position.z = 0.061;
ticketGroup.add(ticketFront);

const ticketBack = new THREE.Mesh(
  new THREE.PlaneGeometry(3.18, 4.15),
  new THREE.MeshStandardMaterial({
    color: 0x160b35,
    roughness: 0.34,
    metalness: 0.34,
    side: THREE.BackSide
  })
);
ticketBack.position.z = -0.061;
ticketGroup.add(ticketBack);

const ticketDepth = new THREE.Mesh(
  new THREE.BoxGeometry(3.1, 4.07, 0.11),
  new THREE.MeshStandardMaterial({ color: 0x2d1262, roughness: 0.28, metalness: 0.48 })
);
ticketGroup.add(ticketDepth);

const rimGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(3.12, 4.09, 0.13));
const rimMaterial = new THREE.LineBasicMaterial({ color: 0xc873ff, transparent: true, opacity: 0.68 });
const ticket3dRim = new THREE.LineSegments(rimGeometry, rimMaterial);
ticketGroup.add(ticket3dRim);

ticketScene.add(new THREE.AmbientLight(0x9d7cff, 1.1));
const ticketKeyLight = new THREE.PointLight(0xd78bff, 18, 20);
ticketKeyLight.position.set(-3.4, 3.2, 5);
ticketScene.add(ticketKeyLight);
const ticketFillLight = new THREE.PointLight(0x3b5cff, 10, 20);
ticketFillLight.position.set(3.2, -2.8, 3);
ticketScene.add(ticketFillLight);

function resizeTicketRenderer() {
  const width = phoneShell.clientWidth;
  const height = phoneShell.clientHeight;
  ticketRenderer.setSize(width, height, false);
  ticketCamera.aspect = width / height;
  ticketCamera.updateProjectionMatrix();
}

resizeTicketRenderer();
window.addEventListener("resize", resizeTicketRenderer);

function getDialOffset(index, selectedIndex, length) {
  let offset = index - selectedIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return Math.abs(offset) > 2 ? "hidden" : String(offset);
}

function initializeMovieDial() {
  movies.forEach((movie, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "movie-card";
    card.dataset.index = String(index);
    card.setAttribute("aria-label", `${movie.title} 선택`);
    card.style.backgroundImage = `url("${movie.image}")`;

    const image = document.createElement("img");
    image.src = movie.image;
    image.alt = `${movie.title} poster`;
    image.loading = "eager";
    image.decoding = "sync";
    card.append(image);

    card.addEventListener("click", () => {
      selectMovie(index);
    });

    movieDial.append(card);
  });
}

function updateMovieDial() {
  movieDial.querySelectorAll(".movie-card").forEach((card) => {
    const index = Number(card.dataset.index);
    const movie = movies[index];
    const searchText = `${movie.title} ${movie.genre} ${movie.director}`.toLowerCase();
    const matchesSearch = !movieSearchQuery || searchText.includes(movieSearchQuery);
    card.dataset.offset = getDialOffset(index, selectedMovieIndex, movies.length);
    card.classList.toggle("search-hidden", !matchesSearch);
    card.setAttribute("aria-pressed", String(index === selectedMovieIndex));
  });
}

function selectMovie(index) {
  selectedMovieIndex = (index + movies.length) % movies.length;
  const movie = movies[selectedMovieIndex];
  movieCopy.classList.add("changing");
  movieHero.classList.remove("hero-changing");
  void movieHero.offsetWidth;
  movieHero.classList.add("hero-changing");

  window.setTimeout(() => {
    movieName.textContent = movie.title;
    movieGenre.textContent = movie.genre;
    movieYear.textContent = movie.year;
    movieRuntime.textContent = movie.runtime;
    movieDirector.textContent = movie.director;
    movieHero.style.backgroundImage = `url("${movie.image}")`;
    movieCopy.classList.remove("changing");
  }, 150);

  window.setTimeout(() => movieHero.classList.remove("hero-changing"), 620);
  updateMovieDial();
}

function initializeScheduleDial(container, items, className, labelBuilder) {
  items.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.dataset.index = String(index);
    button.innerHTML = labelBuilder(item);
    button.addEventListener("click", () => {
      if (className === "date-card") {
        selectedDateIndex = index;
      }
      if (className === "time-card") {
        if (selectedTimeIndex === index) {
          showScreen(seatScreen, scheduleScreen);
          return;
        }
        selectedTimeIndex = index;
      }
      updateScheduleDials();
    });
    container.append(button);
  });
}

function updateScheduleDial(container, selectedIndex, length) {
  container.querySelectorAll("button").forEach((button) => {
    const index = Number(button.dataset.index);
    button.dataset.offset = getDialOffset(index, selectedIndex, length);
    button.setAttribute("aria-pressed", String(index === selectedIndex));
  });
}

function updateScheduleDials() {
  updateScheduleDial(dateDial, selectedDateIndex, dates.length);
  updateScheduleDial(timeDial, selectedTimeIndex, times.length);
  ticketDate.textContent = dates[selectedDateIndex].full;
  ticketTime.textContent = times[selectedTimeIndex];
}

function openScheduleScreen() {
  const movie = movies[selectedMovieIndex];
  scheduleHero.style.backgroundImage = `url("${movie.image}")`;
  scheduleMovieName.textContent = movie.title;
  scheduleDescription.textContent = movie.description;
  ticketMovieTitle.textContent = movie.title;
  ticketPoster.style.backgroundImage = `linear-gradient(180deg, rgba(3,2,12,.28), rgba(3,2,12,.08) 48%, rgba(5,3,18,.32)), url("${movie.image}")`;
  ticketPosterImage.src = movie.image;
  updateScheduleDials();
  showScreen(scheduleScreen, movieScreen);
}

function moveMovieDial(direction) {
  selectMovie(selectedMovieIndex + direction);
}

function moveDateDial(direction) {
  selectedDateIndex = Math.max(0, Math.min(dates.length - 1, selectedDateIndex + direction));
  updateScheduleDials();
}

function moveTimeDial(direction) {
  selectedTimeIndex = Math.max(0, Math.min(times.length - 1, selectedTimeIndex + direction));
  updateScheduleDials();
}

function enableSwipe(element, onSwipe) {
  let startX = 0;
  let startY = 0;
  let tracking = false;
  let swiped = false;

  element.addEventListener("pointerdown", (event) => {
    tracking = true;
    swiped = false;
    startX = event.clientX;
    startY = event.clientY;
    element.classList.add("is-touching");
  });

  element.addEventListener("pointerup", (event) => {
    if (!tracking) return;
    tracking = false;
    element.classList.remove("is-touching");
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaX) > 18 && Math.abs(deltaX) > Math.abs(deltaY)) {
      swiped = true;
      onSwipe(deltaX < 0 ? 1 : -1);
    }
  });

  element.addEventListener("pointercancel", () => {
    tracking = false;
    element.classList.remove("is-touching");
  });

  element.addEventListener("click", (event) => {
    if (!swiped) return;
    event.preventDefault();
    event.stopPropagation();
    swiped = false;
  }, true);

  element.addEventListener("lostpointercapture", () => {
    tracking = false;
    element.classList.remove("is-touching");
  });
}

function getSeatPosition(seatId) {
  const row = seatId.slice(0, 1);
  const column = Number(seatId.slice(1));
  const rowIndex = seatLayout.findIndex((item) => item.row === row);
  const visualColumn = column > 5 ? column + 1.6 : column;

  return { rowIndex, visualColumn };
}

function getReflectionLevel(seatId) {
  if (selectedSeats.has(seatId)) return "";

  const seatPosition = getSeatPosition(seatId);
  let closestDistance = Number.POSITIVE_INFINITY;

  selectedSeats.forEach((selectedSeatId) => {
    const selectedPosition = getSeatPosition(selectedSeatId);
    const rowDistance = seatPosition.rowIndex - selectedPosition.rowIndex;
    const columnDistance = seatPosition.visualColumn - selectedPosition.visualColumn;
    const distance = Math.hypot(rowDistance, columnDistance);
    closestDistance = Math.min(closestDistance, distance);
  });

  if (closestDistance <= 1.15) return "reflected-strong";
  if (closestDistance <= 2.15) return "reflected";
  return "";
}

function createSeat(seatId, state) {
  if (state === "empty") {
    const spacer = document.createElement("span");
    spacer.className = "seat-space";
    spacer.setAttribute("aria-hidden", "true");
    return spacer;
  }

  const seat = document.createElement("button");
  seat.type = "button";
  seat.className = "seat";
  seat.dataset.seat = seatId;
  seat.classList.add(Number(seatId.slice(1)) <= 5 ? "left-bank" : "right-bank");
  seat.setAttribute("aria-label", `${seatId} seat`);
  seat.setAttribute("aria-pressed", selectedSeats.has(seatId) ? "true" : "false");

  const seatTop = document.createElement("span");
  seatTop.className = "seat-top";
  seat.append(seatTop);

  if (state === "reserved" || state === "dim") {
    seat.classList.add("reserved");
    seat.disabled = true;
    seat.setAttribute("aria-label", `${seatId} seat, reserved`);
  } else if (selectedSeats.has(seatId)) {
    seat.classList.add("selected");
  }

  const reflectionLevel = getReflectionLevel(seatId);
  if (reflectionLevel) seat.classList.add(reflectionLevel);

  seat.addEventListener("click", () => toggleSeat(seatId));
  return seat;
}

function renderSeats() {
  seatMap.replaceChildren();

  seatLayout.forEach(({ row, seats }) => {
    const rowElement = document.createElement("div");
    rowElement.className = "seat-row";

    const rowLabel = document.createElement("span");
    rowLabel.className = "row-label";
    rowLabel.textContent = row;

    const rowSeats = document.createElement("div");
    rowSeats.className = "seat-row-seats";

    seats.forEach((state, index) => rowSeats.append(createSeat(`${row}${index + 1}`, state)));

    rowElement.append(rowLabel, rowSeats);
    seatMap.append(rowElement);
  });
}

function toggleSeat(seatId) {
  if (selectedSeats.has(seatId)) {
    selectedSeats.delete(seatId);
  } else {
    selectedSeats.add(seatId);
  }

  renderSeats();
  updateSummary();
}

function updateSummary() {
  const seats = [...selectedSeats];
  const count = seats.length;
  const seatText = count ? seats.join(", ") : "Select seats";

  selectedSeatsLabel.textContent = seatText;
  seatCountLabel.textContent = `${count} ${count === 1 ? "Seat" : "Seats"}`;
  priceLabel.textContent = `$${(count * ticketPrice).toFixed(2)}`;
  ticketSeatsLabel.textContent = count ? seats.join(", ") : "-";
  nextButton.disabled = count === 0;
  drawTicketTexture();
  ticketCanvasTexture.needsUpdate = true;
}

function showScreen(nextScreen, currentScreen, direction = "forward") {
  if (!nextScreen || !currentScreen || nextScreen === currentScreen) return;

  const exitClass = direction === "back" ? "exit-right" : "exit-left";
  const enterClass = direction === "back" ? "screen-entering-back" : "screen-entering";

  currentScreen.classList.add(exitClass);
  currentScreen.classList.remove("active");
  nextScreen.classList.remove("screen-entering", "screen-entering-back", "exit-left", "exit-right");
  nextScreen.classList.add("active", enterClass);
  phoneShell.classList.toggle("light-mode", nextScreen === homeScreen || nextScreen === spotScreen || nextScreen === spotSeatScreen);

  window.setTimeout(() => {
    currentScreen.classList.remove("exit-left", "exit-right");
    nextScreen.classList.remove("screen-entering", "screen-entering-back");
  }, 640);
}

function activateMegaMode() {
  if (megaModeTransitionRunning) return;
  megaModeTransitionRunning = true;

  const shellRect = phoneShell.getBoundingClientRect();
  const W = shellRect.width || 402, H = shellRect.height || 874;

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  canvas.style.zIndex = "90";
  canvas.style.pointerEvents = "none";
  phoneShell.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  homeScreen.classList.add("mode-leaving");

  let _s = 31;
  const rng = () => { _s = (_s * 1664525 + 1013904223) >>> 0; return _s / 4294967296; };

  // ── Infection blobs with spike protrusions ─────────────────────
  const PTS = 72;
  const blobs = [
    { cx: W * .50, cy: H - 42,  maxR: H * 1.52, delay: 0.000 },
    { cx: W * .28, cy: H + 32,  maxR: H * 1.14, delay: 0.015 },
    { cx: W * .72, cy: H + 32,  maxR: H * 1.14, delay: 0.015 },
    { cx: W * .07, cy: H + 52,  maxR: H * 1.00, delay: 0.004 },
    { cx: W * .93, cy: H + 52,  maxR: H * 1.00, delay: 0.004 },
    { cx: W * .18, cy: H + 74,  maxR: H * 0.86, delay: 0.033 },
    { cx: W * .82, cy: H + 74,  maxR: H * 0.86, delay: 0.033 },
    { cx: W * .50, cy: H + 100, maxR: H * 0.80, delay: 0.050 },
    { cx: W * .40, cy: H + 120, maxR: H * 0.68, delay: 0.065 },
    { cx: W * .60, cy: H + 120, maxR: H * 0.68, delay: 0.065 },
  ].map(b => ({
    ...b,
    freqs:       Array.from({ length: 8 }, () => 1.2 + rng() * 5.4),
    amps:        Array.from({ length: 8 }, () => 0.06 + rng() * 0.28),
    phases:      Array.from({ length: 8 }, () => rng() * Math.PI * 2),
    spikeAngles: Array.from({ length: 6 }, () => rng() * Math.PI * 2),
    spikeWidths: Array.from({ length: 6 }, () => 0.04 + rng() * 0.08),
    spikeMults:  Array.from({ length: 6 }, () => 1.7 + rng() * 2.0),
  }));

  // ── Creep fingers with branching ──────────────────────────────
  const N_CR = 20;
  const creeps = Array.from({ length: N_CR }, (_, i) => ({
    x:         W * (0.04 + 0.92 * (i / (N_CR - 1))) + (rng() - 0.5) * W * 0.05,
    maxLen:    H * (0.52 + rng() * 0.74),
    segs:      30,
    wFreq:     1.5 + rng() * 4.2,
    wAmp:      5   + rng() * 24,
    wPhase:    rng() * Math.PI * 2,
    width:     0.5 + rng() * 1.6,
    delay:     rng() * 0.09,
    prog:      0,
    branchAt:  0.40 + rng() * 0.35,
    branchDir: (rng() - 0.5) * 0.9,
    branchLen: 0.28 + rng() * 0.44,
  }));

  // ── Veins ─────────────────────────────────────────────────────
  const veins = Array.from({ length: 16 }, (_, i) => ({
    x0:    W * (0.06 + 0.88 * (i / 15)),
    nodes: Array.from({ length: 8 }, (__, k) => ({ dx: (rng() - 0.5) * 40, fracY: (k + 1) / 8 })),
    len:   H * (0.30 + rng() * 0.58),
    width: 0.4 + rng() * 1.0,
    delay: rng() * 0.12,
    prog:  0,
  }));

  // ── Spores ────────────────────────────────────────────────────
  const spores = Array.from({ length: 80 }, (_, i) => ({
    x: rng() * W, y: H + rng() * 100,
    vy: -(1.2 + rng() * 3.8), vx: (rng() - 0.5) * 1.4,
    r:       0.6 + rng() * 2.8,
    hue:     252 + rng() * 78,
    maxA:    0.22 + rng() * 0.62,
    life:    0,
    span:    0.38 + rng() * 1.0,
    startAt: i * 0.012,
  }));

  // ── Bio cells — pulsing organisms inside the dark mass ────────
  const cells = Array.from({ length: 24 }, () => ({
    x:       W * (0.08 + rng() * 0.84),
    y:       H * (0.35 + rng() * 0.58),
    r:       3 + rng() * 9,
    hue:     240 + rng() * 65,
    phase:   rng() * Math.PI * 2,
    spd:     0.6 + rng() * 1.6,
    startAt: 0.18 + rng() * 0.32,
  }));

  // ── Scanline corruption flickers at the frontier ──────────────
  const scanlines = Array.from({ length: 9 }, () => ({
    y:       H * (0.10 + rng() * 0.76),
    width:   1.0 + rng() * 3.5,
    phase:   rng() * Math.PI * 2,
    spd:     2.5 + rng() * 5.5,
    startAt: 0.08 + rng() * 0.38,
  }));

  const DUR  = 2200;
  const MID  = 0.42;
  const FULL = 0.70;
  let t0 = null, midFired = false, doneFired = false;

  function blobR(b, p) {
    const lp = p <= b.delay ? 0 : Math.min(1, (p - b.delay) / (1 - b.delay));
    const e = 1 - Math.pow(1 - lp, 2.4);
    // subtle breathing pulse as it grows
    return b.maxR * e * (1 + Math.sin(lp * Math.PI * 7) * 0.012 * lp);
  }

  function tracePath(b, p) {
    const r = blobR(b, p);
    if (r < 1) return;
    const w = p * 8.0;
    const spikeGrow = Math.max(0, Math.min(1, (p - 0.08) * 5));
    for (let i = 0; i <= PTS; i++) {
      const a = (i / PTS) * Math.PI * 2;
      let d = 1;
      for (let j = 0; j < b.freqs.length; j++)
        d += Math.sin(a * b.freqs[j] + b.phases[j] + w * (0.42 + j * 0.24)) * b.amps[j];
      // spike fingers reaching ahead of the main mass
      let sm = 1;
      for (let s = 0; s < b.spikeAngles.length; s++) {
        const diff = Math.abs(((a - b.spikeAngles[s] + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        if (diff < b.spikeWidths[s]) {
          const sp = 1 - diff / b.spikeWidths[s];
          sm = Math.max(sm, 1 + (b.spikeMults[s] - 1) * sp * sp * spikeGrow);
        }
      }
      const vr = r * Math.max(0.10, d) * sm;
      const x = b.cx + Math.cos(a) * vr, y = b.cy + Math.sin(a) * vr;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function frame(ts) {
    if (!t0) t0 = ts;
    const p = Math.min(1, (ts - t0) / DUR);
    ctx.clearRect(0, 0, W, H);

    // ⓪ Initial burst from button with concentric rings
    if (p < 0.14) {
      const pr = p / 0.14;
      const pulseR = W * 0.68 * pr;
      ctx.save();
      ctx.beginPath();
      ctx.arc(W * 0.5, H - 44, pulseR, 0, Math.PI * 2);
      const pg = ctx.createRadialGradient(W * 0.5, H - 44, 0, W * 0.5, H - 44, pulseR);
      pg.addColorStop(0,    `rgba(190,65,255,${(1 - pr) * 0.96})`);
      pg.addColorStop(0.42, `rgba(130,22,238,${(1 - pr) * 0.58})`);
      pg.addColorStop(0.78, `rgba(80,8,185,${(1 - pr) * 0.26})`);
      pg.addColorStop(1,    "rgba(40,2,120,0)");
      ctx.fillStyle = pg;
      ctx.shadowColor = "rgba(230,96,255,0.96)";
      ctx.shadowBlur = 65;
      ctx.fill();
      ctx.restore();
      for (let ring = 0; ring < 3; ring++) {
        const rr = pulseR * (0.28 + ring * 0.28);
        const ra = (1 - pr) * (1 - ring * 0.32);
        if (ra < 0.04) continue;
        ctx.save();
        ctx.beginPath();
        ctx.arc(W * 0.5, H - 44, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(210,105,255,${ra * 0.62})`;
        ctx.lineWidth = 1.6 - ring * 0.45;
        ctx.shadowColor = "rgba(210,105,255,0.82)";
        ctx.shadowBlur = 22;
        ctx.stroke();
        ctx.restore();
      }
    }

    if (p >= FULL) {
      const a = Math.min(1, (p - FULL) / 0.13);
      ctx.fillStyle = `rgba(5,4,18,${a})`;
      ctx.fillRect(0, 0, W, H);
    }

    if (p < FULL + 0.09) {
      const now = performance.now() * 0.001;

      // ① Blob mass — deep purple gradient fill
      const grad = ctx.createLinearGradient(0, H, 0, 0);
      grad.addColorStop(0,    "rgba(128,0,255,0.98)");
      grad.addColorStop(0.22, "rgba(78,5,205,0.98)");
      grad.addColorStop(0.48, "rgba(30,4,95,0.99)");
      grad.addColorStop(0.78, "rgba(12,3,42,1)");
      grad.addColorStop(1,    "rgba(5,4,18,1)");
      ctx.save();
      ctx.beginPath();
      blobs.forEach(b => tracePath(b, p));
      ctx.fillStyle = grad;
      ctx.shadowColor = "rgba(155,48,255,0.75)";
      ctx.shadowBlur = 85;
      ctx.fill("nonzero");
      ctx.restore();

      // ② Screen glow pass
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const gw = ctx.createRadialGradient(W * 0.5, H * 0.85, 0, W * 0.5, H * 0.85, W);
      gw.addColorStop(0,   `rgba(172,62,255,${Math.min(.28, p * .58)})`);
      gw.addColorStop(0.5, `rgba(95,18,215,${Math.min(.13, p * .28)})`);
      gw.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath();
      blobs.forEach(b => tracePath(b, p));
      ctx.fillStyle = gw;
      ctx.fill("nonzero");
      ctx.restore();

      // ③ Chromatic aberration edge — RGB split at the infection frontier
      const ea = Math.min(1, p * 7) * Math.max(0, 1 - (p - FULL) / 0.05);
      if (ea > 0.01) {
        ctx.save();
        ctx.translate(-2.5, 0);
        ctx.lineWidth = 2.0;
        ctx.shadowColor = "rgba(255,55,85,0.55)";
        ctx.shadowBlur = 12;
        blobs.forEach(b => {
          ctx.beginPath();
          tracePath(b, p);
          ctx.strokeStyle = `rgba(255,55,85,${ea * 0.40})`;
          ctx.stroke();
        });
        ctx.restore();

        ctx.save();
        ctx.translate(2.5, 0);
        ctx.lineWidth = 2.0;
        ctx.shadowColor = "rgba(90,210,255,0.55)";
        ctx.shadowBlur = 12;
        blobs.forEach(b => {
          ctx.beginPath();
          tracePath(b, p);
          ctx.strokeStyle = `rgba(90,210,255,${ea * 0.40})`;
          ctx.stroke();
        });
        ctx.restore();

        ctx.save();
        ctx.lineWidth = 2.8;
        ctx.shadowColor = "rgba(232,112,255,1)";
        ctx.shadowBlur = 55;
        blobs.forEach(b => {
          ctx.beginPath();
          tracePath(b, p);
          ctx.strokeStyle = `rgba(218,92,255,${ea * 0.92})`;
          ctx.stroke();
        });
        ctx.restore();
      }

      // ④ Creep fingers with branching
      const ta = Math.min(1, p * 10) * Math.max(0, 1 - (p - FULL * 0.60) / 0.16);
      if (ta > 0.01) {
        ctx.save();
        ctx.lineCap = "round";
        creeps.forEach(tr => {
          if (p < tr.delay) return;
          tr.prog = Math.min(1, tr.prog + 0.016);
          const len = tr.maxLen * tr.prog;
          if (len < 4) return;
          // main finger
          ctx.beginPath();
          ctx.moveTo(tr.x, H);
          for (let s = 1; s <= tr.segs; s++) {
            const f = s / tr.segs;
            const y = H - len * f;
            const xo = Math.sin(f * tr.wFreq * Math.PI + tr.wPhase + now * 2.1) * tr.wAmp * (1 - f * 0.56);
            ctx.lineTo(tr.x + xo, y);
          }
          const tg = ctx.createLinearGradient(0, H, 0, H - len);
          tg.addColorStop(0,    `rgba(232,96,255,${ta * 0.97})`);
          tg.addColorStop(0.38, `rgba(188,62,248,${ta * 0.44})`);
          tg.addColorStop(1,    "rgba(155,38,226,0)");
          ctx.strokeStyle = tg;
          ctx.lineWidth = tr.width;
          ctx.shadowColor = "rgba(222,90,255,0.96)";
          ctx.shadowBlur = 30;
          ctx.stroke();
          // branch off main finger
          if (tr.prog > tr.branchAt) {
            const bp  = Math.min(1, (tr.prog - tr.branchAt) / (1 - tr.branchAt));
            const bsF = tr.branchAt;
            const bsY = H - len * bsF;
            const bsX = tr.x + Math.sin(bsF * tr.wFreq * Math.PI + tr.wPhase + now * 2.1) * tr.wAmp * (1 - bsF * 0.56);
            const bLen = len * bp * tr.branchLen;
            if (bLen > 3) {
              ctx.beginPath();
              ctx.moveTo(bsX, bsY);
              for (let s = 1; s <= 18; s++) {
                const f = s / 18;
                const y = bsY - bLen * f;
                const xo = Math.sin(f * tr.wFreq * 1.4 * Math.PI + tr.wPhase + 1.9 + now * 2.8) * tr.wAmp * 0.52 * (1 - f * 0.5);
                ctx.lineTo(bsX + xo + tr.branchDir * bLen * f, y);
              }
              const bg = ctx.createLinearGradient(0, bsY, 0, bsY - bLen);
              bg.addColorStop(0, `rgba(205,78,250,${ta * 0.72})`);
              bg.addColorStop(1, "rgba(162,42,232,0)");
              ctx.strokeStyle = bg;
              ctx.lineWidth = tr.width * 0.55;
              ctx.shadowBlur = 20;
              ctx.stroke();
            }
          }
        });
        ctx.restore();
      }

      // ⑤ Veins — bright filaments threading through the mass
      const va = Math.min(1, p * 6) * Math.max(0, 1 - (p - FULL * 0.5) / 0.22);
      if (va > 0.01) {
        ctx.save();
        ctx.lineCap = "round";
        veins.forEach(v => {
          if (p < v.delay) return;
          v.prog = Math.min(1, v.prog + 0.014);
          const len = v.len * v.prog;
          if (len < 3) return;
          ctx.beginPath();
          ctx.moveTo(v.x0, H);
          let cx2 = v.x0;
          for (let k = 0; k < v.nodes.length; k++) {
            const nd = v.nodes[k];
            const f = nd.fracY;
            if (f * len > len) break;
            cx2 += nd.dx * 0.35 + Math.sin(now * 1.4 + k) * 2;
            ctx.lineTo(cx2, H - f * len);
          }
          const vg = ctx.createLinearGradient(0, H, 0, H - len);
          vg.addColorStop(0,   `rgba(200,120,255,${va * 0.78})`);
          vg.addColorStop(0.6, `rgba(150,210,255,${va * 0.38})`);
          vg.addColorStop(1,   "rgba(130,230,255,0)");
          ctx.strokeStyle = vg;
          ctx.lineWidth = v.width;
          ctx.shadowColor = "rgba(180,200,255,0.72)";
          ctx.shadowBlur = 14;
          ctx.stroke();
        });
        ctx.restore();
      }

      // ⑥ Bio cells — glowing organisms pulsing inside the dark mass
      const cellA = Math.max(0, Math.min(1, (p - 0.18) * 5)) * Math.max(0, 1 - (p - 0.62) * 4);
      if (cellA > 0.01) {
        ctx.save();
        cells.forEach(c => {
          if (p < c.startAt) return;
          const pulse = 0.72 + 0.28 * Math.sin(now * c.spd + c.phase);
          const cr = c.r * pulse;
          const a  = cellA * 0.72;
          ctx.beginPath();
          ctx.arc(c.x, c.y, cr, 0, Math.PI * 2);
          const cg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, cr);
          cg.addColorStop(0,   `hsla(${c.hue},82%,76%,${a})`);
          cg.addColorStop(0.5, `hsla(${c.hue},72%,56%,${a * 0.5})`);
          cg.addColorStop(1,   `hsla(${c.hue},62%,42%,0)`);
          ctx.fillStyle = cg;
          ctx.shadowColor = `hsla(${c.hue},86%,66%,0.88)`;
          ctx.shadowBlur = 22;
          ctx.fill();
        });
        ctx.restore();
      }

      // ⑦ Scanline corruption — horizontal flickers at infection boundary
      if (p > 0.07 && p < FULL + 0.04) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        scanlines.forEach(sl => {
          if (p < sl.startAt) return;
          const flicker = Math.sin(now * sl.spd + sl.phase) * Math.sin(now * sl.spd * 2.4 + 1.2);
          const scanA   = Math.max(0, flicker) * 0.38 * Math.max(0, 1 - (p - FULL) / 0.06);
          if (scanA < 0.03) return;
          ctx.fillStyle = `rgba(200,120,255,${scanA})`;
          ctx.fillRect(0, sl.y - sl.width * 0.5, W, sl.width);
        });
        ctx.restore();
      }
    }

    // ⑧ Spores — tiny glowing particles drifting upward
    if (p > 0.04) {
      ctx.save();
      ctx.shadowBlur = 20;
      spores.forEach(sp => {
        if (p < sp.startAt) return;
        sp.y += sp.vy * 0.56; sp.x += sp.vx * 0.22;
        sp.life += 0.013;
        if (sp.y < -28) { sp.y = H + 10; sp.x = Math.random() * W; sp.life = 0; }
        const lt = Math.min(1, sp.life / sp.span);
        const a  = sp.maxA * Math.sin(Math.PI * lt) * Math.min(1, (p - sp.startAt) * 9);
        if (a < 0.01) return;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${sp.hue},90%,74%,${a})`;
        ctx.shadowColor = `hsla(${sp.hue},94%,66%,0.90)`;
        ctx.fill();
      });
      ctx.restore();
    }

    if (!midFired && p >= MID) {
      midFired = true;
      homeScreen.classList.remove("active");
      movieScreen.classList.add("active");
      phoneShell.classList.remove("light-mode");
    }

    if (p < FULL + 0.07) {
      requestAnimationFrame(frame);
    } else if (!doneFired) {
      doneFired = true;
      const fs = performance.now();
      (function fadeOut(now) {
        const ft = Math.min(1, (now - fs - 110) / 540);
        canvas.style.opacity = String(Math.max(0, 1 - ft));
        if (ft < 1) requestAnimationFrame(fadeOut);
        else {
          canvas.remove();
          homeScreen.classList.remove("mode-leaving");
          megaModeTransitionRunning = false;
        }
      })(performance.now());
    }
  }

  requestAnimationFrame(frame);
}

function returnToHome() {
  const activeScreen = document.querySelector(".screen.active");
  if (!activeScreen || activeScreen === homeScreen) return;

  ticketScreen.classList.remove("ticket-arrived", "ticket-pending", "ticket-handoff");
  showScreen(homeScreen, activeScreen, "back");
}

function playThreeTicketTransition() {
  if (ticketTransitionRunning) return;

  ticketTransitionRunning = true;
  ticketScreen.classList.remove("ticket-arrived", "ticket-revealed");
  ticketScreen.classList.add("ticket-pending", "ticket-handoff");
  window.cancelAnimationFrame(ticketAnimationFrame);
  ticket3dOverlay.querySelectorAll(".ticket-3d-dom").forEach((element) => element.remove());

  const ticket3dDom = document.createElement("div");
  ticket3dDom.className = "ticket-3d-dom";
  ticket3dDom.append(document.querySelector(".ticket").cloneNode(true));
  ticket3dOverlay.append(ticket3dDom);

  ticket3dOverlay.classList.remove("settling");
  ticket3dOverlay.classList.add("active");

  const duration = window.location.hash === "#transition-slow" ? 6500 : 2250;
  const revealDelay = duration * 0.56;
  const revealTicketScreen = () => {
    seatScreen.classList.remove("active", "exit-left");
    ticketScreen.classList.add("active");
    ticketScreen.classList.remove("ticket-pending");
    ticketScreen.classList.add("ticket-arrived");
  };
  const revealTimer = window.setTimeout(revealTicketScreen, revealDelay);

  const spinStart = performance.now();
  let actualTicket = null;
  const smoothStep = (value) => value * value * (3 - 2 * value);
  const smootherStep = (value) => value ** 3 * (value * (value * 6 - 15) + 10);
  const animateTicketDom = (now) => {
    const progress = Math.min((now - spinStart) / duration, 1);
    const eased = smootherStep(progress);
    const lift = Math.sin(Math.PI * progress);
    const handoff = Math.max(0, Math.min(1, (progress - .82) / .18));
    const handoffEased = smootherStep(handoff);
    const rawRotationY = -36 + 396 * eased;
    const rawRotationX = 9 * (1 - eased) + Math.sin(progress * Math.PI * 2) * 1.15;
    const rawRotationZ = -3.5 * (1 - eased) + Math.sin(progress * Math.PI) * 1.35;
    const rawTranslateY = -39 - 11 * eased - lift * 1.2;
    const rawScale = 0.66 + 0.34 * eased + lift * 0.085;
    const rotationY = rawRotationY + (360 - rawRotationY) * handoffEased;
    const rotationX = rawRotationX * (1 - handoffEased);
    const rotationZ = rawRotationZ * (1 - handoffEased);
    const translateY = rawTranslateY + (-50 - rawTranslateY) * handoffEased;
    const scale = rawScale + (1 - rawScale) * handoffEased;

    ticket3dDom.style.opacity = String(Math.min(1, progress / 0.12));
    ticket3dDom.style.transform = `translate3d(-50%, ${translateY}%, 0) perspective(1200px) rotateY(${rotationY}deg) rotateX(${rotationX}deg) rotateZ(${rotationZ}deg) scale(${scale})`;

    if (progress >= .9 && !actualTicket) {
      revealTicketScreen();
      actualTicket = ticketScreen.querySelector(".ticket");
      ticketScreen.classList.remove("ticket-handoff");
    }

    if (progress < 1) {
      ticketAnimationFrame = window.requestAnimationFrame(animateTicketDom);
    } else {
      finishTransition();
    }
  };
  ticketAnimationFrame = window.requestAnimationFrame(animateTicketDom);

  let completed = false;
  const finishTransition = () => {
    if (completed) return;
    completed = true;
    window.clearTimeout(revealTimer);
    window.cancelAnimationFrame(ticketAnimationFrame);
    revealTicketScreen();
    ticketScreen.classList.remove("ticket-handoff");
    if (actualTicket) actualTicket.style.removeProperty("opacity");
    ticket3dOverlay.classList.add("settling");

    window.setTimeout(() => {
      ticket3dOverlay.classList.remove("active", "settling");
      ticket3dDom.remove();
      ticketTransitionRunning = false;
    }, 320);
  };

  window.setTimeout(() => {
    if (completed) return;
    finishTransition();
  }, duration + 1500);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2100);
}

nextButton.addEventListener("click", () => {
  if (selectedSeats.size === 0) return;
  updateSummary();
  playThreeTicketTransition();
});

movieBuyButton.addEventListener("click", openScheduleScreen);
scheduleBackButton.addEventListener("click", () => showScreen(movieScreen, scheduleScreen, "back"));
scheduleNextButton.addEventListener("click", () => showScreen(seatScreen, scheduleScreen));
seatBackButton.addEventListener("click", () => showScreen(scheduleScreen, seatScreen, "back"));
ticketBackButton.addEventListener("click", () => {
  ticketScreen.classList.remove("ticket-arrived", "ticket-pending", "ticket-handoff");
  showScreen(seatScreen, ticketScreen, "back");
});
megaModeButton.addEventListener("click", activateMegaMode);
document.querySelectorAll(".mode-home-btn, .fast-mode-btn").forEach((button) => {
  button.addEventListener("click", returnToHome);
});

// ── FAST MODE (spot) navigation ─────────────────────────────
(function initSpotFlow() {
  const ROWS = "ABCDEFGHI";
  const COLS = 12;
  const AISLE_AFTER = 4; // visual gap between col 4 and 5
  const SEAT_PRICE = 14000;
  const reserved = new Set(["A1","A2","A3","A4","A10","A11","A12","B1","B2","B11","B12","C1","C12","H9","H10","G9","G10"]);
  const userSelected = new Set(["E7","E8"]);

  const rowLabels = document.querySelector("#spot-row-labels");
  const spotSeatMapEl = document.querySelector("#spot-seat-map");
  const seatLabelsEl = document.querySelector(".spot-seat-labels");
  const seatPriceEl = document.querySelector(".spot-seat-price");
  const paymentModal = document.querySelector("#spot-payment-modal");
  const checkoutBtn = document.querySelector("#spot-checkout-btn");

  function updateSeatSummary() {
    const sorted = Array.from(userSelected).sort();
    const count = sorted.length;
    if (count === 0) {
      seatLabelsEl.textContent = "좌석을 선택하세요";
      seatPriceEl.textContent = "0원";
    } else {
      seatLabelsEl.textContent = sorted.join(", ") + "  총 " + count + "석";
      seatPriceEl.textContent = (count * SEAT_PRICE).toLocaleString("ko-KR") + "원";
    }
  }

  if (rowLabels && spotSeatMapEl) {
    for (const r of ROWS) {
      const lbl = document.createElement("div");
      lbl.className = "spot-row-label";
      lbl.textContent = r;
      rowLabels.appendChild(lbl);
      const row = document.createElement("div");
      row.className = "spot-seat-row";
      for (let c = 1; c <= COLS; c++) {
        if (c === AISLE_AFTER + 1) {
          const gap = document.createElement("span");
          gap.className = "ss gp";
          row.appendChild(gap);
        }
        const key = r + c;
        const cell = document.createElement("span");
        cell.dataset.key = key;
        cell.className = "ss " + (userSelected.has(key) ? "sl" : reserved.has(key) ? "rv" : "av");
        row.appendChild(cell);
      }
      spotSeatMapEl.appendChild(row);
    }
    updateSeatSummary();
  }

  if (spotSeatMapEl) {
    spotSeatMapEl.addEventListener("click", e => {
      const cell = e.target.closest(".ss");
      if (!cell || !cell.dataset.key) return;
      const key = cell.dataset.key;
      if (reserved.has(key)) return;
      if (userSelected.has(key)) {
        userSelected.delete(key);
        cell.className = "ss av";
      } else {
        userSelected.add(key);
        cell.className = "ss sl";
      }
      updateSeatSummary();
    });
  }

  document.querySelectorAll(".district-card, .favorite-row, .nearby-card").forEach(btn => {
    btn.addEventListener("click", () => showScreen(spotScreen, homeScreen));
  });

  document.querySelector("#spot-screen").addEventListener("click", e => {
    const btn = e.target.closest(".spot-time-btn");
    if (!btn) return;
    btn.closest(".spot-times").querySelectorAll(".spot-time-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    showScreen(spotSeatScreen, spotScreen);
  });

  document.querySelectorAll(".spot-home-btn").forEach(btn => btn.addEventListener("click", returnToHome));
  document.querySelectorAll(".spot-seat-home-btn").forEach(btn => btn.addEventListener("click", returnToHome));

  document.querySelector("#spot-mega-btn").addEventListener("click", () => {
    showScreen(homeScreen, spotScreen, "back");
    window.setTimeout(activateMegaMode, 660);
  });

  document.querySelector("#spot-back-btn").addEventListener("click", () => showScreen(homeScreen, spotScreen, "back"));
  document.querySelector("#spot-seat-back").addEventListener("click", () => showScreen(spotScreen, spotSeatScreen, "back"));

  document.querySelector("#spot-seat-mega-btn").addEventListener("click", () => {
    returnToHome();
    window.setTimeout(activateMegaMode, 660);
  });

  if (checkoutBtn && paymentModal) {
    checkoutBtn.addEventListener("click", () => {
      if (checkoutBtn.classList.contains("loading")) return;
      checkoutBtn.classList.add("loading");
      checkoutBtn.disabled = true;
      window.setTimeout(() => {
        checkoutBtn.classList.remove("loading");
        checkoutBtn.disabled = false;
        const sorted = Array.from(userSelected).sort();
        const count = sorted.length;
        const sub = paymentModal.querySelector(".spot-payment-sub");
        if (sub) {
          sub.innerHTML = (count > 0 ? sorted.join(", ") + " · 총 " + count + "석<br>" : "") +
            (count * SEAT_PRICE).toLocaleString("ko-KR") + "원이 결제되었습니다.";
        }
        paymentModal.classList.add("active");
      }, 1600);
    });

    paymentModal.querySelector(".spot-payment-close").addEventListener("click", () => {
      paymentModal.classList.remove("active");
      window.setTimeout(returnToHome, 320);
    });
  }
})();

enableSwipe(movieDialWrap, moveMovieDial);
enableSwipe(dateDial, moveDateDial);
enableSwipe(timeDial, moveTimeDial);

movieDialWrap.addEventListener("click", (event) => {
  if (event.target.closest(".movie-card")) return;
  const bounds = movieDialWrap.getBoundingClientRect();
  const relativeX = event.clientX - bounds.left;
  if (relativeX < bounds.width * 0.42) moveMovieDial(-1);
  if (relativeX > bounds.width * 0.58) moveMovieDial(1);
});

movieSearchInput.addEventListener("input", () => {
  movieSearchQuery = movieSearchInput.value.trim().toLowerCase();
  if (movieSearchQuery) {
    const matchingIndex = movies.findIndex((movie) =>
      `${movie.title} ${movie.genre} ${movie.director}`.toLowerCase().includes(movieSearchQuery)
    );
    if (matchingIndex !== -1 && matchingIndex !== selectedMovieIndex) selectMovie(matchingIndex);
  }
  updateMovieDial();
});

movieSearchInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  const matchingIndex = movies.findIndex((movie) =>
    `${movie.title} ${movie.genre} ${movie.director}`.toLowerCase().includes(movieSearchQuery)
  );
  if (matchingIndex === -1) {
    showToast("검색 결과가 없습니다.");
    return;
  }
  selectMovie(matchingIndex);
  movieSearchInput.blur();
});

document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.toast));
});

movieHero.style.backgroundImage = `url("${movies[0].image}")`;
initializeMovieDial();
initializeScheduleDial(dateDial, dates, "date-card", (item) => `${item.day}<strong>${item.date}</strong>`);
initializeScheduleDial(timeDial, times, "time-card", (item) => item);
updateMovieDial();
updateScheduleDials();
renderSeats();
updateSummary();

const urlParams = new URLSearchParams(window.location.search);
const previewMovieIndex = Number(urlParams.get("movie"));
if (Number.isInteger(previewMovieIndex) && previewMovieIndex >= 0 && previewMovieIndex < movies.length) {
  selectMovie(previewMovieIndex);
}

if (window.location.hash === "#mode-transition") {
  window.setTimeout(activateMegaMode, 180);
} else if (urlParams.get("screen") === "ticket" || window.location.hash === "#ticket") {
  homeScreen.classList.remove("active");
  ticketScreen.classList.add("active");
  phoneShell.classList.remove("light-mode");
} else if (window.location.hash === "#transition" || window.location.hash === "#transition-slow") {
  homeScreen.classList.remove("active");
  seatScreen.classList.add("active");
  phoneShell.classList.remove("light-mode");
  window.setTimeout(playThreeTicketTransition, 60);
} else if (window.location.hash === "#schedule") {
  homeScreen.classList.remove("active");
  scheduleScreen.classList.add("active");
  phoneShell.classList.remove("light-mode");
  openScheduleScreen();
} else if (window.location.hash === "#movie") {
  homeScreen.classList.remove("active");
  movieScreen.classList.add("active");
  phoneShell.classList.remove("light-mode");
}
