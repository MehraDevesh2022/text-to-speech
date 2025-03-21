const express = require('express');
const cors = require('cors');
const azureTextToSpeech  = require("./azure-tts");
const googleTextToSpeech  = require("./gcp-tts");

const dotenv = require('dotenv');
const VOICE_OPTIONS  = require("./utils/voices");
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const tempFilePath = path.join('/tmp', 'gcp-credentials.json');
    
    let credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    
    if (typeof credentialsJson === 'string') {
      try {
        const parsed = JSON.parse(credentialsJson);
        credentialsJson = JSON.stringify(parsed);
      } catch (jsonError) {
        console.error('Invalid JSON format for credentials:', jsonError);
      }
    }
    
    fs.writeFileSync(tempFilePath, credentialsJson);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = tempFilePath;

  } else {
    console.log('Using local Google credentials file path');
  }
} catch (error) {
  console.error('Failed to set up Google credentials:', error);
}









// Get available voices for a specific language
app.get('/voices',(req, res) => {
  try {
    const language = req.query.language || 'en-US';
  
  // Create a response with available voices for the requested language
  const response = {
    azure: VOICE_OPTIONS.azure[language] || VOICE_OPTIONS.azure['en-US'],
    google: VOICE_OPTIONS.google[language] || VOICE_OPTIONS.google['en-US']
  };
   res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
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
    const { text, model, voiceId, language, options } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Validate the text length to prevent oversized requests
    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text exceeds maximum length of 5000 characters' });
    }

    let audioBuffer;
    
    if (model === 'azure') {
      audioBuffer = await azureTextToSpeech(text, voiceId, options);
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