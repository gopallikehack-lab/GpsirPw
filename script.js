// ===== BATCH ID (YOUR BATCH) =====
const BATCH_ID = "6779345c20fa0756e4a7fd08";
const API_BASE = "https://liteapi.pw4free.in/api/v1";

// ===== LOAD SUBJECTS =====
async function loadSubjects() {
    const grid = document.getElementById('subjectsGrid');
    grid.innerHTML = '<p>⏳ Loading subjects...</p>';
    
    try {
        const response = await fetch(`${API_BASE}/subjects?batchId=${BATCH_ID}`);
        const data = await response.json();
        
        if (data.subjects && data.subjects.length > 0) {
            grid.innerHTML = '';
            data.subjects.forEach(subject => {
                const card = document.createElement('div');
                card.className = 'subject-card';
                card.innerHTML = `
                    <h3>📘 ${subject.name || subject.title || 'Subject'}</h3>
                    <p>${subject.chapters || subject.count || '0'} chapters</p>
                `;
                card.onclick = () => openSubject(subject.id || subject._id, subject.name);
                grid.appendChild(card);
            });
        } else {
            grid.innerHTML = '<p>No subjects found for this batch.</p>';
        }
    } catch (error) {
        console.error('Error loading subjects:', error);
        // Fallback: Show subjects from pw4free
        grid.innerHTML = `
            <div class="subject-card" onclick="openSubject('69beb1defa18934d859e3526', 'Physics')">
                <h3>📘 Physics</h3>
                <p>Multiple chapters</p>
            </div>
            <div class="subject-card" onclick="openSubject('69beb23b007b534bb5de5b7d', 'Chemistry')">
                <h3>📘 Chemistry</h3>
                <p>Multiple chapters</p>
            </div>
            <div class="subject-card" onclick="openSubject('69beb28388683c394e8a56a2', 'Mathematics')">
                <h3>📘 Mathematics</h3>
                <p>Multiple chapters</p>
            </div>
        `;
    }
}

// ===== OPEN SUBJECT =====
function openSubject(subjectId, subjectName) {
    const frame = document.getElementById('contentFrame');
    const iframe = document.getElementById('contentIframe');
    const title = document.getElementById('subjectTitle');
    
    title.textContent = `📖 ${subjectName}`;
    iframe.src = `https://lite.pw4free.in/subject?batchId=${BATCH_ID}&subjectId=${subjectId}`;
    frame.style.display = 'block';
    
    // Scroll to frame
    frame.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== CLOSE CONTENT =====
function closeContent() {
    document.getElementById('contentFrame').style.display = 'none';
    document.getElementById('contentIframe').src = 'about:blank';
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', loadSubjects);
console.log('🔮 GP_SIR_ERA — Free Batch Viewer');
console.log('📚 Batch ID:', BATCH_ID);
console.log('✅ No login required!');
