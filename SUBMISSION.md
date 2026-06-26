# Syntra AI Speed Run - Submission Checklist

Here is your completed project build, video demo, and deployment guide to finalize your Phase 1 speed run.

## 1. Demo Video (Ready)
We recorded a high-fidelity video of all the interactive layouts (Bento context lock, pricing calculation, toasts, responsive accordion transitions).
- File Location in your workspace: **[demo_video.webp](file:///Users/gagan/teaproject/teaproject/demo_video.webp)** (Size: ~15MB, well below the 100MB cap).
- *Action required*: Upload this `demo_video.webp` to your Google Drive and copy the sharing link for the submission form.

---

## 2. Public GitHub Repository (Prepared)
We initialized a Git repository and committed all project files (including the demo video).

**Steps to push online:**
1. Open your terminal in this directory (`/Users/gagan/teaproject/teaproject`).
2. Create a new **public** repository on your GitHub account named e.g., `syntra-ai-landing`.
3. Link and push using these commands:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## 3. Live Deployment Link (Ready to Publish)
You can deploy the built folder in under 30 seconds using **Vercel** or **Netlify**:

### Option A: Vercel (Recommended)
1. Run this command in your terminal:
   ```bash
   npx vercel
   ```
2. Follow the prompts (use default options). It will build and output your **live deployment link**.

### Option B: Netlify
1. Run a production build:
   ```bash
   npm run build
   ```
2. Deploy the build output:
   ```bash
   npx netlify-cli deploy --dir=dist --prod
   ```
3. Copy the live production URL provided in the command output.
