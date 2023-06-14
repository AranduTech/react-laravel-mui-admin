/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import config from '../config';

const setupLang = () => {
    if (config('lang')) {
        i18n.use(LanguageDetector)
            .use(initReactI18next)
            .init({
                debug: true,
                fallbackLng: 'en',
                interpolation: { escapeValue: false },
                lng: document.documentElement.lang,
                resources: config('lang.resources'),
            });
    }

};

export default setupLang;

