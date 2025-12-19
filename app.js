const fetchBtn = document.getElementById("fetchBtn");
const clearBtn = document.getElementById("clearBtn");
const screenshotModeBtn = document.getElementById("screenshotModeBtn");
const exitScreenshotBtn = document.getElementById("exitScreenshotBtn");

const bookListEl = document.getElementById("bookList");
const gridEl = document.getElementById("grid");

const statusText = document.getElementById("statusText");
const errorText = document.getElementById("errorText");

let dragSrcEl = null;

// --- Google Books cover fetch (with lightweight caching) ---
function cacheKey(query) {
  return `bookgrid_cover_${query.toLowerCase()}`;
}

async function fetchCover(query) {
  const cached = localStorage.getItem(cacheKey(query));
  if (cached) return { thumbnail: cached };

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network error");
  const data = await res.json();

  const item = data.items && data.items[0] ? data.items[0] : null;
  const vol = item ? item.volumeInfo || {} : {};
  const images = vol.imageLinks || {};

  const thumb = images.thumbnail || images.smallThumbnail || null;
  if (thumb) localStorage.setItem(cacheKey(query), thumb);

  return { thumbnail: thumb };
}

// --- Drag & drop reordering ---
function handleDragStart(e) {
  dragSrcEl = this;
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
}

function handleDragEnd() {
  this.classList.remove("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";

  const target = e.target.closest(".book");
  if (!target || target === dragSrcEl) return;

  const books = Array.from(gridEl.children);
  const srcIndex = books.indexOf(dragSrcEl);
  const tgtIndex = books.indexOf(target);

  if (srcIndex < tgtIndex) {
    gridEl.insertBefore(dragSrcEl, target.nextSibling);
  } else {
    gridEl.insertBefore(dragSrcEl, target);
  }
}

function makeDraggable(el) {
  el.setAttribute("draggable", "true");
  el.addEventListener("dragstart", handleDragStart);
  el.addEventListener("dragend", handleDragEnd);
}

gridEl.addEventListener("dragover", handleDragOver);

function createBookElement(result) {
  const div = document.createElement("div");
  div.className = "book";

  if (result.thumbnail) {
    const img = document.createElement("img");
    img.src = result.thumbnail;
    img.alt = "";
    div.appendChild(img);
  }

  makeDraggable(div);
  return div;
}

// --- Fetch handler with progress ---
async function handleFetch() {
  errorText.textContent = "";
  gridEl.innerHTML = "";

  const raw = bookListEl.value.trim();
  if (!raw) {
    errorText.textContent = "Please paste at least one book title.";
    return;
  }

  const lines = raw
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const total = lines.length;
  let done = 0;

  statusText.textContent = `Fetching covers… (0/${total})`;

  for (const line of lines) {
    try {
      const result = await fetchCover(line);
      gridEl.appendChild(createBookElement(result));
    } catch (e) {
      console.error("Fetch error", e);
      gridEl.appendChild(createBookElement({ thumbnail: null }));
    } finally {
      done += 1;
      statusText.textContent = `Fetching covers… (${done}/${total})`;
    }
  }

  statusText.textContent = `Done! Drag to reorder. Use Screenshot Mode for a clean capture.`;
}

function handleClear() {
  bookListEl.value = "";
  gridEl.innerHTML = "";
  statusText.innerHTML = `Paste titles with optional authors. Tap <strong>Find Covers</strong>, drag to reorder, then screenshot.`;
  errorText.textContent = "";
}

fetchBtn.addEventListener("click", handleFetch);
clearBtn.addEventListener("click", handleClear);

bookListEl.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    e.preventDefault();
    handleFetch();
  }
});

// --- Screenshot Mode toggle ---
screenshotModeBtn.addEventListener("click", () => {
  const isOn = document.body.classList.toggle("screenshot-mode");
  screenshotModeBtn.setAttribute("aria-pressed", String(isOn));
  screenshotModeBtn.textContent = isOn ? "Exit Screenshot Mode" : "Screenshot Mode";
});

function setScreenshotMode(isOn) {
  document.body.classList.toggle("screenshot-mode", isOn);
  screenshotModeBtn.setAttribute("aria-pressed", String(isOn));
  screenshotModeBtn.textContent = isOn ? "Exit Screenshot Mode" : "Screenshot Mode";
}

screenshotModeBtn.addEventListener("click", () => {
  const isOn = !document.body.classList.contains("screenshot-mode");
  setScreenshotMode(isOn);
});

exitScreenshotBtn.addEventListener("click", () => {
  setScreenshotMode(false);
});

