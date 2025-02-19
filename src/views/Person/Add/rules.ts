import { FormRules,FormItemRule } from "naive-ui";
import i18n from "@/i18n/index";

const {t} = i18n.global;

export const addPersonRules: FormRules  = {
    first_name: {
        required: true,
        message: t('addPerson.rules.first_name'),
        trigger: 'blur'
    },
    last_name: {
        required: true,
        message: t('addPerson.rules.last_name'),
        trigger: 'blur'
    },
    email: {
        required: true,
        validator(rule: FormItemRule, value: string) {
            const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,63}@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/;
            if (!value) {
                return new Error('require email')
            }else if (!emailRegex.test(value)) {
                return new Error('error email');
            }
        },
        trigger: 'blur'
    },
    mobile: {
        required: true,
        validator(rule: FormItemRule, value: string) {
            const reg = /^[0-9\-]+$/;
            if (!value) {
                return new Error('mobile is required')
            }else if (!reg.test(value)) {
                return new Error('error mobile');
            }
        },
        trigger: "blur"
    },
    telephone: {
        required: true,
        validator(rule: FormItemRule, value: string) {
            const reg = /^[0-9\-]+$/;
            if (!value) {
                return new Error('telephone is required')
            }else if (!reg.test(value)) {
                return new Error('error telephone');
            }
        },
        trigger: "blur"
    },
    employ_number:{
        required: true,
        validator(rule: FormItemRule, value: string) {
            console.log(value)
            const reg = /^\d{6,10}$/
            if (!reg.test(value)) {
                return new Error('employ_number is incorrect!')
            }
        },
        trigger: "blur"
    }

}