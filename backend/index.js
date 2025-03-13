const express = require('express');
const cors = require('cors');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const textToSpeech = require('@google-cloud/text-to-speech');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION;
const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Available voice options by language
const VOICE_OPTIONS = {
  azure: {
    'en-US': [
      { id: 'en-US-JennyNeural', name: 'Jenny (Female)', gender: 'Female' },
      { id: 'en-US-GuyNeural', name: 'Guy (Male)', gender: 'Male' },
      { id: 'en-US-AriaNeural', name: 'Aria (Female)', gender: 'Female' },
      { id: 'en-US-DavisNeural', name: 'Davis (Male)', gender: 'Male' }
    ],
    'en-GB': [
      { id: 'en-GB-SoniaNeural', name: 'Sonia (Female)', gender: 'Female' },
      { id: 'en-GB-RyanNeural', name: 'Ryan (Male)', gender: 'Male' }
    ],
    'es-ES': [
      { id: 'es-ES-ElviraNeural', name: 'Elvira (Female)', gender: 'Female' },
      { id: 'es-ES-AlvaroNeural', name: 'Alvaro (Male)', gender: 'Male' }
    ],
    'fr-FR': [
      { id: 'fr-FR-DeniseNeural', name: 'Denise (Female)', gender: 'Female' },
      { id: 'fr-FR-HenriNeural', name: 'Henri (Male)', gender: 'Male' }
    ],
    'de-DE': [
      { id: 'de-DE-KatjaNeural', name: 'Katja (Female)', gender: 'Female' },
      { id: 'de-DE-ConradNeural', name: 'Conrad (Male)', gender: 'Male' }
    ],
    'it-IT': [
      { id: 'it-IT-ElsaNeural', name: 'Elsa (Female)', gender: 'Female' },
      { id: 'it-IT-DiegoNeural', name: 'Diego (Male)', gender: 'Male' }
    ],
    'ja-JP': [
      { id: 'ja-JP-NanamiNeural', name: 'Nanami (Female)', gender: 'Female' },
      { id: 'ja-JP-KeitaNeural', name: 'Keita (Male)', gender: 'Male' }
    ],
    'ko-KR': [
      { id: 'ko-KR-SunHiNeural', name: 'SunHi (Female)', gender: 'Female' },
      { id: 'ko-KR-InJoonNeural', name: 'InJoon (Male)', gender: 'Male' }
    ],
    'pt-BR': [
      { id: 'pt-BR-FranciscaNeural', name: 'Francisca (Female)', gender: 'Female' },
      { id: 'pt-BR-AntonioNeural', name: 'Antonio (Male)', gender: 'Male' }
    ],
    'zh-CN': [
      { id: 'zh-CN-XiaoxiaoNeural', name: 'Xiaoxiao (Female)', gender: 'Female' },
      { id: 'zh-CN-YunxiNeural', name: 'Yunxi (Male)', gender: 'Male' }
    ],
    'ru-RU': [
      { id: 'ru-RU-SvetlanaNeural', name: 'Svetlana (Female)', gender: 'Female' },
      { id: 'ru-RU-DmitryNeural', name: 'Dmitry (Male)', gender: 'Male' }
    ],
    'hi-IN': [
      { id: 'hi-IN-SwaraNeural', name: 'Swara (Female)', gender: 'Female' },
      { id: 'hi-IN-MadhurNeural', name: 'Madhur (Male)', gender: 'Male' }
    ]
  },
  google: {
    'en-US': [
      { id: 'en-US-Neural2-F', name: 'Neural Female', gender: 'Female' },
      { id: 'en-US-Neural2-M', name: 'Neural Male', gender: 'Male' },
      { id: 'en-US-Wavenet-F', name: 'Wavenet Female', gender: 'Female' },
      { id: 'en-US-Wavenet-M', name: 'Wavenet Male', gender: 'Male' }
    ],
    'en-GB': [
      { id: 'en-GB-Neural2-F', name: 'Neural Female (UK)', gender: 'Female' },
      { id: 'en-GB-Neural2-M', name: 'Neural Male (UK)', gender: 'Male' }
    ],
    'es-ES': [
      { id: 'es-ES-Neural2-A', name: 'Neural Female (ES)', gender: 'Female' },
      { id: 'es-ES-Neural2-C', name: 'Neural Male (ES)', gender: 'Male' }
    ],
    'fr-FR': [
      { id: 'fr-FR-Neural2-A', name: 'Neural Female (FR)', gender: 'Female' },
      { id: 'fr-FR-Neural2-D', name: 'Neural Male (FR)', gender: 'Male' }
    ],
    'de-DE': [
      { id: 'de-DE-Neural2-A', name: 'Neural Female (DE)', gender: 'Female' },
      { id: 'de-DE-Neural2-D', name: 'Neural Male (DE)', gender: 'Male' }
    ],
    'it-IT': [
      { id: 'it-IT-Neural2-A', name: 'Neural Female (IT)', gender: 'Female' },
      { id: 'it-IT-Neural2-C', name: 'Neural Male (IT)', gender: 'Male' }
    ],
    'ja-JP': [
      { id: 'ja-JP-Neural2-B', name: 'Neural Female (JP)', gender: 'Female' },
      { id: 'ja-JP-Neural2-D', name: 'Neural Male (JP)', gender: 'Male' }
    ],
    'ko-KR': [
      { id: 'ko-KR-Neural2-A', name: 'Neural Female (KO)', gender: 'Female' },
      { id: 'ko-KR-Neural2-C', name: 'Neural Male (KO)', gender: 'Male' }
    ],
    'pt-BR': [
      { id: 'pt-BR-Neural2-A', name: 'Neural Female (BR)', gender: 'Female' },
      { id: 'pt-BR-Neural2-B', name: 'Neural Male (BR)', gender: 'Male' }
    ],
    'zh-CN': [
      { id: 'cmn-CN-Neural2-A', name: 'Neural Female (CN)', gender: 'Female' },
      { id: 'cmn-CN-Neural2-C', name: 'Neural Male (CN)', gender: 'Male' }
    ],
    'ru-RU': [
      { id: 'ru-RU-Neural2-A', name: 'Neural Female (RU)', gender: 'Female' },
      { id: 'ru-RU-Neural2-D', name: 'Neural Male (RU)', gender: 'Male' }
    ],
    'hi-IN': [
      { id: 'hi-IN-Neural2-A', name: 'Neural Female (HI)', gender: 'Female' },
      { id: 'hi-IN-Neural2-B', name: 'Neural Male (HI)', gender: 'Male' }
    ]
  }
};

