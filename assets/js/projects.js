const GITHUB_ORG = 'JigsawFlux';
const API_BASE   = 'https://api.github.com';

// Category → GitHub topic mapping
const CATEGORY_TOPICS = {
    'health-tech':        ['health-tech', 'health', 'healthcare', 'medical', 'digital-health'],
    'crisis-management':  ['crisis-management', 'crisis', 'emergency', 'disaster', 'emergency-response'],
    'humanitarian':       ['humanitarian', 'humanitarian-tools', 'social-good', 'public-good'],
};

let allRepos = [];
let activeFilter = 'all';

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function loadProjects() {
    try {
        const res  = await fetch(`${API_BASE}/orgs/${GITHUB_ORG}/repos?sort=updated&per_page=100`);
        const data = await res.json();
        allRepos   = data.filter(r => !r.fork && !r.private);
        renderProjects(allRepos);
        updateMeta(allRepos.length, allRepos.length);
    } catch (err) {
        console.error('Failed to load repos:', err);
        document.getElementById('projects-grid').innerHTML = `
            <div class="project-card">
                <p>Unable to load projects. Visit
                   <a href="https://github.com/${GITHUB_ORG}" target="_blank">GitHub</a> directly.</p>
            </div>`;
        document.getElementById('projects-count-label').textContent = '';
    }
}

// ─── Render ───────────────────────────────────────────────────────────────────

function renderProjects(repos) {
    const grid     = document.getElementById('projects-grid');
    const noResult = document.getElementById('no-results');

    if (repos.length === 0) {
        grid.innerHTML = '';
        noResult.hidden = false;
        return;
    }

    noResult.hidden = true;
    grid.innerHTML  = repos.map(createCardHTML).join('');
}

function createCardHTML(repo) {
    const desc    = repo.description || 'No description provided.';
    const stars   = repo.stargazers_count || 0;
    const forks   = repo.forks_count || 0;
    const lang    = repo.language || null;
    const topics  = (repo.topics || []).slice(0, 4);
    const updated = formatDate(repo.updated_at);
    const issues  = repo.open_issues_count || 0;

    const topicsHtml = topics
        .map(t => `<span class="topic-tag">${t}</span>`)
        .join('');

    const langHtml = lang
        ? `<span class="proj-lang"><span class="lang-dot"></span>${lang}</span>`
        : '';

    return `
        <div class="project-card">
            <div class="project-header">
                <h3>
                    <a href="project.html?repo=${encodeURIComponent(repo.name)}"
                       style="text-decoration:none;color:inherit;">${repo.name}</a>
                </h3>
            </div>
            <p>${desc}</p>
            <div class="project-topics">${topicsHtml}</div>
            <div class="project-meta">
                ${langHtml}
                <span>⭐ ${stars}</span>
                <span>🍴 ${forks}</span>
                ${issues > 0 ? `<span>🐛 ${issues} open</span>` : ''}
                <span>📅 ${updated}</span>
            </div>
            <div class="card-footer">
                <a href="project.html?repo=${encodeURIComponent(repo.name)}" class="btn-link">View details →</a>
                <a href="${repo.html_url}" target="_blank" class="btn-link btn-link--muted">GitHub ↗</a>
            </div>
        </div>`;
}

// ─── Filter & Search ──────────────────────────────────────────────────────────

function applyFilters() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();

    let filtered = allRepos;

    if (activeFilter !== 'all') {
        const matchTopics = CATEGORY_TOPICS[activeFilter] || [];
        filtered = filtered.filter(repo =>
            (repo.topics || []).some(t => matchTopics.includes(t))
        );
    }

    if (query) {
        filtered = filtered.filter(repo =>
            repo.name.toLowerCase().includes(query) ||
            (repo.description || '').toLowerCase().includes(query) ||
            (repo.topics || []).some(t => t.includes(query))
        );
    }

    renderProjects(filtered);
    updateMeta(filtered.length, allRepos.length);
}

function updateMeta(shown, total) {
    const label = document.getElementById('projects-count-label');
    if (shown === total) {
        label.textContent = `${total} project${total !== 1 ? 's' : ''}`;
    } else {
        label.textContent = `Showing ${shown} of ${total} projects`;
    }
}

// ─── Event listeners ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();

    // Filter buttons
    document.getElementById('filter-bar').addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        applyFilters();
    });

    // Search
    document.getElementById('search-input').addEventListener('input', applyFilters);

    // Clear button in empty state
    document.getElementById('clear-search').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        activeFilter = 'all';
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        applyFilters();
    });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString) {
    const date    = new Date(dateString);
    const now     = new Date();
    const diffMs  = now - date;
    const diffDay = Math.floor(diffMs / 86400000);
    if (diffDay === 0)  return 'Today';
    if (diffDay === 1)  return 'Yesterday';
    if (diffDay < 30)   return `${diffDay}d ago`;
    if (diffDay < 365)  return `${Math.floor(diffDay / 30)}mo ago`;
    return `${Math.floor(diffDay / 365)}y ago`;
}
