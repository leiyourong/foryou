// 语音服务
const SpeechService = {
    // 语音合成器
    synth: window.speechSynthesis,
    
    // 获取中文语音
    getChineseVoice() {
        return this.synth.getVoices().find(voice => 
            voice.lang.includes('zh') || voice.lang.includes('cmn')
        );
    },

    // 获取英文语音
    getEnglishVoice() {
        return this.synth.getVoices().find(voice => 
            voice.lang.includes('en-US')
        );
    },

    // 播放中文祝贺语音
    playCongratulations() {
        const phrases = [
            "你真棒！",
            "太厉害了！",
            "完美！",
            "做得太好了！",
            "真是个小天才！"
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        const utterance = new SpeechSynthesisUtterance(randomPhrase);
        utterance.voice = this.getChineseVoice();
        utterance.rate = 1;
        utterance.pitch = 1.2;
        utterance.volume = 1;
        
        this.synth.speak(utterance);
    },

    // 播放英文字母
    playLetter(letter) {
        // 取消当前正在播放的语音
        this.synth.cancel();
        
        // 构建更清晰的发音描述
        const description = this.getLetterDescription(letter);
        
        const utterance = new SpeechSynthesisUtterance(description);
        utterance.voice = this.getEnglishVoice();
        utterance.rate = 0.8;     // 放慢语速提高清晰度
        utterance.pitch = 1.2;    // 略微提高音调增加辨识度
        utterance.volume = 1;     // 最大音量
        
        // 在字母前后添加短暂停顿，提高辨识度
        this.synth.speak(utterance);
    },

    // 获取字母的发音描述
    getLetterDescription(letter) {
        const isUpperCase = letter === letter.toUpperCase();
        // 在字母前后添加语音停顿标记，提高辨识度
        return `${isUpperCase ? 'big' : 'small'} ${letter}`;
    }
};

// 导出语音服务
window.SpeechService = SpeechService; 