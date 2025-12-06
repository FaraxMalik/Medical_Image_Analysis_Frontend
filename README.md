# Medical Imaging Frontend

Next.js web application for the Medical Imaging AI Platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local and add your Hugging Face API URL
# NEXT_PUBLIC_CT_SCAN_API=https://YOUR_USERNAME-ct-lung-cancer.hf.space
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Dashboard (modality cards)
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── ct-scan/
│   │   ├── page.tsx          # CT scan upload
│   │   └── results/
│   │       └── page.tsx      # Results display
│   ├── mri/                  # Future MRI pages
│   └── xray/                 # Future X-Ray pages
├── components/               # Reusable components (future)
├── lib/                      # Utilities (future)
├── public/                   # Static assets
└── package.json
```

## 🌐 Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/medical-imaging-platform.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Framework Preset: **Next.js** (auto-detected)
6. Root Directory: `frontend`
7. Environment Variables:
   - Add `NEXT_PUBLIC_CT_SCAN_API` with your HF Space URL
8. Click "Deploy"

Your site will be live at: `https://your-project.vercel.app`

### Step 3: Custom Domain (Optional)

In Vercel dashboard:
1. Go to Settings > Domains
2. Add your custom domain
3. Follow DNS configuration steps

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the frontend directory:

```env
# Required
NEXT_PUBLIC_CT_SCAN_API=https://YOUR_USERNAME-ct-lung-cancer.hf.space

# Optional (for future models)
NEXT_PUBLIC_MRI_API=https://YOUR_USERNAME-mri-brain.hf.space
NEXT_PUBLIC_XRAY_API=https://YOUR_USERNAME-xray-bone.hf.space
```

### Modifying Modality Cards

Edit `app/page.tsx` to customize the dashboard cards:

```typescript
const modalities = [
  {
    id: 'ct-scan',
    title: 'Your Title',
    subtitle: 'Your Subtitle',
    description: 'Your description',
    // ... other properties
  },
  // ... more modalities
]
```

## 🎨 Styling

Built with:
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Re-usable components
- **Lucide Icons** - Beautiful icons

To customize colors, edit `tailwind.config.js` and `app/globals.css`.

## 🧪 Testing Locally

1. Make sure backend is running (or use deployed HF Space)
2. Update `.env.local` with correct API URL
3. Run `npm run dev`
4. Navigate to `http://localhost:3000`
5. Test CT scan upload and analysis

## 📝 Adding New Modalities

When you add MRI or X-Ray models:

1. Create new route: `app/mri/page.tsx`
2. Copy structure from `app/ct-scan/page.tsx`
3. Update API endpoint in the component
4. Update modality card in `app/page.tsx` to `status: 'active'`
5. Add environment variable for new API

## 🐛 Troubleshooting

**API connection fails:**
- Check `.env.local` has correct Hugging Face Space URL
- Ensure HF Space is running (not in sleep mode)
- Check CORS settings in backend

**Build fails:**
- Run `npm install` to ensure dependencies are installed
- Check for TypeScript errors: `npm run build`

**Images don't upload:**
- Check file size (max 16MB)
- Verify file type (JPEG, PNG)
- Check browser console for errors

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
