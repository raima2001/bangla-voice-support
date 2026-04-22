# 🇧🇩 Bangla Voice AI Customer Support Agent

A lightweight demo of a **multilingual voice AI customer support agent** powered by ElevenLabs and OpenAI, targeting the Bangla-speaking market.

## 🎯 Value Proposition

**Problem:** Many businesses in South Asia (Bangladesh, West Bengal, etc.) lack high-quality voice AI solutions in local languages, limiting their ability to provide automated customer support.

**Solution:** This demo showcases how ElevenLabs' multilingual capabilities can power real-time customer support agents in Bangla, a language spoken by 230+ million people.

## ✨ Features

- ✅ **Bangla language support** via GPT-4 and ElevenLabs Multilingual v2
- ✅ **Real-time voice synthesis** for customer support responses
- ✅ **Clean, responsive UI** built with Next.js and Tailwind CSS
- ✅ **Easy deployment** to Vercel (1-click)
- ✅ **Use case:** Telecom customer support (account reset, billing, network issues)

## 🚀 Quick Start (2 minutes)

### 1. Clone and Install

```bash
cd bangla-voice-support
npm install
```

### 2. Set Up API Keys

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Then add your keys:

- **OpenAI API Key:** Get from https://platform.openai.com/api-keys
- **ElevenLabs API Key:** Get from https://elevenlabs.io/app/settings/api-keys

```env
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB  # Optional: choose a voice
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Try It Out

Ask questions like:
- **Bangla:** "আমার অ্যাকাউন্ট কীভাবে রিসেট করব?" (How do I reset my account?)
- **English:** "How do I check my balance?"

The agent will respond in Bangla with both text and voice.

## 🌐 Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables:
   - `OPENAI_API_KEY`
   - `ELEVENLABS_API_KEY`
   - `ELEVENLABS_VOICE_ID` (optional)
5. Deploy!

Your live demo will be ready in ~60 seconds.

## 🎙️ Customizing the Voice

ElevenLabs offers 70+ languages and hundreds of voices. To change the voice:

1. Browse voices at https://elevenlabs.io/app/voice-library
2. Copy the Voice ID
3. Update `ELEVENLABS_VOICE_ID` in `.env.local`

## 💡 Use Cases

This demo can be adapted for:

- **Telecom:** Customer support, plan inquiries
- **Fintech:** Account management, transaction queries
- **Healthcare:** Appointment booking, medication reminders
- **E-commerce:** Order tracking, returns/refunds
- **Government services:** Public information, form assistance

## 🔧 Tech Stack

- **Frontend:** Next.js 16, React, Tailwind CSS
- **AI:** OpenAI GPT-4 (conversation logic)
- **Voice:** ElevenLabs Multilingual v2 (text-to-speech)
- **Deployment:** Vercel (serverless)

