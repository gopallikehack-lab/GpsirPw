// ===== YOUR AUTH TOKEN (Hardcoded) =====
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI3MDA1NjAyNTg0IiwibmFtZSI6Ikdwc2lyZXJhIiwiaWF0IjoxNzgzNDE1NDQ2LCJleHAiOjE3OTExOTE0NDZ9.SN3pW1SX5oPrJWgmXP1t2ukLI0IcofHXFy1wTtYpIhE";

const USER_NAME = "Gpsirera";
const USER_PHONE = "7005602584";

let tokenVisible = false;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('userName').textContent = USER_NAME;
    document.getElementById('batchCount').textContent = '0';
    localStorage.setItem('pw_token', AUTH_TOKEN);
    localStorage.setItem('pw_user', JSON.stringify({ name: USER_NAME, phone: USER_PHONE }));
    loadBatches();
});

async function loadBatches() {
    const grid = document.getElementById('batchGrid');
    grid.innerHTML = '<p>⏳ Loading your batches...</p>';
    
    try {
        const response = await fetch('https://pwthor.live/api/user/batches', {
            headers: {
                'Authorization': `Bearer ${AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('API call failed');
        
        const data = await response.json();
        displayBatches(data.batches || []);
        
    } catch (error) {
        console.error('Error loading batches:', error);
        showFallbackBatches();
    }
}

function displayBatches(batches) {
    const grid = document.getElementById('batchGrid');
    
    if (!batches || batches.length === 0) {
        grid.innerHTML = '<p>No batches found. Enroll in some batches first!</p>';
        return;
    }
    
    document.getElementById('batchCount').textContent = batches.length;
    
    grid.innerHTML = '';
    batches.forEach(batch => {
        const card = document.createElement('div');
        card.className = 'batch-card';
        card.innerHTML = `
            <span class="badge-free">${batch.isFree ? 'FREE' : 'PAID'}</span>
            <h3>📚 ${batch.name || batch.title || 'Batch'}</h3>
            <p>${batch.description || 'Physics Wallah Batch'}</p>
            <p>📅 ${batch.startDate || 'Ongoing'}</p>
            <button class="study-btn" onclick="studyBatch('${batch.id || ''}')">▶️ Study Now</button>
        `;
        grid.appendChild(card);
    });
}

function showFallbackBatches() {
    const grid = document.getElementById('batchGrid');
    const fallbackBatches = [
        {
            id: 'lakshya_jee_2.0_2027',
            name: 'Lakshya JEE 2.0 2027',
            description: 'For JEE Aspirants • Hinglish',
            startDate: '15/06/2026 - 30/06/2027',
            isFree: true
        },
        {
            id: 'lakshya_jee_2027',
            name: 'Lakshya JEE 2027',
            description: 'For JEE Aspirants • Hinglish',
            startDate: '26/03/2026 - 30/06/2027',
            isFree: true
        }
    ];
    
    document.getElementById('batchCount').textContent = fallbackBatches.length;
    
    grid.innerHTML = '';
    fallbackBatches.forEach(batch => {
        const card = document.createElement('div');
        card.className = 'batch-card';
        card.innerHTML = `
            <span class="badge-free">✅ FREE</span>
            <h3>📚 ${batch.name}</h3>
            <p>${batch.description}</p>
            <p>📅 ${batch.startDate}</p>
            <button class="study-btn" onclick="studyBatch('${batch.id}')">▶️ Study Now</button>
        `;
        grid.appendChild(card);
    });
}

function studyBatch(batchId) {
    if (batchId.includes('lakshya')) {
        alert(`📚 Opening ${batchId.replace(/_/g, ' ')}...`);
        window.open(`https://pwthor.live/study?batch=${batchId}`, '_blank');
    } else {
        alert('Batch content coming soon!');
    }
}

function toggleToken() {
    const display = document.getElementById('tokenDisplay');
    tokenVisible = !tokenVisible;
    display.textContent = tokenVisible ? AUTH_TOKEN : 'Click to show token';
}

function copyToken() {
    navigator.clipboard.writeText(AUTH_TOKEN).then(() => {
        alert('✅ Token copied to clipboard!');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = AUTH_TOKEN;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✅ Token copied!');
    });
}

function checkTokenStatus() {
    try {
        const payload = JSON.parse(atob(AUTH_TOKEN.split('.')[1]));
        const expiry = new Date(payload.exp * 1000);
        const now = new Date();
        if (expiry > now) {
            document.getElementById('tokenStatus').textContent = '✅ Active';
            document.getElementById('tokenStatus').style.color = '#4CAF50';
        } else {
            document.getElementById('tokenStatus').textContent = '❌ Expired';
            document.getElementById('tokenStatus').style.color = '#e50914';
        }
    } catch (e) {
        document.getElementById('tokenStatus').textContent = '⚠️ Unknown';
    }
}

checkTokenStatus();
console.log('🔮 GP_SIR_ERA_PW Batch Viewer');
console.log('👤 User:', USER_NAME);
console.log('📚 Batches loaded!');
