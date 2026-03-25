// Global state
let allSyllables = [];
let currentFilter = 'all';

// Tone names in Chinese for kids
const toneNames = {
    '1': '一声',
    '2': '二声',
    '3': '三声',
    '4': '四声'
};

// Initialize the app
async function init() {
    try {
        const response = await fetch('/api/syllables');
        const data = await response.json();
        allSyllables = data.syllables;
        
        // Hide loading
        document.getElementById('loading').classList.add('hidden');
        
        // Render initial grid
        renderGrid(allSyllables);
        
        // Setup filter buttons
        setupFilters();
    } catch (error) {
        console.error('Error loading syllables:', error);
        document.getElementById('loading').innerHTML = '<p style="color: white;">加载失败 😢 Loading failed!</p>';
    }
}

// Render the pinyin grid
function renderGrid(syllables) {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    
    if (syllables.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #666;">没有找到拼音 No pinyin found</p>';
        return;
    }
    
    // Group syllables by 4 (each row has 4 cards)
    for (let i = 0; i < syllables.length; i += 4) {
        const row = document.createElement('div');
        row.className = 'pinyin-row';
        
        // Add up to 4 cards to this row
        for (let j = 0; j < 4 && (i + j) < syllables.length; j++) {
            const card = createPinyinCard(syllables[i + j]);
            row.appendChild(card);
        }
        
        grid.appendChild(row);
    }
}

// Create a pinyin card element
function createPinyinCard(syllable) {
    const card = document.createElement('div');
    card.className = 'pinyin-card';
    
    // Extract base and tone
    const base = syllable.replace(/[1-4]$/, '');
    const tone = syllable.match(/[1-4]$/)?.[0] || '';
    
    card.innerHTML = `
        <div class="pinyin-text">${base}</div>
        <div class="tone-indicator">${tone ? toneNames[tone] : ''}</div>
    `;
    
    // Add click event to play sound
    card.addEventListener('click', () => playSound(syllable, card));
    
    return card;
}

// Play sound for a syllable
function playSound(syllable, card) {
    const audio = new Audio(`/sounds/${syllable}/davinfifield.mp3`);
    
    // Add playing animation
    card.classList.add('playing');
    
    audio.play().catch(error => {
        console.error('Error playing sound:', error);
    });
    
    audio.onended = () => {
        card.classList.remove('playing');
    };
    
    // Remove animation after a bit even if sound fails
    setTimeout(() => {
        card.classList.remove('playing');
    }, 1000);
}

// Setup filter buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Get filter value
            const filter = btn.dataset.filter;
            currentFilter = filter;
            
            // Filter syllables
            let filtered;
            if (filter === 'all') {
                filtered = allSyllables;
            } else {
                filtered = allSyllables.filter(s => s.startsWith(filter));
            }
            
            // Render filtered grid
            renderGrid(filtered);
        });
    });
}

// Start the app when page loads
window.addEventListener('DOMContentLoaded', init);

// Add some fun keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'r' for random sound
    if (e.key === 'r' || e.key === 'R') {
        const randomSyllable = allSyllables[Math.floor(Math.random() * allSyllables.length)];
        playSound(randomSyllable, document.createElement('div'));
    }
});
