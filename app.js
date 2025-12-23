// ===== BOOKGRID APPLICATION =====

const bookInput = document.getElementById('bookInput');
const customTitleInput = document.getElementById('customTitle');
const generateBtn = document.getElementById('generateBtn');
const progress = document.getElementById('progress');
const outputSection = document.getElementById('outputSection');
const bookGrid = document.getElementById('bookGrid');
const gridTitle = document.getElementById('gridTitle');

const CACHE_KEY = 'bookgrid_cache';
const TITLE_KEY = 'bookgrid_custom_title';

// Load cached custom title
const savedTitle = localStorage.getItem(TITLE_KEY);
if (savedTitle) {
  customTitleInput.value = savedTitle;
}

// Save custom title on input
customTitleInput.addEventListener('input', () => {
  const title = customTitleInput.value.trim();
  if (title) {
    localStorage.setItem(TITLE_KEY, title);
  } else {
    localStorage.removeItem(TITLE_KEY);
  }
});

// Get cached covers
function getCache() {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    return cache ? JSON.parse(cache) : {};
  } catch {
    return {};
  }
}

// Save to cache
function saveToCache(query, imageUrl) {
  try {
    const cache = getCache();
    cache[query.toLowerCase()] = imageUrl;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Cache save failed:', e);
  }
}

// Fetch book cover from Google Books API
async function fetchBookCover(query) {
  const cache = getCache();
  const cacheKey = query.toLowerCase();
  
  // Check cache first
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items && data.items[0]) {
      const book = data.items[0].volumeInfo;
      const imageUrl = book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail;
      
      if (imageUrl) {
        // Use HTTPS
        const secureUrl = imageUrl.replace('http://', 'https://');
        saveToCache(query, secureUrl);
        return secureUrl;
      }
    }
  } catch (e) {
    console.error('API error for:', query, e);
  }
  
  return null;
}

// Create book cover element
function createBookCover(imageUrl, title) {
  const div = document.createElement('div');
  div.className = 'book-cover';
  
  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = title;
    div.appendChild(img);
  } else {
    div.classList.add('placeholder');
    div.textContent = 'No cover found';
  }
  
  return div;
}

// Initialize SortableJS
function initializeSortable() {
  new Sortable(bookGrid, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    forceFallback: true, // Better mobile support
    touchStartThreshold: 5
  });
}

// Generate grid
async function generateGrid() {
  const input = bookInput.value.trim();
  
  if (!input) {
    alert('Please paste your book list first!');
    return;
  }
  
  // Parse books
  const books = input.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  if (books.length === 0) {
    alert('Please enter at least one book!');
    return;
  }
  
  // Clear previous grid
  bookGrid.innerHTML = '';
  outputSection.classList.remove('active');
  
  // Update custom title
  const customTitle = customTitleInput.value.trim();
  if (customTitle) {
    gridTitle.textContent = customTitle;
    gridTitle.classList.add('active');
  } else {
    gridTitle.classList.remove('active');
  }
  
  // Disable button and show progress
  generateBtn.disabled = true;
  progress.classList.add('active');
  progress.textContent = `Fetching covers... (0/${books.length})`;
  
  // Fetch covers sequentially
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    progress.textContent = `Fetching covers... (${i + 1}/${books.length})`;
    
    const imageUrl = await fetchBookCover(book);
    const coverElement = createBookCover(imageUrl, book);
    bookGrid.appendChild(coverElement);
    
    // Small delay to avoid rate limiting
    if (i < books.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  // Show output
  progress.classList.remove('active');
  generateBtn.disabled = false;
  outputSection.classList.add('active');
  
  // Initialize drag-and-drop
  initializeSortable();
  
  // Scroll to grid
  setTimeout(() => {
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// Event listener
generateBtn.addEventListener('click', generateGrid);

// Allow Enter key in textarea (optional: Ctrl+Enter to generate)
bookInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    generateGrid();
  }
});
