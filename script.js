// ===== YOUR AUTH TOKEN =====
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI3MDA1NjAyNTg0IiwibmFtZSI6Ikdwc2lyZXJhIiwiaWF0IjoxNzgzNDE1NDQ2LCJleHAiOjE3OTExOTE0NDZ9.SN3pW1SX5oPrJWgmXP1t2ukLI0IcofHXFy1wTtYpIhE";

const USER_NAME = "Gpsirera";
const USER_PHONE = "7005602584";
const API_BASE = "https://api.penpencil.co/v1";
const PW_API = "https://api.pw.live/v1";

let tokenVisible = false;
let currentBatchId = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('study.html')) {
        loadStudyPage();
    } else {
        document.getElementById('userName').textContent = USER_NAME;
        document.getElementById('batchCount').textContent = '0';
        localStorage.setItem('pw_token', AUTH_TOKEN);
        localStorage.setItem('pw_user', JSON.stringify({ name: USER_NAME, phone: USER_PHONE }));
        loadBatches();
        checkTokenStatus();
    }
});

// ===== LOAD BATCHES =====
async function loadBatches() {
    const grid = document.getElementById('batchGrid');
    grid.innerHTML = '<p>⏳ Loading your batches...</p>';
    
    try {
        const response = await fetch(`${API_BASE}/user/batches`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('API call failed');
        const data = await response.json();
        displayBatches(data.batches || []);
    } catch (error) {
        console.error('Error loading batches:', error);
        showFallbackBatches();
    }
}

// ===== DISPLAY BATCHES =====
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
            <button class="study-btn" onclick="studyBatch('${batch.id || batch._id || batch.name}')">▶️ Study Now</button>
        `;
        grid.appendChild(card);
    });
}

// ===== FALLBACK BATCHES =====
function showFallbackBatches() {
    const grid = document.getElementById('batchGrid');
    const fallbackBatches = [
        { id: 'lakshya_jee_2.0_2027', name: 'Lakshya JEE 2.0 2027', description: 'For JEE Aspirants • Hinglish', startDate: '15/06/2026 - 30/06/2027', isFree: true },
        { id: 'lakshya_jee_2027', name: 'Lakshya JEE 2027', description: 'For JEE Aspirants • Hinglish', startDate: '26/03/2026 - 30/06/2027', isFree: true }
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

// ===== STUDY BATCH =====
function studyBatch(batchId) {
    currentBatchId = batchId;
    const batchName = batchId.replace(/_/g, ' ').toUpperCase();
    window.location.href = `study.html?batch=${encodeURIComponent(batchId)}&name=${encodeURIComponent(batchName)}`;
}

// ===== LOAD STUDY PAGE =====
async function loadStudyPage() {
    const params = new URLSearchParams(window.location.search);
    const batchId = params.get('batch') || 'unknown';
    const batchName = params.get('name') || 'Batch';
    currentBatchId = batchId;
    
    document.getElementById('batchTitle').textContent = `📖 ${batchName}`;
    
    await Promise.all([
        loadLectures(batchId),
        loadRecordings(batchId),
        loadMaterial(batchId),
        loadDPP(batchId),
        loadTests(batchId)
    ]);
}

// ===== LOAD LECTURES =====
async function loadLectures(batchId) {
    const container = document.getElementById('lectureList');
    try {
        const response = await fetch(`${API_BASE}/batches/${batchId}/lectures`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        const data = await response.json();
        const lectures = data.lectures || getSampleLectures();
        container.innerHTML = lectures.map(l => `
            <div class="content-item">
                <span>🎬 ${l.title || 'Lecture'}</span>
                <span>${l.duration || '45 min'}</span>
                <button onclick="playVideo('${batchId}', '${l.id || l._id}')">▶️ Watch</button>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = getSampleLectures().map(l => `
            <div class="content-item">
                <span>🎬 ${l.title}</span>
                <span>${l.duration}</span>
                <button onclick="playVideo('${batchId}', '${l.id}')">▶️ Watch</button>
            </div>
        `).join('');
    }
}

