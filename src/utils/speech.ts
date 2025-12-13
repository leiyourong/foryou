const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;

const getVoice = (matcher: (lang: string) => boolean): SpeechSynthesisVoice | null => {
  if (!synth) return null;
  return synth.getVoices().find((voice) => matcher(voice.lang)) || null;
};

export const isSpeechSupported = typeof window !== 'undefined' && !!window.speechSynthesis;

export const playWord = (text: string, lang: 'en' | 'zh' = 'en') => {
  if (!isSpeechSupported || !synth) return;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = lang === 'zh'
    ? getVoice((l) => l.includes('zh') || l.includes('cmn'))
    : getVoice((l) => l.includes('en-US') || l.includes('en-GB'));
  utterance.voice = voice;
  utterance.rate = lang === 'zh' ? 1 : 0.85;
  utterance.pitch = 1;
  synth?.speak(utterance);
};

export const playCongratulations = () => {
  if (!isSpeechSupported) return;
  const phrases = ['你真棒！', '太厉害了！', '完美！', '继续保持！', '真是个小天才！'];
  playWord(phrases[Math.floor(Math.random() * phrases.length)], 'zh');
};

