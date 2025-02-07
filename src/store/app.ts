import {defineStore} from "pinia";
import {ref} from "vue";

export const useAppStore = defineStore('app', () => {
    const language = ref('en')

    function getLanguage() {
        return language.value
    }

    function setLanguage(lang: string) {
        language.value = lang
    }

    return {getLanguage, setLanguage}
})