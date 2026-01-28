# 🚀 Quick Deployment Guide

## Step-by-Step: Get Your Portfolio Live in 10 Minutes

### Step 1: Update Your Content (5 minutes)

Open `data.js` and update:

1. **Line 8-15**: Your personal information
   - Name, title, tagline
   - Email, phone, location
   - GitHub username

2. **Line 18-23**: Social media links
   - GitHub profile URL
   - LinkedIn profile URL
   - Email (mailto:)

3. **Line 26-35**: About section
   - Write your bio (3-4 sentences)
   - Update quick facts

4. **Line 38-67**: Skills with proficiency levels
   - Adjust percentages based on your comfort level
   - Add/remove skills as needed

5. **Line 70-120**: Projects
   - Update project titles and descriptions
   - Add your GitHub repo links
   - Replace placeholder images

6. **Line 123-150**: Work experience
   - Update job titles, companies, dates
   - Modify bullet points

7. **Line 153-175**: Education and certifications
   - Add your degrees
   - List your certifications

### Step 2: Add Your Files (2 minutes)

1. **Profile Photo**:
   - Upload your photo to GitHub or Imgur
   - Copy the URL
   - Paste in `data.js` line 11: `photo: "YOUR-PHOTO-URL"`

2. **Resume PDF**:
   - Rename your resume to `Aditya_Shah_DS_Resume.pdf`
   - Or update the filename in `data.js` line 14

### Step 3: Deploy to GitHub Pages (3 minutes)

#### Option A: GitHub Web Interface (Easiest)

1. Go to [github.com](https://github.com) and sign in
2. Click "New repository" (green button)
3. Name it: `YOUR-USERNAME.github.io` (replace YOUR-USERNAME)
4. Make it Public
5. Click "Create repository"
6. Click "uploading an existing file"
7. Drag and drop all files:
   - `index.html`
   - `data.js`
   - `README.md`
   - Your resume PDF
8. Click "Commit changes"
9. Go to Settings → Pages
10. Under "Source", select "main" branch
11. Click "Save"
12. Wait 1-2 minutes
13. Visit `https://YOUR-USERNAME.github.io`

#### Option B: Git Command Line

```bash
# Navigate to your project folder
cd path/to/your/portfolio

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial portfolio"

# Add your GitHub repo (create it first on GitHub)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git

# Push
git push -u origin main
```

Then enable GitHub Pages in repository settings.

### Step 4: Set Up Calendly (Optional - 5 minutes)

1. Go to [calendly.com](https://calendly.com)
2. Sign up for free account
3. Create a new event type: "15 Minute Meeting"
4. Copy your Calendly link (looks like: `https://calendly.com/YOUR-NAME/15min`)
5. Paste in `data.js` line 15: `calendlyURL: "YOUR-CALENDLY-LINK"`
6. Commit and push the change

### Step 5: Test Your Site (2 minutes)

Visit your site and check:
- ✅ All sections load correctly
- ✅ Social links work
- ✅ Resume downloads
- ✅ GitHub stats appear (may take a few seconds)
- ✅ Smooth scrolling works
- ✅ Mobile responsive (test on phone)

## 🎯 Quick Checklist

Before sharing your portfolio:

- [ ] Updated all personal information in `data.js`
- [ ] Added real profile photo
- [ ] Uploaded resume PDF
- [ ] Updated project descriptions
- [ ] Added GitHub repo links
- [ ] Set up Calendly (optional)
- [ ] Tested all links
- [ ] Checked on mobile device
- [ ] Verified GitHub stats load
- [ ] Proofread all text for typos

## 🔄 Making Updates

To update your portfolio after deployment:

1. Edit `data.js` locally
2. Commit changes: `git add data.js && git commit -m "Update content"`
3. Push: `git push`
4. Changes appear in 1-2 minutes

## 🆘 Common Issues

**Issue**: GitHub Pages not working
- **Fix**: Make sure repo is named `YOUR-USERNAME.github.io` exactly
- **Fix**: Check that GitHub Pages is enabled in Settings

**Issue**: Images not showing
- **Fix**: Use full URLs starting with `https://`
- **Fix**: Upload images to GitHub repo and use relative paths

**Issue**: Resume won't download
- **Fix**: Make sure PDF is in same folder as `index.html`
- **Fix**: Check filename matches exactly in `data.js`

**Issue**: GitHub stats show "--"
- **Fix**: Check your GitHub username in `data.js`
- **Fix**: Wait a few seconds for API to load
- **Fix**: Check browser console (F12) for errors

## 📱 Share Your Portfolio

Once live, share your portfolio:

- Add to LinkedIn profile (Featured section)
- Include in resume header
- Add to email signature
- Share on Twitter/X
- Include in job applications

Your portfolio URL: `https://YOUR-USERNAME.github.io`

---

**Need help?** Check the main README.md for detailed documentation.

**Ready to deploy?** Follow the steps above and you'll be live in minutes! 🚀
