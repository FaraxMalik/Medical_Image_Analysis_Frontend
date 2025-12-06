# 🚀 Deploy Frontend to Vercel

## Prerequisites

- GitHub account (free): https://github.com/join
- Vercel account (free): https://vercel.com/signup
- Git installed on your computer

---

## Step 1: Push to GitHub

### Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `medical-imaging-frontend`
3. Description: "AI Medical Imaging Analysis Platform"
4. Visibility: **Public** (or Private if you prefer)
5. Click **Create repository**

### Push Your Code

```powershell
# Navigate to frontend folder
cd C:\Users\INSPIRON\Desktop\FYP-1\medical-imaging-platform\frontend

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Medical Imaging AI Platform"

# Add GitHub remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/medical-imaging-frontend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Connect GitHub to Vercel

1. Go to https://vercel.com/new
2. Click **Continue with GitHub**
3. Authorize Vercel to access your GitHub

### Import Your Repository

1. Find `medical-imaging-frontend` in the list
2. Click **Import**

### Configure Project

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `./` (leave as is)

**Build Settings**: (auto-configured, leave as is)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables**: Click **Add** and enter:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_CT_SCAN_API` | `https://faraz278-medical-image-analysis.hf.space` |

### Deploy!

1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://medical-imaging-frontend.vercel.app`

---

## Step 3: Test Your Live Website

Once deployed, your website will be live at:
```
https://YOUR-PROJECT-NAME.vercel.app
```

**Test it:**
1. Visit your Vercel URL
2. Click "CT Scan Analysis"
3. Upload a CT scan image
4. Verify it connects to your Hugging Face backend

---

## Step 4: Custom Domain (Optional)

### Free Vercel Subdomain
You automatically get: `your-project.vercel.app`

### Custom Domain
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain (if you have one)
3. Update DNS records as instructed

---

## Updating Your Website

Every time you push to GitHub, Vercel automatically redeploys:

```powershell
# Make changes to your code
# Then:

git add .
git commit -m "Updated feature X"
git push

# Vercel automatically deploys in 2-3 minutes
```

---

## Environment Variables (Update Later)

When you add MRI/X-Ray models:

1. Go to Vercel dashboard → Project → Settings → Environment Variables
2. Add new variables:
   - `NEXT_PUBLIC_MRI_API`
   - `NEXT_PUBLIC_XRAY_API`
3. Redeploy (Production → ⋮ → Redeploy)

---

## Troubleshooting

### Build Failed
Check Vercel build logs for errors. Common issues:
- Missing dependencies in `package.json`
- TypeScript errors
- Environment variables not set

### API Connection Failed
- Verify `NEXT_PUBLIC_CT_SCAN_API` is set correctly
- Check Hugging Face Space is running
- Check CORS settings in backend

### Images Not Loading
- Check `next.config.js` image domains
- Verify image paths are correct

---

## Your Deployment URLs

After completion, you'll have:

✅ **Frontend**: `https://your-project.vercel.app`  
✅ **Backend**: `https://faraz278-medical-image-analysis.hf.space`

Share the Vercel URL with anyone to use your AI platform! 🎉
