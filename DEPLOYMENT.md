# 🚀 Deployment Guide

## Option 1: Deploy to Vercel (Recommended - 2 minutes)

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- OpenAI API key
- ElevenLabs API key

### Steps

1. **Push to GitHub**
   ```bash
   # Initialize git repo (if not already done)
   cd bangla-voice-support
   git add .
   git commit -m "Initial commit: Bangla voice support agent"

   # Create a new GitHub repo and push
   # (Follow GitHub's instructions to create a new repository)
   git remote add origin https://github.com/YOUR_USERNAME/bangla-voice-support.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables**

   In Vercel's deployment settings, add these variables:

   | Name | Value | Where to Get |
   |------|-------|--------------|
   | `OPENAI_API_KEY` | sk-... | https://platform.openai.com/api-keys |
   | `ELEVENLABS_API_KEY` | ... | https://elevenlabs.io/app/settings/api-keys |
   | `ELEVENLABS_VOICE_ID` | (optional) | https://elevenlabs.io/app/voice-library |

4. **Deploy**
   - Click "Deploy"
   - Wait ~60 seconds
   - Your app will be live at `https://your-project.vercel.app`

---

## Option 2: Deploy to Railway

1. **Push to GitHub** (same as above)

2. **Deploy to Railway**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add environment variables in Railway dashboard
   - Deploy!

---

## Option 3: Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. **Add Environment Variables**
   - Go to Netlify dashboard → Site settings → Environment variables
   - Add `OPENAI_API_KEY` and `ELEVENLABS_API_KEY`
   - Redeploy

---

## Testing Your Deployment

After deployment, test your app:

1. Visit your deployed URL
2. Try asking: "আমার অ্যাকাউন্ট কীভাবে রিসেট করব?"
3. Verify:
   - ✅ Response appears in Bangla
   - ✅ Audio plays automatically
   - ✅ Conversation history works

---

## Troubleshooting

### Error: "API keys not configured"
- Ensure environment variables are set in Vercel/Railway/Netlify dashboard
- Redeploy after adding variables

### Audio not playing
- Check browser console for errors
- Verify ElevenLabs API key is valid
- Test with different voices (update `ELEVENLABS_VOICE_ID`)

### Slow responses
- OpenAI API can take 2-5 seconds for GPT-4
- Consider using `gpt-3.5-turbo` for faster responses (edit `app/api/chat/route.ts:40`)

---

## Cost Estimates (for 1000 requests)

- **OpenAI GPT-4:** ~$0.60 (at 200 tokens/request)
- **ElevenLabs:** ~$0.30 (at 100 characters/request)
- **Hosting (Vercel/Railway):** Free tier available

**Total:** ~$0.90 per 1000 conversations (on free tiers)

---

## Next Steps

Once deployed, you can:

1. Share the live demo URL
2. Add custom domain (Vercel supports this easily)
3. Monitor usage via Vercel Analytics
4. Extend with more features (see README.md)

---

**Need help?** Check the [README.md](./README.md) for more details.
