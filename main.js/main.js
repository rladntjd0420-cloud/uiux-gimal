import * as THREE from "../libs/three.module.js";

const homeScreen = document.querySelector("#home-screen");
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
    image: "../img/존윅.jpg",
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

    const image = document.createElement("img");
    image.src = movie.image;
    image.alt = `${movie.title} poster`;
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
  phoneShell.classList.toggle("light-mode", nextScreen === homeScreen);

  window.setTimeout(() => {
    currentScreen.classList.remove("exit-left", "exit-right");
    nextScreen.classList.remove("screen-entering", "screen-entering-back");
  }, 640);
}

function activateMegaMode() {
  if (megaModeTransitionRunning) return;

  megaModeTransitionRunning = true;
  const shellRect = phoneShell.getBoundingClientRect();
  const buttonRect = megaModeButton.getBoundingClientRect();
  const centerX = buttonRect.left - shellRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top - shellRect.top + buttonRect.height / 2;

  megaModeTransition.style.setProperty("--mode-x", `${centerX}px`);
  megaModeTransition.style.setProperty("--mode-y", `${centerY}px`);
  homeScreen.classList.add("mode-leaving");
  megaModeTransition.classList.remove("mode-settling");
  megaModeTransition.classList.add("active");

  window.setTimeout(() => {
    homeScreen.classList.remove("active");
    movieScreen.classList.add("active", "mode-arriving");
    phoneShell.classList.remove("light-mode");
  }, 620);

  window.setTimeout(() => {
    megaModeTransition.classList.add("mode-settling");
  }, 980);

  window.setTimeout(() => {
    homeScreen.classList.remove("mode-leaving");
    movieScreen.classList.remove("mode-arriving");
    megaModeTransition.classList.remove("active", "mode-settling");
    megaModeTransitionRunning = false;
  }, 1380);
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

  const duration = window.location.hash === "#transition-slow" ? 7000 : 2500;
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
  const easeInCubic = (value) => value ** 3;
  const easeOutCubic = (value) => 1 - ((1 - value) ** 3);
  const smoothStep = (value) => value * value * (3 - 2 * value);
  const spinEase = (value) => {
    if (value < 0.16) {
      return 0.09 * easeInCubic(value / 0.16);
    }
    if (value < 0.7) {
      return 0.09 + 0.75 * easeOutCubic((value - 0.16) / 0.54);
    }
    return 0.84 + 0.16 * smoothStep((value - 0.7) / 0.3);
  };
  const animateTicketDom = (now) => {
    const progress = Math.min((now - spinStart) / duration, 1);
    const eased = smoothStep(progress);
    const spin = spinEase(progress);
    const lift = Math.sin(Math.PI * progress);
    const rotationY = -24 + 384 * spin;
    const rotationX = 10 * (1 - eased) + Math.sin(progress * Math.PI * 2) * 1.45;
    const rotationZ = -4 * (1 - eased) + Math.sin(progress * Math.PI) * 1.9;
    const translateY = -39 - 11 * eased - lift * 1.2;
    const scale = 0.62 + 0.38 * eased + lift * 0.11;
    const handoff = Math.max(0, Math.min(1, (progress - .92) / .08));
    const handoffEased = smoothStep(handoff);

    ticket3dDom.style.opacity = String(Math.min(1, progress / 0.12) * (1 - handoffEased));
    ticket3dDom.style.transform = `translate3d(-50%, ${translateY}%, 0) perspective(1200px) rotateY(${rotationY}deg) rotateX(${rotationX}deg) rotateZ(${rotationZ}deg) scale(${scale})`;

    if (progress >= .92 && !actualTicket) {
      revealTicketScreen();
      actualTicket = ticketScreen.querySelector(".ticket");
      ticketScreen.classList.remove("ticket-handoff");
      actualTicket.style.opacity = "0";
    }
    if (actualTicket) {
      actualTicket.style.opacity = String(handoffEased);
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

  window.setTimeout(finishTransition, duration + 140);
  window.setTimeout(() => {
    if (completed) return;
    finishTransition();
  }, duration + 520);
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
