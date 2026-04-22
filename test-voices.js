// Quick script to list your available ElevenLabs voices
const axios = require('axios');

const ELEVENLABS_API_KEY = 'sk_5c80d7028224139fd2e8b5e0510e73128d727c53f1bd8734';

async function listVoices() {
  try {
    const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    console.log('\n✅ Available Voices:\n');
    response.data.voices.forEach((voice) => {
      console.log(`Name: ${voice.name}`);
      console.log(`Voice ID: ${voice.voice_id}`);
      console.log(`Languages: ${voice.labels?.language || 'N/A'}`);
      console.log('---');
    });

    // Find a good default
    const defaultVoice = response.data.voices[0];
    console.log(`\n📝 Add this to your .env.local:`);
    console.log(`ELEVENLABS_VOICE_ID=${defaultVoice.voice_id}\n`);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

listVoices();
