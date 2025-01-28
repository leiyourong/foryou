// ABC kids 单词数据
const vocabularyData = {
    lesson1: [
        { english: "apple", chinese: "苹果", phonetic: "/ˈæpl/" },
        { english: "banana", chinese: "香蕉", phonetic: "/bəˈnɑːnə/" },
        { english: "cat", chinese: "猫", phonetic: "/kæt/" },
        { english: "dog", chinese: "狗", phonetic: "/dɔːɡ/" },
        { english: "elephant", chinese: "大象", phonetic: "/ˈelɪfənt/" },
        { english: "fish", chinese: "鱼", phonetic: "/fɪʃ/" },
        { english: "giraffe", chinese: "长颈鹿", phonetic: "/dʒɪˈrɑːf/" },
        { english: "horse", chinese: "马", phonetic: "/hɔːrs/" }
    ],
    lesson2: [
        { english: "red", chinese: "红色", phonetic: "/red/" },
        { english: "blue", chinese: "蓝色", phonetic: "/bluː/" },
        { english: "green", chinese: "绿色", phonetic: "/ɡriːn/" },
        { english: "yellow", chinese: "黄色", phonetic: "/ˈjeloʊ/" },
        { english: "black", chinese: "黑色", phonetic: "/blæk/" },
        { english: "white", chinese: "白色", phonetic: "/waɪt/" },
        { english: "pink", chinese: "粉色", phonetic: "/pɪŋk/" },
        { english: "purple", chinese: "紫色", phonetic: "/ˈpɜːrpl/" }
    ],
    lesson3: [
        { english: "one", chinese: "一", phonetic: "/wʌn/" },
        { english: "two", chinese: "二", phonetic: "/tuː/" },
        { english: "three", chinese: "三", phonetic: "/θriː/" },
        { english: "four", chinese: "四", phonetic: "/fɔːr/" },
        { english: "five", chinese: "五", phonetic: "/faɪv/" },
        { english: "six", chinese: "六", phonetic: "/sɪks/" },
        { english: "seven", chinese: "七", phonetic: "/ˈsevn/" },
        { english: "eight", chinese: "八", phonetic: "/eɪt/" }
    ],
    lesson4: [
        { english: "pencil", chinese: "铅笔", phonetic: "/ˈpensl/" },
        { english: "book", chinese: "书", phonetic: "/bʊk/" },
        { english: "pen", chinese: "钢笔", phonetic: "/pen/" },
        { english: "eraser", chinese: "橡皮", phonetic: "/ɪˈreɪsər/" },
        { english: "ruler", chinese: "尺子", phonetic: "/ˈruːlər/" },
        { english: "bag", chinese: "书包", phonetic: "/bæɡ/" },
        { english: "desk", chinese: "桌子", phonetic: "/desk/" },
        { english: "chair", chinese: "椅子", phonetic: "/tʃer/" }
    ],
    lesson5: [
        { english: "mother", chinese: "妈妈", phonetic: "/ˈmʌðər/" },
        { english: "father", chinese: "爸爸", phonetic: "/ˈfɑːðər/" },
        { english: "sister", chinese: "姐姐/妹妹", phonetic: "/ˈsɪstər/" },
        { english: "brother", chinese: "哥哥/弟弟", phonetic: "/ˈbrʌðər/" },
        { english: "grandmother", chinese: "奶奶/外婆", phonetic: "/ˈɡrænmʌðər/" },
        { english: "grandfather", chinese: "爷爷/外公", phonetic: "/ˈɡrænfɑːðər/" },
        { english: "family", chinese: "家庭", phonetic: "/ˈfæmɪli/" },
        { english: "friend", chinese: "朋友", phonetic: "/frend/" }
    ],
    lesson6: [
        { english: "happy", chinese: "开心的", phonetic: "/ˈhæpi/" },
        { english: "sad", chinese: "伤心的", phonetic: "/sæd/" },
        { english: "angry", chinese: "生气的", phonetic: "/ˈæŋɡri/" },
        { english: "tired", chinese: "疲倦的", phonetic: "/ˈtaɪərd/" },
        { english: "hungry", chinese: "饿的", phonetic: "/ˈhʌŋɡri/" },
        { english: "thirsty", chinese: "渴的", phonetic: "/ˈθɜːrsti/" },
        { english: "hot", chinese: "热的", phonetic: "/hɒt/" },
        { english: "cold", chinese: "冷的", phonetic: "/koʊld/" }
    ],
    lesson7: [
        { english: "head", chinese: "头", phonetic: "/hed/" },
        { english: "eye", chinese: "眼睛", phonetic: "/aɪ/" },
        { english: "nose", chinese: "鼻子", phonetic: "/noʊz/" },
        { english: "mouth", chinese: "嘴巴", phonetic: "/maʊθ/" },
        { english: "ear", chinese: "耳朵", phonetic: "/ɪr/" },
        { english: "hand", chinese: "手", phonetic: "/hænd/" },
        { english: "foot", chinese: "脚", phonetic: "/fʊt/" },
        { english: "leg", chinese: "腿", phonetic: "/leɡ/" }
    ],
    lesson8: [
        { english: "sun", chinese: "太阳", phonetic: "/sʌn/" },
        { english: "moon", chinese: "月亮", phonetic: "/muːn/" },
        { english: "star", chinese: "星星", phonetic: "/stɑːr/" },
        { english: "cloud", chinese: "云", phonetic: "/klaʊd/" },
        { english: "rain", chinese: "雨", phonetic: "/reɪn/" },
        { english: "snow", chinese: "雪", phonetic: "/snoʊ/" },
        { english: "wind", chinese: "风", phonetic: "/wɪnd/" },
        { english: "sky", chinese: "天空", phonetic: "/skaɪ/" }
    ],
    lesson9: [
        { english: "bread", chinese: "面包", phonetic: "/bred/" },
        { english: "milk", chinese: "牛奶", phonetic: "/mɪlk/" },
        { english: "water", chinese: "水", phonetic: "/ˈwɔːtər/" },
        { english: "rice", chinese: "米饭", phonetic: "/raɪs/" },
        { english: "egg", chinese: "鸡蛋", phonetic: "/eɡ/" },
        { english: "meat", chinese: "肉", phonetic: "/miːt/" },
        { english: "fish", chinese: "鱼", phonetic: "/fɪʃ/" },
        { english: "fruit", chinese: "水果", phonetic: "/fruːt/" }
    ],
    lesson10: [
        { english: "school", chinese: "学校", phonetic: "/skuːl/" },
        { english: "teacher", chinese: "老师", phonetic: "/ˈtiːtʃər/" },
        { english: "student", chinese: "学生", phonetic: "/ˈstuːdnt/" },
        { english: "classroom", chinese: "教室", phonetic: "/ˈklæsruːm/" },
        { english: "library", chinese: "图书馆", phonetic: "/ˈlaɪbreri/" },
        { english: "playground", chinese: "操场", phonetic: "/ˈpleɪɡraʊnd/" },
        { english: "friend", chinese: "朋友", phonetic: "/frend/" },
        { english: "class", chinese: "班级", phonetic: "/klæs/" }
    ]
};

// 导出数据
window.vocabularyData = vocabularyData; 