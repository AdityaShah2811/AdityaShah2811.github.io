# Data Science Portfolio Website

A modern, professional portfolio website for Data Science professionals. Built with pure HTML, CSS, and JavaScript - fully compatible with GitHub Pages.

## 🚀 Features

- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Animated Progress Bars** - Visual skill level indicators
- **GitHub API Integration** - Live stats from your GitHub profile
- **Calendly Integration** - Easy meeting scheduling
- **Smooth Animations** - Fade-in effects and smooth scrolling
- **Easy to Update** - Just edit `data.js` to update all content
- **No Build Process** - Deploy directly to GitHub Pages

## 📁 File Structure

```
portfolio/
├── index.html                      # Main HTML file (DO NOT EDIT)
├── data.js                         # All your content (EDIT THIS)
├── Aditya_Shah_DS_Resume.pdf      # Your resume PDF
└── README.md                       # This file
```

## 🎯 Quick Start

### 1. Update Your Content

Edit `data.js` to add your personal information:

- **Personal Info**: Name, title, tagline, photo URL, contact details
- **Social Links**: GitHub, LinkedIn, Kaggle, email
- **About**: Bio and quick facts
- **Skills**: Programming languages, data analysis, tools (with proficiency levels)
- **Projects**: Your portfolio projects with descriptions and links
- **Experience**: Work history with bullet points
- **Education**: Degrees and certifications

### 2. Add Your Resume

Replace `Aditya_Shah_DS_Resume.pdf` with your own resume PDF file.

### 3. Update Your Photo

Replace the placeholder photo URL in `data.js`:
```javascript
photo: "https://via.placeholder.com/150"
```

With your actual photo URL (you can upload to GitHub or use a service like Imgur).

### 4. Set Up Calendly (Optional)

1. Create a free account at [calendly.com](https://calendly.com)
2. Set up a 15-minute meeting type
3. Copy your Calendly link
4. Update in `data.js`:
```javascript
calendlyURL: "https://calendly.com/YOUR-USERNAME/15min"
```

## 🌐 Deploy to GitHub Pages

### Method 1: GitHub Web Interface

1. Create a new repository named `YOUR-USERNAME.github.io`
2. Upload all files (`index.html`, `data.js`, `README.md`, resume PDF)
3. Go to Settings → Pages
4. Select "main" branch as source
5. Click Save
6. Your site will be live at `https://YOUR-USERNAME.github.io`

### Method 2: Git Command Line

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial portfolio commit"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git

# Push to GitHub
git push -u origin main
```

Then enable GitHub Pages in repository settings.

## 🎨 Customization

### Colors

Edit the CSS variables in `index.html` (line 20-27):

```css
:root {
    --primary: #2563eb;        /* Main blue color */
    --primary-dark: #1d4ed8;   /* Darker blue for hovers */
    --secondary: #334155;       /* Dark gray */
    --accent: #f59e0b;         /* Orange for badges */
    --success: #10b981;        /* Green for checkmarks */
}
```

### Fonts

Current fonts (from Google Fonts):
- **Headings**: Poppins
- **Body**: Inter
- **Code**: Fira Code

To change fonts, update the Google Fonts link in `index.html` (line 13).

## 📊 GitHub Stats

The website automatically fetches your GitHub statistics:
- Total public repositories
- Total stars earned
- Top 3 programming languages

Make sure your GitHub username is correct in `data.js`:
```javascript
githubUsername: "AdityaShah2811"
```

## 🔧 Troubleshooting

### GitHub Stats Not Loading

- Check your GitHub username in `data.js`
- Ensure your GitHub profile is public
- Check browser console for API errors

### Calendly Not Working

- Verify your Calendly URL is correct
- Make sure the Calendly script is loading (check browser console)
- Test your Calendly link directly in a browser

### Resume Download Not Working

- Ensure your resume PDF is in the same folder as `index.html`
- Check the filename matches exactly in `data.js`
- Try using a relative path: `./your-resume.pdf`

### Images Not Showing

- Use absolute URLs for images (starting with `https://`)
- Or upload images to your GitHub repo and use relative paths
- Recommended: Use a service like Imgur or GitHub itself

## 📱 Testing

Test your website on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile devices (iPhone, Android)
- Different screen sizes (use browser dev tools)

## 🎓 Tips for Data Science Portfolios

1. **Projects**: Focus on 3-4 strong projects rather than many weak ones
2. **Metrics**: Include specific numbers (accuracy, performance improvements)
3. **Tech Stack**: Clearly show technologies used in each project
4. **GitHub**: Keep your GitHub repos clean with good README files
5. **Resume**: Keep it updated and match it with your portfolio
6. **Contact**: Make it easy for recruiters to reach you

## 📝 Content Guidelines

### Project Descriptions
- Start with the problem you solved
- Include specific metrics and results
- Mention technologies used
- Keep it concise (2-3 lines)

### Experience Bullets
- Use action verbs (Analyzed, Developed, Optimized)
- Include quantifiable results (40% improvement, 10K+ records)
- Focus on data-related achievements

### Skills
- Be honest about proficiency levels
- Use "learning" badge for skills you're currently developing
- Focus on relevant data science skills

## 🚀 Next Steps

1. ✅ Update all content in `data.js`
2. ✅ Add your resume PDF
3. ✅ Upload your profile photo
4. ✅ Set up Calendly
5. ✅ Deploy to GitHub Pages
6. ✅ Test on multiple devices
7. ✅ Share your portfolio link!

## 📞 Support

If you encounter issues:
1. Check the browser console for errors (F12)
2. Verify all URLs in `data.js` are correct
3. Ensure all files are uploaded to GitHub
4. Check GitHub Pages is enabled in settings

## 📄 License

Feel free to use this template for your own portfolio. No attribution required.

---

**Built with ❤️ for Data Scientists**

Good luck with your job search! 🎯
