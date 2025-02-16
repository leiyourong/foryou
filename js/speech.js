// 语音服务
const SpeechService = {
    // 语音合成器
    synth: window.speechSynthesis,
    
    // 检查是否在微信浏览器中
    isWechat() {
        return /MicroMessenger/i.test(navigator.userAgent);
    },

    // 检查浏览器是否支持语音合成
    isSpeechSupported() {
        return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    },

    // 初始化语音服务
    init() {
        if (this.isWechat()) {
            // 在微信中显示提示
            this.showWechatTip();
        }
        
        if (this.isSpeechSupported()) {
            // 预加载语音引擎
            this.synth.getVoices();
            // 处理某些浏览器需要等待voices加载的情况
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = () => {
                    this.getChineseVoice();
                    this.getEnglishVoice();
                };
            }
        }
    },

    // 显示微信提示
    showWechatTip() {
        const tip = document.createElement('div');
        tip.className = 'wechat-tip';
        tip.innerHTML = `
            <div class="tip-content">
                <p>提示：在微信中可能无法播放声音</p>
                <p>建议使用系统浏览器打开</p>
                <button onclick="this.parentElement.remove()">知道了</button>
            </div>
        `;
        document.body.appendChild(tip);

        // 添加提示样式
        const style = document.createElement('style');
        style.textContent = `
            .wechat-tip {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                z-index: 1000;
                text-align: center;
                font-size: 14px;
            }
            .tip-content p {
                margin: 5px 0;
            }
            .tip-content button {
                background: #2196F3;
                border: none;
                color: white;
                padding: 5px 15px;
                border-radius: 15px;
                margin-top: 5px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    },
    
    // 获取中文语音
    getChineseVoice() {
        return this.synth.getVoices().find(voice => 
            voice.lang.includes('zh') || voice.lang.includes('cmn')
        );
    },

    // 获取英文语音
    getEnglishVoice() {
        return this.synth.getVoices().find(voice => 
            voice.lang.includes('en-US') || voice.lang.includes('en-GB')
        );
    },

    // 播放中文祝贺语音
    playCongratulations() {
        if (!this.isSpeechSupported()) return;

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

    // 播放单词
    playWord(text, lang = 'en') {
        if (!this.isSpeechSupported()) return;

        // 取消当前正在播放的语音
        this.synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = lang === 'zh' ? this.getChineseVoice() : this.getEnglishVoice();
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // 添加错误处理
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            // 如果发生错误，可以尝试使用备用声音
            if (!utterance.voice) {
                utterance.voice = null; // 使用系统默认声音
                this.synth.speak(utterance);
            }
        };

        this.synth.speak(utterance);
    }
};

// 初始化语音服务
SpeechService.init();

// 导出语音服务
window.SpeechService = SpeechService;

// 全局播放函数
window.speakWord = function(text, lang) {
    SpeechService.playWord(text, lang);
}; 