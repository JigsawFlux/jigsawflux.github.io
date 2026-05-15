# JigsawFlux GitHub Pages Project

## 🎯 Project Overview
Creating a professional GitHub Pages website for JigsawFlux organization to showcase open-source projects focused on health, crisis management, and humanitarian causes.

## 📊 Current Status

### ✅ Completed
- Repository created: `jigsawflux.github.io`
- GitHub Pages enabled and live at: https://jigsawflux.github.io/
- Public repository with MIT License
- Files created locally:
  - `index.html` - Main landing page
  - `style.css` - Styling
  - `script.js` - Dynamic project loading from GitHub API

### 🔄 Next Steps
1. Commit and push the three files to GitHub
2. Wait 1-2 minutes for GitHub Pages to rebuild
3. Verify the site at https://jigsawflux.github.io/
4. Create organization README (`.github` repository)
5. Add topics/tags to existing repositories
6. Pin best repositories on organization page

## 🏗️ Website Architecture

### Design Philosophy
- **Mission-focused**: Emphasize health, crisis management, humanitarian causes
- **Professional**: Clean, modern design suitable for attracting collaborators
- **Functional**: Auto-fetches projects from GitHub API
- **Responsive**: Mobile-friendly design

### Color Scheme
- Primary: Deep Blue (#1e3a8a) - trust, stability, healthcare
- Accent: Teal (#14b8a6) - compassion, hope, action
- Neutral: Grays for text and backgrounds

### Sections
1. **Hero**: Mission statement and CTA
2. **Stats**: Dynamic project count, contributors
3. **Focus Areas**: Health Tech, Crisis Management, Humanitarian Tools
4. **Projects**: Auto-populated from GitHub org repos
5. **About**: Organization mission and vision
6. **Contribute**: How to get involved
7. **Footer**: Links and resources

## 🔧 Technical Details

### Files Structure

jigsawflux.github.io/
├── index.html          # Main page
├── style.css          # Styles
├── script.js          # GitHub API integration
├── README.md          # Repository info
└── LICENSE            # MIT License

### Key Features
- **Dynamic Project Loading**: Fetches public repos via GitHub API
- **No Build Process**: Pure HTML/CSS/JS (no framework needed)
- **Automatic Deployment**: GitHub Pages auto-deploys on push to main
- **SEO Optimized**: Meta tags, semantic HTML
- **Accessibility**: Proper ARIA labels, semantic structure

### JavaScript Functionality
- Fetches repos from: `https://api.github.com/orgs/JigsawFlux/repos`
- Filters out forks and private repos
- Displays top 6 projects
- Shows stars, language, last updated
- Animated counters for stats

## 📝 Git Workflow

### Initial Push
```bash
# Navigate to your local directory
cd jigsawflux.github.io

# Check status
git status

# Add all files
git add index.html style.css script.js

# Commit
git commit -m "Add landing page with project showcase"

# Push to GitHub
git push origin main
```

### Viewing Changes
- Wait 1-2 minutes after push
- Visit: https://jigsawflux.github.io/
- Check GitHub Actions tab for deployment status

## 🎨 Future Enhancements

### Phase 2 (After Initial Launch)
- [ ] Add blog section for project updates
- [ ] Create project detail pages
- [ ] Add search/filter for projects
- [ ] Integrate GitHub Discussions
- [ ] Add contributor showcase

### Phase 3 (Community Growth)
- [ ] Add documentation section
- [ ] Create getting started guides
- [ ] Add case studies/impact stories
- [ ] Newsletter signup
- [ ] Social media integration

## 📚 Resources

### Documentation Links
- GitHub Pages: https://docs.github.com/en/pages
- GitHub API: https://docs.github.com/en/rest
- Org Profile: https://github.com/JigsawFlux

### Design Resources
- Font: Inter (Google Fonts)
- Icons: SVG inline icons
- Color palette: Blues/Teals for health/trust theme

## 🐛 Troubleshooting

### Site Not Updating
1. Check GitHub Actions tab for build status
2. Verify GitHub Pages is enabled in Settings → Pages
3. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+F5)
4. Wait up to 10 minutes for DNS propagation

### API Rate Limiting
- GitHub API allows 60 requests/hour for unauthenticated
- If needed, add personal access token for higher limits

### CORS Issues
- GitHub API supports CORS by default
- If issues occur, verify fetch requests in browser console

## 👥 Team & Ownership

### Repository Owner
- Organization: JigsawFlux
- Creator: st185229 (Suresh Thomas)

### Collaboration Model
- Open to contributors
- Issues for feature requests
- PRs welcome with proper documentation

## 📧 Contact & Support

For questions or issues:
- GitHub Issues: https://github.com/JigsawFlux/jigsawflux.github.io/issues
- Organization: https://github.com/JigsawFlux

---

**Last Updated**: 2026-05-15
**Version**: 1.0.0
**Status**: 🟢 Active Development