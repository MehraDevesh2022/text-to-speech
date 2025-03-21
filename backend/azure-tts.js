const sdk = require('microsoft-cognitiveservices-speech-sdk');
const dotenv = require('dotenv');
dotenv.config();
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION;


// Helper function to escape text for SSML
function escapeSSML(text) {
    return text
    //   .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  } 
  

async function azureTextToSpeech(text, voiceId = 'en-US-JennyNeural', options = {}) {
    return new Promise((resolve, reject) => {
      if (!AZURE_SPEECH_KEY || !AZURE_SPEECH_REGION) {
        return reject(new Error('Azure Speech credentials are not configured')); 
      }
  
      try {
        // Create and configure the speech config with extended timeout
        const speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_SPEECH_REGION);
        speechConfig.speechSynthesisVoiceName = voiceId;
        speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
        
        // Set connection timeout (in milliseconds)
        speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs, "10000");
        speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs, "10000");
        speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_KeepAlive, "true");
        
        // Create audio config and synthesizer
        const pullStream = sdk.AudioOutputStream.createPullStream();
        const audioConfig = sdk.AudioConfig.fromStreamOutput(pullStream);
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
  
        // Prepare the text or SSML input
        let input;
        
        // Safely escape the text for SSML use
        const safeText = escapeSSML(text);
        
        if (options.prosody) {
          // Apply prosody with properly constructed SSML
          let { rate, pitch, volume } = options.prosody;
          
          // Ensure values are within acceptable ranges (enforce limits)
          rate = Math.max(0.5, Math.min(2.0, rate));
          pitch = Math.max(-12, Math.min(12, pitch));
          volume = Math.max(0.1, Math.min(2.0, volume));
          
          // Format the prosody attributes correctly
          let rateValue, pitchValue, volumeValue;
          
          // Format rate
          if (Math.abs(rate - 1.0) < 0.01) {
            rateValue = "medium";
          } else {
            rateValue = rate.toFixed(1);
          }
          
          // Format pitch with proper + sign for positive values
          if (Math.abs(pitch) < 0.01) {
            pitchValue = "medium";
          } else if (pitch > 0) {
            pitchValue = `+${pitch.toFixed(0)}st`;
          } else {
            pitchValue = `${pitch.toFixed(0)}st`;
          }
          
          // Format volume
          if (Math.abs(volume - 1.0) < 0.01) {
            volumeValue = "medium";
          } else {
            volumeValue = volume.toFixed(1);
          }
          
          console.log(`Using prosody values - Rate: ${rateValue}, Pitch: ${pitchValue}, Volume: ${volumeValue}`);
          
          // Construct valid SSML with properly nested elements
          input = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
            <voice name="${voiceId}">
              <prosody rate="${rateValue}" pitch="${pitchValue}" volume="${volumeValue}">
                ${safeText}
              </prosody>
            </voice>
          </speak>`;
          
          console.log("Using SSML input with prosody:");
          console.log(input);
        } else {
          // Use plain text if no prosody
          input = text;
        }
        
        // Add connection event listeners for better debugging
        synthesizer.connectionOpened = (s, e) => {
          console.log("Azure TTS: Connection opened");
        };
        
        synthesizer.connectionClosed = (s, e) => {
          console.log("Azure TTS: Connection closed");
        };
        
        synthesizer.synthesizing = (s, e) => {
          console.log("Azure TTS: Synthesizing...");
        };
        
        // Call the appropriate method based on whether we're using SSML
        const method = options.prosody ? 'speakSsmlAsync' : 'speakTextAsync';
        console.log(`Using ${method} for Azure TTS ${options.prosody ? 'with custom prosody' : 'with default settings'}`);
        
        synthesizer[method](
          input,
          result => {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
              console.log("Azure TTS: Audio synthesis completed successfully");
              const audioData = result.audioData;
              synthesizer.close();
              resolve(Buffer.from(audioData));
            } else {
              const cancelationDetails = sdk.CancellationDetails.fromResult(result);
              const reasonCode = cancelationDetails.reason;
              const errorDetails = cancelationDetails.errorDetails || 'Not provided';
              
              console.log(`Azure TTS cancellation details - Code: ${reasonCode}, Error: ${errorDetails}`);
              
              // Create detailed error message based on the reason code
              let errorMessage = 'Speech synthesis canceled';
              switch(reasonCode) {
                case sdk.CancellationReason.Error:
                  errorMessage = `Azure TTS error: ${errorDetails}`;
                  break;
                case sdk.CancellationReason.EndOfStream:
                  errorMessage = 'Azure TTS stream ended unexpectedly';
                  break;
                case sdk.CancellationReason.CancelledByUser:
                  errorMessage = 'Azure TTS canceled by user';
                  break;
                case 0:
                  // Common case for network or authentication issues
                  errorMessage = 'Azure TTS connection issue - Please check your Azure credentials and network connectivity';
                  break;
                default:
                  errorMessage = `Azure TTS canceled with reason code: ${reasonCode}`;
              }
              
              synthesizer.close();
              reject(new Error(errorMessage));
            }
          },
          error => {
            console.error("Azure TTS error during synthesis:", error);
            synthesizer.close();
            reject(error);
          }
        );
      } catch (setupError) {
        console.error("Error setting up Azure TTS:", setupError);
        reject(setupError);
      }
    });
  }

  module.exports =azureTextToSpeech