async function azureTextToSpeech(text, voiceId = 'en-US-JennyNeural') {
  return new Promise((resolve, reject) => {
    if (!AZURE_SPEECH_KEY || !AZURE_SPEECH_REGION) {
      return reject(new Error('Azure Speech credentials are not configured'));
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_SPEECH_REGION);
    speechConfig.speechSynthesisVoiceName = voiceId;
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
    
    const pullStream = sdk.AudioOutputStream.createPullStream();
    const audioConfig = sdk.AudioConfig.fromStreamOutput(pullStream);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    
    synthesizer.speakTextAsync(
      text,
      result => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const audioData = result.audioData;
          resolve(Buffer.from(audioData));
        } else {
          const cancelationDetails = sdk.CancellationDetails.fromResult(result);
          reject(new Error(`Speech synthesis canceled: ${cancelationDetails.reason}`));
        }
        synthesizer.close();
      },
      error => {
        synthesizer.close();
        reject(error);
      }
    );
  });
}

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

// Get available voices for a specific language
app.get('/voices', (req, res) => {
  const language = req.query.language || 'en-US';
  
  // Create a response with available voices for the requested language
  const response = {
    azure: VOICE_OPTIONS.azure[language] || VOICE_OPTIONS.azure['en-US'],
    google: VOICE_OPTIONS.google[language] || VOICE_OPTIONS.google['en-US']
  };
  
  res.json(response);
});

// Get all supported languages
app.get('/languages', (req, res) => {
  // Extract unique language codes from voice options
  const languages = Object.keys(VOICE_OPTIONS.azure).map(code => {
    // Map language codes to their names
    const nameMap = {
      'en-US': 'English (US)',
      'en-GB': 'English (UK)',
      'es-ES': 'Spanish',
      'fr-FR': 'French',
      'de-DE': 'German',
      'it-IT': 'Italian',
      'ja-JP': 'Japanese',
      'ko-KR': 'Korean',
      'pt-BR': 'Portuguese',
      'zh-CN': 'Chinese (Simplified)',
      'ru-RU': 'Russian',
      'hi-IN': 'Hindi'
    };
    
    return {
      code: code,
      name: nameMap[code] || code
    };
  });
  
  res.json(languages);
});

// Route for text-to-speech conversion
app.post('/text-to-speech', async (req, res) => {
  try {
    const { text, model, voiceId, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    let audioBuffer;
    
    if (model === 'azure') {
      audioBuffer = await azureTextToSpeech(text, voiceId);
    } else if (model === 'google') {
      audioBuffer = await googleTextToSpeech(text, voiceId, language);
    } else {
      return res.status(400).json({ error: 'Invalid model specified' });
    }

    // Generate a filename based on timestamp and text
    const timestamp = new Date().getTime();
    const sanitizedText = text.slice(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `tts_${sanitizedText}_${timestamp}.mp3`;

    // Set the appropriate headers for download
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    // Send the audio data
    res.send(audioBuffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});