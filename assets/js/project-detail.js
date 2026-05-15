const GITHUB_ORG = 'JigsawFlux';
const API_BASE   = 'https://api.github.com';

// ─── Bootstrap ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    const params   = new URLSearchParams(window.location.search);
    const repoName = params.get('repo');

    if (!repoName) {
        showError('No project specified.');
        return;
    }

    try {
        const [repo, readme] = await Promise.all([
            fetchRepo(repoName),
            fetchReadme(repoName),
        ]);
        renderHero(repo);
        renderSidebar(repo);
        renderReadme(readme, repo);
        document.title = `${repo.name} | JigsawFlux`;
    } catch (err) {
        console.error(err);
        showError(`Could not load "${repoName}". It may not exist or may be private.`);
    }
});

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchRepo(name) {
    const res = await fetch(`${API_BASE}/repos/${GITHUB_ORG}/${name}`);
    if (!res.ok) throw new Error(`Repo fetch failed: ${res.status}`);
    return res.json();
}

async function fetchReadme(name) {
    const res = await fetch(`${API_BASE}/repos/${GITHUB_ORG}/${name}/readme`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.content) return null;
    const bytes = Uint8Array.from(atob(data.content.replace(/\n/g, '')), c => c.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
}

// ─── Render hero ─────────────────────────────────────────────────────────────

function renderHero(repo) {
    const topics = (repo.topics || [])
        .map(t => `<span class="topic-tag topic-tag--light">${t}</span>`)
        .join('');

    document.getElementById('proj-hero-content').innerHTML = `
        <h1 class="proj-hero-title">${repo.name}</h1>
        ${repo.description ? `<p class="proj-hero-desc">${repo.description}</p>` : ''}
        ${topics ? `<div class="proj-hero-topics">${topics}</div>` : ''}
    `;
}

// ─── Render sidebar ───────────────────────────────────────────────────────────

function renderSidebar(repo) {
    const lang    = repo.language || 'Not specified';
    const license = repo.license ? repo.license.spdx_id : 'Not specified';
    const updated = formatDate(repo.updated_at);
    const created = formatDateFull(repo.created_at);

    document.getElementById('proj-sidebar').innerHTML = `
        <div class="sidebar-section">
            <h4>About</h4>
            <div class="sidebar-stats">
                <div class="sidebar-stat">
                    <span class="stat-icon">⭐</span>
                    <span class="stat-value">${repo.stargazers_count}</span>
                    <span class="stat-label">Stars</span>
                </div>
                <div class="sidebar-stat">
                    <span class="stat-icon">🍴</span>
                    <span class="stat-value">${repo.forks_count}</span>
                    <span class="stat-label">Forks</span>
                </div>
                <div class="sidebar-stat">
                    <span class="stat-icon">🐛</span>
                    <span class="stat-value">${repo.open_issues_count}</span>
                    <span class="stat-label">Open issues</span>
                </div>
            </div>
        </div>

        <div class="sidebar-section">
            <h4>Details</h4>
            <dl class="sidebar-details">
                <dt>Language</dt>
                <dd>${lang}</dd>
                <dt>License</dt>
                <dd>${license}</dd>
                <dt>Last updated</dt>
                <dd>${updated}</dd>
                <dt>Created</dt>
                <dd>${created}</dd>
            </dl>
        </div>

        <div class="sidebar-section">
            <h4>Links</h4>
            <div class="sidebar-links">
                <a href="${repo.html_url}" target="_blank" class="btn-primary sidebar-btn">
                    View on GitHub ↗
                </a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn-secondary sidebar-btn">Live site ↗</a>` : ''}
            </div>
        </div>

        <div class="sidebar-section">
            <h4>Clone</h4>
            <div class="clone-box">
                <label>HTTPS</label>
                <div class="clone-row">
                    <code id="clone-https">${repo.clone_url}</code>
                    <button class="copy-btn" data-target="clone-https" title="Copy">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                    </button>
                </div>
                <label>SSH</label>
                <div class="clone-row">
                    <code id="clone-ssh">${repo.ssh_url}</code>
                    <button class="copy-btn" data-target="clone-ssh" title="Copy">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div class="sidebar-section">
            <a href="index.html" class="btn-link">← Back to all projects</a>
        </div>
    `;

    // Copy-to-clipboard
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = document.getElementById(btn.dataset.target).textContent;
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = '✓';
                setTimeout(() => {
                    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
                }, 1500);
            });
        });
    });
}

// ─── Render README ────────────────────────────────────────────────────────────

function renderReadme(markdown, repo) {
    const main = document.getElementById('proj-main');
    if (!markdown) {
        main.innerHTML = `
            <div class="readme-empty">
                <p>No README found for this project.</p>
                <a href="${repo.html_url}" target="_blank" class="btn-secondary">View on GitHub ↗</a>
            </div>`;
        return;
    }

    const html = markdownToHtml(markdown, repo.name, repo.default_branch || 'main');
    main.innerHTML = `
        <h2 class="readme-heading">README</h2>
        <div class="readme-body">${html}</div>`;
}

// ─── Basic Markdown → HTML ────────────────────────────────────────────────────

function markdownToHtml(md, repoName, branch) {
    const rawBase = `https://raw.githubusercontent.com/${GITHUB_ORG}/${repoName}/${branch}/`;

    // Preserve fenced code blocks
    const blocks = [];
    let src = md.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
        const cls = lang ? ` class="language-${lang}"` : '';
        blocks.push(`<pre><code${cls}>${escHtml(code.trimEnd())}</code></pre>`);
        return `\x00BLOCK${blocks.length - 1}\x00`;
    });

    // Inline code
    src = src.replace(/`([^`\n]+)`/g, (_, c) => `<code>${escHtml(c)}</code>`);

    const lines   = src.split('\n');
    const out     = [];
    let inUl      = false;
    let inOl      = false;
    let inTable   = false;
    let tableRows = [];

    const flushList = () => {
        if (inUl) { out.push('</ul>'); inUl = false; }
        if (inOl) { out.push('</ol>'); inOl = false; }
    };

    const flushTable = () => {
        if (!inTable) return;
        out.push('<table class="readme-table">');
        tableRows.forEach((row, i) => {
            const cells = row.split('|').map(c => c.trim()).filter(Boolean);
            const tag   = i === 0 ? 'th' : 'td';
            out.push(`<tr>${cells.map(c => `<${tag}>${inline(c, rawBase)}</${tag}>`).join('')}</tr>`);
        });
        out.push('</table>');
        inTable   = false;
        tableRows = [];
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Heading
        const h = line.match(/^(#{1,6})\s+(.*)/);
        if (h) {
            flushList(); flushTable();
            const lvl = Math.min(h[1].length + 1, 6); // bump level so h1s in README become h2
            out.push(`<h${lvl}>${inline(h[2], rawBase)}</h${lvl}>`);
            continue;
        }

        // HR
        if (/^[-*_]{3,}$/.test(line.trim())) {
            flushList(); flushTable();
            out.push('<hr>');
            continue;
        }

        // Table row
        if (line.includes('|')) {
            const isSep = /^[\s|:-]+$/.test(line);
            if (!isSep) {
                flushList();
                inTable = true;
                tableRows.push(line.replace(/^\||\|$/g, ''));
            }
            continue;
        } else if (inTable) {
            flushTable();
        }

        // Unordered list
        const ul = line.match(/^(\s*)[-*+]\s+(.*)/);
        if (ul) {
            flushTable();
            if (!inUl) { if (inOl) { out.push('</ol>'); inOl = false; } out.push('<ul>'); inUl = true; }
            out.push(`<li>${inline(ul[2], rawBase)}</li>`);
            continue;
        }

        // Ordered list
        const ol = line.match(/^\d+\.\s+(.*)/);
        if (ol) {
            flushTable();
            if (!inOl) { if (inUl) { out.push('</ul>'); inUl = false; } out.push('<ol>'); inOl = true; }
            out.push(`<li>${inline(ol[1], rawBase)}</li>`);
            continue;
        }

        // Blank line
        if (line.trim() === '') {
            flushList(); flushTable();
            continue;
        }

        // Paragraph
        flushList(); flushTable();
        out.push(`<p>${inline(line, rawBase)}</p>`);
    }

    flushList();
    flushTable();

    let html = out.join('\n');

    // Restore code blocks
    blocks.forEach((b, i) => { html = html.replace(`\x00BLOCK${i}\x00`, b); });

    // Fix relative image sources to absolute GitHub raw URLs
    html = html.replace(/src="(?!https?:\/\/)([^"]+)"/g, `src="${rawBase}$1"`);

    return html;
}

function inline(text, rawBase) {
    return text
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
            const url = src.startsWith('http') ? src : rawBase + src;
            return `<img alt="${alt}" src="${url}" style="max-width:100%;height:auto">`;
        })
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/~~([^~]+)~~/g, '<del>$1</del>');
}

function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Error state ──────────────────────────────────────────────────────────────

function showError(msg) {
    document.getElementById('proj-hero-content').innerHTML = `<h1>Project not found</h1>`;
    document.getElementById('proj-main').innerHTML = `
        <div class="readme-empty">
            <p>${msg}</p>
            <a href="index.html" class="btn-secondary">Back to all projects</a>
        </div>`;
    document.getElementById('proj-sidebar').innerHTML = '';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString) {
    const date    = new Date(dateString);
    const now     = new Date();
    const diffDay = Math.floor((now - date) / 86400000);
    if (diffDay === 0)  return 'Today';
    if (diffDay === 1)  return 'Yesterday';
    if (diffDay < 30)   return `${diffDay}d ago`;
    if (diffDay < 365)  return `${Math.floor(diffDay / 30)}mo ago`;
    return `${Math.floor(diffDay / 365)}y ago`;
}

function formatDateFull(dateString) {
    return new Date(dateString).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}
