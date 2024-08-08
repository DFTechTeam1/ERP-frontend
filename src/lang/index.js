import { createI18n } from "vue-i18n";
import enLang from '@/lang/en.json';
import idLang from '@/lang/id.json';

export const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: enLang,
        id: idLang,
    },
});