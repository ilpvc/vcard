// src/i18n/index.ts
import { createI18n } from 'vue-i18n';
import zh from '@/i18n/langs/zh'
import en from '@/i18n/langs/en'
import th from '@/i18n/langs/th'
import ja from '@/i18n/langs/ja'
import vi from '@/i18n/langs/vi'

const messages = {
    en: en,
    zh: zh,
    th: th,
    ja: ja,
    vi: vi,
};

const i18n = createI18n({
    legacy: false, // 启用 Composition API 模式
    locale: 'en', // 默认语言
    messages,
});

export default i18n;
