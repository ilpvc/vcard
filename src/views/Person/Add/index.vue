<script setup lang="ts">
import {
  NAvatar,
  NButton,
  NDivider,
  NForm,
  NFormItem,
  NInput,
  NGrid,
  NGridItem,
  NUpload,
  NSelect,
  NInputGroup,
  useMessage,
  UploadCustomRequestOptions, SelectOption, FormInst
} from "naive-ui"
import {useRouter} from "vue-router";
import {h, ref, unref} from "vue"
import {addPerson} from "@/api/person";
import {fileToBase64} from "@/utils/image";
import type {Person} from "@/type/person";
import {useI18n} from "vue-i18n";
import {addPersonRules} from './rules'

const router = useRouter();
const {t} = useI18n();
const message = useMessage();

const submitData = ref<Omit<Person, 'id'>>({
  header: "",
  address: "",
  code: "",
  company: 'huitong',
  created_at: "",
  email: "",
  employ_number: null,
  first_name: "",
  last_name: "",
  job: "",
  mobile: "",
  social_media: "",
  summary: "",
  telephone: "",
  website: "",
  b_address: ''
})

const social = ref({
  weixin: {
    name: 'weixin',
    status: false,
    value: ''
  },
  line: {
    name: 'line',
    status: false,
    value: '',
  },
  whatsapp: {
    name: 'whatsapp',
    status: false,
    value: ''
  },
});

const addressOptions = ref([
  {label: t('addPerson.address.changning'), value: 'changning'},
  {label: t('addPerson.address.luhua'), value: 'luhua'},
  {label: t('addPerson.address.longchuang'), value: 'longchuang'},
  {label: t('addPerson.address.chanye'), value: 'chanye'},
  {label: t('addPerson.address.longquan'), value: 'longquan'},
  {label: t('addPerson.address.yongjin'), value: 'yongjin'},
  {label: t('addPerson.address.jiaocha'), value: 'jiaocha'},
  {label: t('addPerson.address.xiajia'), value: 'xiajia'},
  {label: t('addPerson.address.beishong'), value: 'beishong'},
  {label: t('addPerson.address.chonburi'), value: 'chonburi'},
  {label: t('addPerson.address.ThailandPlant'), value: 'ThailandPlant'},
  {label: t('addPerson.address.JapanOffice'), value: 'JapanOffice'},
  {label: t('addPerson.address.VietnamOffice'), value: 'VietnamOffice'},
]);

const regionOptions = ref([
  {label: '+86', value: '+86'},
  {label: '+06', value: '+06'},
  {label: '+01', value: '+01'},
  {label: '+84', value: '+84'},
  {label: '+81', value: '+81'},
])

const regionSubmit = ref({
  mobile: '+86',
  telephone: '+86'
})

const companyOptions = ref([
  {label: t('addPerson.company.huitong'), value: 'huitong'},
])


async function uploadImage({
                             file
                           }: UploadCustomRequestOptions) {
  const f = file.file as File
  submitData.value.header = await fileToBase64(f)
}

function renderLabel(option: SelectOption) {
  const labelImgMap = new Map()
  labelImgMap.set('+86', new URL(`@/assets/flag/china.svg`, import.meta.url))
  labelImgMap.set('+06', new URL('@/assets/flag/Thailand.svg', import.meta.url))
  labelImgMap.set('+01', new URL('@/assets/flag/America.svg', import.meta.url))
  labelImgMap.set('+84', new URL('@/assets/flag/Vietnam.svg', import.meta.url))
  labelImgMap.set('+81', new URL('@/assets/flag/japan.svg', import.meta.url))
  const c = labelImgMap.get(option.label)
  return [
    h(
        "div",
        {
          style: {
            display: "flex",
          },
        },
        [
          h(
              "img",
              {
                style: {
                  width: "20px",
                  height: "20px",
                  marginRight: "8px"
                },
                src: c,
              },
              {}
          ),
          option.label as string
        ]
    ),

  ]
}

const formRef = ref<FormInst | null>(null)