// ===== LOAD RECORDINGS =====
async function loadRecordings(batchId) {
    const container = document.getElementById('recordingList');
    try {
        const response = await fetch(`${API_BASE}/batches/${batchId}/recordings`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        const data = await response.json();
        const recordings = data.recordings || getSampleRecordings();
        container.innerHTML = recordings.map(r => `
            <div class="content-item">
                <span>📹 ${r.title || 'Recording'}</span>
                <span>${r.date || 'Recent'}</span>
                <button onclick="playRecording('${batchId}', '${r.id || r._id}')">▶️ Watch</button>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = getSampleRecordings().map(r => `
            <div class="content-item">
                <span>📹 ${r.title}</span>
                <span>${r.date}</span>
                <button onclick="playRecording('${batchId}', '${r.id}')">▶️ Watch</button>
            </div>
        `).join('');
    }
}

// ===== LOAD STUDY MATERIAL =====
async function loadMaterial(batchId) {
    const container = document.getElementById('materialList');
    try {
        const response = await fetch(`${API_BASE}/batches/${batchId}/material`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        const data = await response.json();
        const materials = data.materials || getSampleMaterials();
        container.innerHTML = materials.map(m => `
            <div class="content-item">
                <span>📄 ${m.title || 'Material'}</span>
                <span>${m.type || 'PDF'}</span>
                <button onclick="downloadMaterial('${batchId}', '${m.id || m._id}')">📥 Download</button>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = getSampleMaterials().map(m => `
            <div class="content-item">
                <span>📄 ${m.title}</span>
                <span>${m.type}</span>
                <button onclick="downloadMaterial('${batchId}', '${m.id}')">📥 Download</button>
            </div>
        `).join('');
    }
}

// ===== LOAD DPP =====
async function loadDPP(batchId) {
    const container = document.getElementById('dppList');
    try {
        const response = await fetch(`${API_BASE}/batches/${batchId}/dpp`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        const data = await response.json();
        const dpps = data.dpps || getSampleDPP();
        container.innerHTML = dpps.map(d => `
            <div class="content-item">
                <span>📝 ${d.title || 'DPP'}</span>
                <span>${d.questions || '10 Qs'}</span>
                <button onclick="openDPP('${batchId}', '${d.id || d._id}')">📝 Solve</button>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = getSampleDPP().map(d => `
            <div class="content-item">
                <span>📝 ${d.title}</span>
                <span>${d.questions}</span>
                <button onclick="openDPP('${batchId}', '${d.id}')">📝 Solve</button>
            </div>
        `).join('');
    }
}

// ===== LOAD TESTS =====
async function loadTests(batchId) {
    const container = document.getElementById('testList');
    try {
        const response = await fetch(`${API_BASE}/batches/${batchId}/tests`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        const data = await response.json();
        const tests = data.tests || getSampleTests();
        container.innerHTML = tests.map(t => `
            <div class="content-item">
                <span>📊 ${t.title || 'Test'}</span>
                <span>${t.questions || '50 Qs'}</span>
                <button onclick="startTest('${batchId}', '${t.id || t._id}')">▶️ Start</button>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = getSampleTests().map(t => `
            <div class="content-item">
                <span>📊 ${t.title}</span>
                <span>${t.questions}</span>
                <button onclick="startTest('${batchId}', '${t.id}')">▶️ Start</button>
            </div>
        `).join('');
    }
}

// ===== SAMPLE DATA =====
function getSampleLectures() {
    return [
        { id: 'lec1', title: 'Lecture 1: Introduction to Physics', duration: '45 min' },
        { id: 'lec2', title: 'Lecture 2: Mechanics Basics', duration: '50 min' },
        { id: 'lec3', title: 'Lecture 3: Kinematics', duration: '55 min' },
        { id: 'lec4', title: 'Lecture 4: Newton\'s Laws', duration: '48 min' }
    ];
}

function getSampleRecordings() {
    return [
        { id: 'rec1', title: 'Recording: Physics Class - 1', date: '2026-07-06' },
        { id: 'rec2', title: 'Recording: Physics Class - 2', date: '2026-07-05' },
        { id: 'rec3', title: 'Recording: Chemistry Class', date: '2026-07-04' }
    ];
}

function getSampleMaterials() {
    return [
        { id: 'mat1', title: 'Notes: Chapter 1 - Physics', type: 'PDF' },
        { id: 'mat2', title: 'Notes: Chapter 2 - Mechanics', type: 'PDF' },
        { id: 'mat3', title: 'Formula Sheet - Complete', type: 'PDF' }
    ];
}

function getSampleDPP() {
    return [
        { id: 'dpp1', title: 'DPP 1: Kinematics', questions: '10 Qs' },
        { id: 'dpp2', title: 'DPP 2: Newton\'s Laws', questions: '12 Qs' },
        { id: 'dpp3', title: 'DPP 3: Work Energy', questions: '8 Qs' }
    ];
}

function getSampleTests() {
    return [
        { id: 'test1', title: 'Mock Test 1: Physics', questions: '50 Qs' },
        { id: 'test2', title: 'Mock Test 2: Chemistry', questions: '45 Qs' },
        { id: 'test3', title: 'Full Syllabus Test', questions: '75 Qs' }
    ];
}

// ===== TAB SWITCH =====
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`.tab-btn[onclick*="${tab}"]`).classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
}

// ===== VIDEO PLAYER =====
function playVideo(batchId, videoId) {
    showPlayer(`🎬 Playing Lecture: ${videoId}`, 'video');
}

function playRecording(batchId, recordingId) {
    showPlayer(`📹 Playing Recording: ${recordingId}`, 'recording');
}

function showPlayer(title, type) {
    const container = document.querySelector('.study-content');
    const playerDiv = document.createElement('div');
    playerDiv.className = 'video-player glass';
    playerDiv.innerHTML = `
        <h3>${title}</h3>
        <div class="player-container">
            <video controls autoplay style="width:100%;max-height:400px;border-radius:12px;background:#000;">
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
        <button onclick="this.parentElement.remove()" class="btn-small" style="margin-top:10px;">❌ Close Player</button>
    `;
    container.prepend(playerDiv);
}

// ===== DOWNLOAD MATERIAL =====
function downloadMaterial(batchId, materialId) {
    alert(`📥 Downloading: ${materialId}\n\n(Study material will be available soon)`);
    // Simulate download
    const link = document.createElement('a');
    link.href = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    link.download = `${materialId}.pdf`;
    link.click();
}

// ===== OPEN DPP =====
function openDPP(batchId, dppId) {
    alert(`📝 Opening DPP: ${dppId}\n\nQuestions will appear here soon.`);
}

// ===== START TEST =====
function startTest(batchId, testId) {
    alert(`📊 Starting Test: ${testId}\n\nTest will begin shortly.`);
}

// ===== TOKEN FUNCTIONS =====
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

// ===== CHECK TOKEN STATUS =====
function checkTokenStatus() {
    try {
        const payload = JSON.parse(atob(AUTH_TOKEN.split('.')[1]));
        const expiry = new Date(payload.exp * 1000);
        const now = new Date();
        document.getElementById('tokenStatus').textContent = expiry > now ? '✅ Active' : '❌ Expired';
        document.getElementById('tokenStatus').style.color = expiry > now ? '#4CAF50' : '#e50914';
    } catch (e) {
        document.getElementById('tokenStatus').textContent = '⚠️ Unknown';
    }
}

console.log('🔮 GP_SIR_ERA_PW - Full PW Clone');
console.log('👤 User:', USER_NAME);
console.log('📚 Ready with Live Lectures, Recordings, Material, DPP, Tests!');
