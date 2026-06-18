const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Remove CSS links from head
content = content.replace(/<link rel="preload" as="style" href="https:\/\/fonts.*?<\/noscript>/s, '');

// 2. Add CSS links at the end of body
const cssLinks = `
    <!-- Load CSS at the end to prevent render blocking -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css">
`;
content = content.replace('</body>', cssLinks + '\n</body>');

// 3. Inject HTML cards
const cardsHtml = `
            <div class="card" id="card-1">
                <div class="card-icon" style="background-color: rgba(59, 130, 246, 0.15); color: #3B82F6;">
                    <i class="ph ph-paint-brush"></i>
                </div>
                <div class="card-content">
                    <h3 class="card-title">Desain Antarmuka</h3>
                    <p class="card-desc">Mempelajari prinsip dasar pembuatan antarmuka penggun...</p>
                </div>
                <button class="icon-btn delete-btn" onclick="deleteCard(1)" aria-label="Hapus Desain Antarmuka">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
            <div class="card" id="card-2">
                <div class="card-icon" style="background-color: rgba(16, 185, 129, 0.15); color: #10B981;">
                    <i class="ph ph-users"></i>
                </div>
                <div class="card-content">
                    <h3 class="card-title">Pengalaman Pengguna</h3>
                    <p class="card-desc">Fokus pada alur pengguna dan kenyamanan dalam...</p>
                </div>
                <button class="icon-btn delete-btn" onclick="deleteCard(2)" aria-label="Hapus Pengalaman Pengguna">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
            <div class="card" id="card-3">
                <div class="card-icon" style="background-color: rgba(245, 158, 11, 0.15); color: #F59E0B;">
                    <i class="ph ph-device-mobile"></i>
                </div>
                <div class="card-content">
                    <h3 class="card-title">Prototyping Interaktif</h3>
                    <p class="card-desc">Membuat rancangan interaktif sebelum proses pengembanga...</p>
                </div>
                <button class="icon-btn delete-btn" onclick="deleteCard(3)" aria-label="Hapus Prototyping Interaktif">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
            <div class="card" id="card-4">
                <div class="card-icon" style="background-color: rgba(139, 92, 246, 0.15); color: #8B5CF6;">
                    <i class="ph ph-wheelchair"></i>
                </div>
                <div class="card-content">
                    <h3 class="card-title">Aksesibilitas Web</h3>
                    <p class="card-desc">Memastikan aplikasi dapat digunakan oleh semua orang...</p>
                </div>
                <button class="icon-btn delete-btn" onclick="deleteCard(4)" aria-label="Hapus Aksesibilitas Web">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
`;
content = content.replace('<!-- Cards will be populated by JS -->', cardsHtml);

// 4. Remove initialCards array and renderCards function
content = content.replace(/const initialCards = \[\s*\{.*?\}\s*\];/s, '');
content = content.replace(/function renderCards\(\) \{[\s\S]*?\}\s*function hexToRgb/s, 'function hexToRgb');
content = content.replace(/function hexToRgb\([^)]*\) \{[\s\S]*?\}\s*/s, '');
content = content.replace('renderCards();', "document.querySelectorAll('.card').forEach(c => { c.classList.remove('deleting'); c.style.display = 'flex'; });");

// 5. Change .remove() to .style.display = 'none' in delete logic
content = content.replace(/prevDeleted\.remove\(\)/g, "prevDeleted.style.display = 'none'");
content = content.replace(/cardEl\.remove\(\)/g, "cardEl.style.display = 'none'");

fs.writeFileSync('index.html', content);
console.log('Fixed index.html successfully!');
