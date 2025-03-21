const textToSpeech = require('@google-cloud/text-to-speech');
const dotenv = require('dotenv');
dotenv.config();
const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;

async function googleTextToSpeech(text, voiceId = 'en-US-Neural2-F', languageCode = 'en-US') {
    try {
      if (!GOOGLE_APPLICATION_CREDENTIALS) {
        throw new Error('Google Cloud credentials file path is not configured');
      }
  
      // Extract the language code from voice ID if needed
      const effectiveLanguageCode = languageCode || voiceId.split('-').slice(0, 2).join('-');
      
      const client = new textToSpeech.TextToSpeechClient();
      const request = {
        input: { text: text },
        voice: {
          languageCode: effectiveLanguageCode,
          name: voiceId,
          ssmlGender: voiceId.includes('F') || voiceId.includes('A') ? 'FEMALE' : 'MALE',
        },
        audioConfig: { 
          audioEncoding: 'MP3',
          pitch: 0,
          speakingRate: 1.0,
          volumeGainDb: 0.0
        },
      };
  
      const [response] = await client.synthesizeSpeech(request);
      return Buffer.from(response.audioContent);
    } catch (error) {
      console.error('Google TTS API error:', error);
      throw new Error(`Failed to convert text to speech using Google TTS: ${error.message}`);
    }
  }

  module.exports = googleTextToSpeech