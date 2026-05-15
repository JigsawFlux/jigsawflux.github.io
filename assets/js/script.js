// Fetch and display JigsawFlux repositories
async function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projectsCount = document.getElementById('projects-count');
    const contributorsCount = document.getElementById('contributors-count');

    try {
        // Fetch repositories from GitHub API
        const response = await fetch('https://api.github.com/orgs/JigsawFlux/repos?sort=updated&per_page=100');
        const repos = await response.json();

        // Filter out forks and private repos
        const publicRepos = repos.filter(repo => !repo.fork && !repo.private);

        // Update stats
        projectsCount.textContent = publicRepos.length;
        animateCounter(projectsCount, publicRepos.length);

        // Calculate unique contributors (approximate)
        const contributorsSet = new Set();
        publicRepos.forEach(repo => {
            if (repo.contributors_url) {
                contributorsSet.add(repo.owner.login);
            }
        });
        contributorsCount.textContent = contributorsSet.size;
        animateCounter(contributorsCount, contributorsSet.size);

        // Clear loading placeholder
        projectsGrid.innerHTML = '';

        // Display repos (show top 6)
        const topRepos = publicRepos.slice(0, 6);

        if (topRepos.length === 0) {
            projectsGrid.innerHTML = '<div class="project-card"><p>No public repositories yet. Check back soon!</p></div>';
            return;
        }

        topRepos.forEach(repo => {
            const projectCard = createProjectCard(repo);
            projectsGrid.appendChild(projectCard);
        });

    } catch (error) {
        console.error('Error loading projects:', error);
        projectsGrid.innerHTML = '<div class="project-card"><p>Unable to load projects. Please visit <a href="https://github.com/JigsawFlux" target="_blank">GitHub</a> directly.</p></div>';
    }
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const description = repo.description || 'No description provided.';
    const stars = repo.stargazers_count || 0;
    const language = repo.language || 'N/A';
    const topics = repo.topics || [];

    card.innerHTML = `
        <div class="project-header">
            <h3><a href="${repo.html_url}" target="_blank" style="text-decoration: none; color: inherit;">${repo.name}</a></h3>
        </div>
        <p>${description}</p>
        <div class="project-topics">
            ${topics.slice(0, 3).map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
        </div>
        <div class="project-meta">
            <span>⭐ ${stars}</span>
            <span>💻 ${language}</span>
            <span>📅 ${formatDate(repo.updated_at)}</span>
        </div>
    `;

    return card;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load projects when page loads
document.addEventListener('DOMContentLoaded', loadProjects);