async function submit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      submitData.value.social_media = JSON.stringify(social.value)
      if (submitData.value.mobile)
        submitData.value.mobile = regionSubmit.value.mobile + ' ' + submitData.value.mobile
      if (submitData.value.telephone)
        submitData.value.telephone = regionSubmit.value.telephone + ' ' + submitData.value.telephone
      const res = await addPerson(submitData.value)
      console.log(res)
      if (res.code === 406){
        message.error(res.message)
      }else{
        message.success('保存成功')
        await router.push({path: `/${res.code}`, replace: true})
      }

    } else {
      console.log(errors)
      message.error('请完善信息')
    }
  })
}

function openSocial(s) {
  if (unref(social)[s]) {
    unref(social)[s].status = !unref(social)[s].status
  }
}

function toHome() {
  router.back()
  // router.push({path: "/", replace: true})
}
</script>

<template>
  <div class="flex flex-col ">
    <div class="m-4 border border-gray-200 rounded-md shadow-sm">
      <div class="text-lg font-bold bg-[#F4F4F4] h-20 flex items-center w-full justify-center">
        {{ $t('addPerson.info.title') }}
      </div>
      <div class="flex flex-col p-4 space-y-4">
        <div class="text-sm text-gray-500">
          {{ $t('addPerson.info.des') }}
        </div>
        <div class="flex flex-col space-y-4 w-full pb-6">
          <div class="font-bold">
            {{ $t('addPerson.info.img') }}
          </div>

          <n-upload
              class="w-full flex justify-center"
              :custom-request="uploadImage"
              accept="image/*"
              :show-file-list="false">
            <n-avatar
                class="self-center"
                round
                :size="100"
                object-fit="cover"
                :src="submitData.header"
            />
            <!--            <n-button class="w-80" size="medium" type="info">-->
            <!--              {{ $t('addPerson.info.upload') }}-->
            <!--            </n-button>-->
          </n-upload>

        </div>
        <n-divider/>

        <!--    填写表单-->
        <n-form ref="formRef" :model="submitData" :rules="addPersonRules">
          <n-form-item label-placement="top" :label="$t('addPerson.info.name')" path="first_name">
            <n-input size="large" v-model:value="submitData.first_name" :placeholder="$t('addPerson.info.firstName')"/>
          </n-form-item>
          <n-form-item label-placement="left" path="last_name">
            <n-input size="large" v-model:value="submitData.last_name" :placeholder="$t('addPerson.info.lastName')"/>
          </n-form-item>
          <n-form-item label-placement="top" :label="$t('addPerson.info.employ_number')" path="employ_number">
            <n-input size="large" v-model:value="submitData.employ_number" :placeholder="$t('addPerson.info.employ_number_desc')"/>
          </n-form-item>
          <n-form-item label-placement="top" :label="$t('addPerson.info.number')" path="mobile">
            <NInputGroup class="flex w-full">
              <NSelect class="flex-[3]" size="large" :options="regionOptions" :render-label="renderLabel"
                       v-model:value="regionSubmit.mobile"
                       placeholder=""></NSelect>
              <n-input class="flex-[8]" size="large" v-model:value="submitData.mobile"
                       :placeholder="$t('addPerson.info.mobile')"/>
            </NInputGroup>
          </n-form-item>
          <n-form-item label-placement="left" path="telephone">
            <NInputGroup class="flex w-full">
              <NSelect class="flex-[3]" size="large" v-model:value="regionSubmit.telephone" :options="regionOptions"
                       :render-label="renderLabel"
                       placeholder=""></NSelect>
              <n-input class="flex-[8]" size="large" v-model:value="submitData.telephone"
                       :placeholder="$t('addPerson.info.telephone')"/>
            </NInputGroup>
          </n-form-item>
          <!--          <n-form-item label-placement="left">-->
          <!--            <n-input size="large" placeholder="Fax"/>-->
          <!--          </n-form-item>-->
          <n-form-item label-placement="top" :label="$t('addPerson.info.email')" path="email">
            <n-input size="large" v-model:value="submitData.email" placeholder="your@email.com"/>
          </n-form-item>
          <n-form-item label-placement="top" :label="$t('addPerson.info.company')" path="company">
            <NSelect size="large" :options="companyOptions" v-model:value="submitData.company"
                     :placeholder="$t('addPerson.info.company')"></NSelect>
            <!--            <n-input size="large" v-model:value="submitData.company" :placeholder="$t('addPerson.info.company')"/>-->
          </n-form-item>
          <n-form-item label-placement="left" path="job">
            <n-input size="large" v-model:value="submitData.job" :placeholder="$t('addPerson.info.job')"/>
          </n-form-item>
          <n-form-item label-placement="top" :label="$t('addPerson.info.ha')" path="address">
            <n-select size="large" :options="addressOptions" v-model:value="submitData.address"
                      :placeholder="$t('addPerson.info.addressDesc')"/>
            <!--            <n-input size="large" v-model:value="submitData.address" :placeholder="$t('addPerson.address.changning')"/>-->
          </n-form-item>
          <n-form-item label-placement="top" :label="$t('addPerson.info.ba')" path="b_address">
            <n-select size="large" :options="addressOptions" v-model:value="submitData.b_address"
                      :placeholder="$t('addPerson.info.addressDesc')"/>
            <!--            <n-input size="large" v-model:value="submitData.address" :placeholder="$t('addPerson.address.changning')"/>-->
          </n-form-item>
          <n-form-item label-placement="top" :label="$t('addPerson.info.website')" path="website">
            <n-input size="large" v-model:value="submitData.website" placeholder="www.your-website.com"/>
          </n-form-item>
          <n-form-item label-placement="top" :label="$t('addPerson.info.summary')" path="summary">
            <n-input type="textarea" v-model:value="submitData.summary" size="large"
                     :placeholder="$t('addPerson.info.input')"/>
          </n-form-item>

        </n-form>
      </div>
    </div>
    <div class="m-4 border border-gray-200 rounded-md shadow-sm">
      <div class="text-lg font-bold bg-[#F4F4F4] h-20 flex items-center w-full justify-center">
        {{ $t('addPerson.social.title') }}
      </div>
      <div class="flex flex-col p-4 space-y-4">
        <div class="text-sm text-gray-500">
          {{ $t('addPerson.social.des') }}
        </div>
        <div class="flex flex-col w-full pb-6">
          <div class="font-bold pb-4">
            {{ $t('addPerson.social.addMore') }}:
          </div>
          <div v-for="(item,index) in social">
            <n-form-item v-if="item.status" :label="item.name" label-placement="top" :key="index">
              <n-input v-model:value="item.value"/>
            </n-form-item>
          </div>

          <n-grid :x-gap="4" :y-gap="4" :cols="6">
            <n-grid-item>
              <img class="w-8 h-8" src="@/assets/social-icon/weixin.svg" alt="Weixin" @click="openSocial('weixin')"/>
            </n-grid-item>
            <n-grid-item>
              <img class="w-8 h-8" src="@/assets/social-icon/line.svg" alt="line" @click="openSocial('line')"/>
            </n-grid-item>
            <n-grid-item>
              <img class="w-8 h-8" src="@/assets/social-icon/whatsapp.svg" alt="whatsapp"
                   @click="openSocial('whatsapp')"/>
            </n-grid-item>
          </n-grid>
        </div>
        <n-divider/>
      </div>
    </div>

    <div class="h-20">
      <!--      占位-->
    </div>
    <div class="h-20 w-full fixed bottom-0 px-2 pb-4">
      <div class="bg-[#3C4245] flex w-full h-full rounded-md justify-between items-center px-4 space-x-4">
        <img class="w-8 h-8" src="@/assets/back.svg" alt="back" @click="toHome()">
        <NButton type="success" size="large" class="flex-1" @click="submit()">{{
            $t('addPerson.social.save')
          }}
        </NButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>