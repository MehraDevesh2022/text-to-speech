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
    { id: 'en-US-Studio-M', name: 'Studio Male', gender: 'Male' },
    { id: 'en-US-Wavenet-D', name: 'Wavenet Male', gender: 'Male' },
    { id: 'en-US-Standard-B', name: 'Standard Male', gender: 'Male' },
    { id: 'en-US-Wavenet-F', name: 'Wavenet Female', gender: 'Female' },
  ],
  'en-GB': [
    { id: 'en-GB-Neural2-F', name: 'Neural Female (UK)', gender: 'Female' },
    { id: 'en-GB-Wavenet-B', name: 'Wavenet Male (UK)', gender: 'Male' },
    { id: 'en-GB-Standard-D', name: 'Standard Male (UK)', gender: 'Male' },
  ],
  'es-ES': [
    { id: 'es-ES-Neural2-A', name: 'Neural Female (ES)', gender: 'Female' },
    { id: 'es-ES-Wavenet-B', name: 'Wavenet Male (ES)', gender: 'Male' },
    { id: 'es-ES-Standard-B', name: 'Standard Male (ES)', gender: 'Male' },
  ],
  'fr-FR': [
    { id: 'fr-FR-Neural2-A', name: 'Neural Female (FR)', gender: 'Female' },
    { id: 'fr-FR-Wavenet-B', name: 'Wavenet Male (FR)', gender: 'Male' },
    { id: 'fr-FR-Standard-B', name: 'Standard Male (FR)', gender: 'Male' },
  ],
  'de-DE': [
    { id: 'de-DE-Neural2-A', name: 'Neural Female (DE)', gender: 'Female' },
    { id: 'de-DE-Wavenet-B', name: 'Wavenet Male (DE)', gender: 'Male' },
    { id: 'de-DE-Standard-B', name: 'Standard Male (DE)', gender: 'Male' },
  ],
  'it-IT': [
    { id: 'it-IT-Neural2-A', name: 'Neural Female (IT)', gender: 'Female' },
    { id: 'it-IT-Wavenet-B', name: 'Wavenet Male (IT)', gender: 'Male' },
    { id: 'it-IT-Standard-B', name: 'Standard Male (IT)', gender: 'Male' },
  ],
  'ja-JP': [
    { id: 'ja-JP-Neural2-B', name: 'Neural Female (JP)', gender: 'Female' },
    { id: 'ja-JP-Wavenet-C', name: 'Wavenet Male (JP)', gender: 'Male' },
    { id: 'ja-JP-Standard-C', name: 'Standard Male (JP)', gender: 'Male' },
  ],
  'ko-KR': [
    { id: 'ko-KR-Neural2-A', name: 'Neural Female (KO)', gender: 'Female' },
    { id: 'ko-KR-Wavenet-D', name: 'Wavenet Male (KO)', gender: 'Male' },
    { id: 'ko-KR-Standard-D', name: 'Standard Male (KO)', gender: 'Male' },
  ],
  'pt-BR': [
    { id: 'pt-BR-Neural2-A', name: 'Neural Female (BR)', gender: 'Female' },
    { id: 'pt-BR-Wavenet-B', name: 'Wavenet Male (BR)', gender: 'Male' },
    { id: 'pt-BR-Standard-B', name: 'Standard Male (BR)', gender: 'Male' },
  ],
  'zh-CN': [
    { id: 'cmn-CN-Neural2-A', name: 'Neural Female (CN)', gender: 'Female' },
    { id: 'cmn-CN-Wavenet-B', name: 'Wavenet Male (CN)', gender: 'Male' },
    { id: 'cmn-CN-Standard-B', name: 'Standard Male (CN)', gender: 'Male' },
  ],
  'ru-RU': [
    { id: 'ru-RU-Neural2-A', name: 'Neural Female (RU)', gender: 'Female' },
    { id: 'ru-RU-Wavenet-B', name: 'Wavenet Male (RU)', gender: 'Male' },
    { id: 'ru-RU-Standard-B', name: 'Standard Male (RU)', gender: 'Male' },
  ],
  'hi-IN': [
    { id: 'hi-IN-Neural2-A', name: 'Neural Female (HI)', gender: 'Female' },
    { id: 'hi-IN-Wavenet-B', name: 'Wavenet Male (HI)', gender: 'Male' },
    { id: 'hi-IN-Standard-B', name: 'Standard Male (HI)', gender: 'Male' },
  ]
}
};


module.exports = VOICE_OPTIONS