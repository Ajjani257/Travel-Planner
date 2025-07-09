// DOM Elements
const sourceLanguage = document.getElementById('source-language');
const targetLanguage = document.getElementById('target-language');
const sourceText = document.getElementById('source-text');
const targetText = document.getElementById('target-text');
const translateBtn = document.getElementById('translate-btn');
const clearBtn = document.getElementById('clear-btn');
const swapLanguagesBtn = document.getElementById('swap-languages');
const phraseButtons = document.querySelectorAll('.phrase-btn');

// Common phrases in different languages
const commonPhrases = {
    'Hello': {
        en: 'Hello',
        es: 'Hola',
        fr: 'Bonjour',
        de: 'Hallo',
        it: 'Ciao',
        pt: 'Olá',
        ru: 'Привет',
        zh: '你好',
        ja: 'こんにちは',
        ko: '안녕하세요'
    },
    'Thank you': {
        en: 'Thank you',
        es: 'Gracias',
        fr: 'Merci',
        de: 'Danke',
        it: 'Grazie',
        pt: 'Obrigado',
        ru: 'Спасибо',
        zh: '谢谢',
        ja: 'ありがとう',
        ko: '감사합니다'
    },
    'Goodbye': {
        en: 'Goodbye',
        es: 'Adiós',
        fr: 'Au revoir',
        de: 'Auf Wiedersehen',
        it: 'Arrivederci',
        pt: 'Adeus',
        ru: 'До свидания',
        zh: '再见',
        ja: 'さようなら',
        ko: '안녕히 가세요'
    },
    'Where is the bathroom?': {
        en: 'Where is the bathroom?',
        es: '¿Dónde está el baño?',
        fr: 'Où sont les toilettes ?',
        de: 'Wo ist die Toilette?',
        it: 'Dove è il bagno?',
        pt: 'Onde fica o banheiro?',
        ru: 'Где находится туалет?',
        zh: '洗手间在哪里？',
        ja: 'トイレはどこですか？',
        ko: '화장실이 어디에 있나요?'
    },
    'How much does this cost?': {
        en: 'How much does this cost?',
        es: '¿Cuánto cuesta esto?',
        fr: 'Combien ça coûte ?',
        de: 'Wie viel kostet das?',
        it: 'Quanto costa questo?',
        pt: 'Quanto custa isso?',
        ru: 'Сколько это стоит?',
        zh: '这个多少钱？',
        ja: 'これはいくらですか？',
        ko: '이것은 얼마인가요?'
    },
    'I need help': {
        en: 'I need help',
        es: 'Necesito ayuda',
        fr: 'J\'ai besoin d\'aide',
        de: 'Ich brauche Hilfe',
        it: 'Ho bisogno di aiuto',
        pt: 'Preciso de ajuda',
        ru: 'Мне нужна помощь',
        zh: '我需要帮助',
        ja: '助けが必要です',
        ko: '도움이 필요합니다'
    }
};

// API Key (Replace with your actual API key)
const TRANSLATE_API_KEY = 'YOUR_TRANSLATE_API_KEY';

// Translate text using API
async function translateText(text, sourceLang, targetLang) {
    try {
        const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${TRANSLATE_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: sourceLang,
                    target: targetLang,
                    format: 'text'
                })
            }
        );

        const data = await response.json();
        if (data.data && data.data.translations) {
            return data.data.translations[0].translatedText;
        }
        throw new Error('Translation failed');
    } catch (error) {
        console.error('Translation error:', error);
        return 'Translation failed. Please try again.';
    }
}

// Handle translation
async function handleTranslation() {
    const text = sourceText.value.trim();
    if (!text) {
        targetText.value = '';
        return;
    }

    const sourceLang = sourceLanguage.value;
    const targetLang = targetLanguage.value;

    // For common phrases, use predefined translations
    if (commonPhrases[text]) {
        targetText.value = commonPhrases[text][targetLang] || text;
        return;
    }

    // For custom text, use the translation API
    const translatedText = await translateText(text, sourceLang, targetLang);
    targetText.value = translatedText;
}

// Swap languages
function swapLanguages() {
    const tempLang = sourceLanguage.value;
    sourceLanguage.value = targetLanguage.value;
    targetLanguage.value = tempLang;

    const tempText = sourceText.value;
    sourceText.value = targetText.value;
    targetText.value = tempText;
}

// Clear text
function clearText() {
    sourceText.value = '';
    targetText.value = '';
}

// Handle common phrase button clicks
function handlePhraseClick(event) {
    const phrase = event.target.textContent;
    sourceText.value = phrase;
    handleTranslation();
}

// Event Listeners
if (translateBtn && sourceText && targetText && sourceLanguage && targetLanguage) {
    translateBtn.addEventListener('click', handleTranslation);
}

if (clearBtn && sourceText && targetText) {
    clearBtn.addEventListener('click', () => {
        sourceText.value = '';
        targetText.value = '';
    });
}

if (swapLanguagesBtn && sourceLanguage && targetLanguage) {
    swapLanguagesBtn.addEventListener('click', () => {
        const temp = sourceLanguage.value;
        sourceLanguage.value = targetLanguage.value;
        targetLanguage.value = temp;
        handleTranslation();
    });
}

if (phraseButtons && phraseButtons.length > 0 && sourceText) {
    phraseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sourceText.value = btn.textContent;
            handleTranslation();
        });
    });
}

// Add input event listener for real-time translation
let debounceTimer;
sourceText.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(handleTranslation, 500);
}); 