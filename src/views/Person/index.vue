<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {NAvatar, NButton, NDrawer, NDrawerContent, NFloatButton} from "naive-ui";
import {useRoute, useRouter} from "vue-router";
import {getPersonByCode} from "@/api/person";
import {useI18n} from 'vue-i18n';
import {Person, Social} from "@/type/person";

const {locale,t} = useI18n();
const isShowPhoneOption = ref(false)
const router = useRouter()
const route = useRoute()
const addressMap = ref({
  changning: t('addPerson.address.changning'),
  luhua: t('addPerson.address.luhua'),
  longchuang: t('addPerson.address.longchuang'),
  chanye: t('addPerson.address.chanye'),
  longquan: t('addPerson.address.longquan'),
  yongjin: t('addPerson.address.yongjin'),
  jiaocha: t('addPerson.address.jiaocha'),
  xiajia: t('addPerson.address.xiajia'),
  beishong: t('addPerson.address.beishong'),
  chonburi: t('addPerson.address.chonburi'),
});



// 初始化 personData
const personData = ref<Person>({
  id: 0,
  header: "",
  address: "",
  code: "",
  company: "",
  created_at: "",
  email: "",
  first_name: "",
  last_name: "",
  job: "",
  mobile: "",
  social_media: "",
  summary: "",
  telephone: "",
  website: ""
});

const isShowLangOption = ref(false)
const social = ref<Social>({
  line: {name: "", status: false, value: ""},
  weixin: {name: "", status: false, value: ""},
  whatsapp: {name: "", status: false, value: ""}
})

// 跳转到新增页面
async function toAdd() {
  await router.push({path: "/add"})
}

function showPhoneOption() {
  isShowPhoneOption.value = true
}

// 切换语言
function changeLanguage(lang: string) {
  locale.value = lang
  isShowLangOption.value = false
  addressMap.value = {
    changning: t('addPerson.address.changning'),
    luhua: t('addPerson.address.luhua'),
    longchuang: t('addPerson.address.longchuang'),
    chanye: t('addPerson.address.chanye'),
    longquan: t('addPerson.address.longquan'),
    yongjin: t('addPerson.address.yongjin'),
    jiaocha: t('addPerson.address.jiaocha'),
    xiajia: t('addPerson.address.xiajia'),
    beishong: t('addPerson.address.beishong'),
    chonburi: t('addPerson.address.chonburi'),
  };
}

function openWebsite() {
  window.open('https://'+personData.value.website, "_blank");
}

const addToContacts = () => {
  const vcfData = `
BEGIN:VCARD
VERSION:3.0
FN:${personData.value.first_name + ' ' + personData.value.last_name}
TEL:${personData.value.mobile}
EMAIL:${personData.value.email}
ORG:${personData.value.company}
END:VCARD
  `.trim()

  const blob = new Blob([vcfData], {type: 'text/vcard'})
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'contact.vcf'
  link.click()
  URL.revokeObjectURL(url)
}

function callPhone() {
  window.location.href = `tel:${personData.value.mobile}`
}

function email() {
  window.location.href = `mailto:${personData.value.email}`;
}

function directions() {
  window.open(`https://www.google.com/maps?q=${addressMap.value[personData.value.address]}`, "_blank");
}
// 跳转到社交媒体
function toSocial(s:string){
  if(s==='weixin'){
    console.log('展示二维码');
    return
  }
  if(s==='line'){
    window.open(`https://line.me/R/ti/p/~${social.value.line.value}`, "_blank");
    return;
  }
  if(s==='whatsapp'){
    window.open(`https://wa.me/${social.value.whatsapp.value}`, "_blank");
  }
}

onMounted(async () => {
  const code = route.params?.code
  personData.value = await getPersonByCode(code || 'ilpvc')
  social.value = JSON.parse(personData.value.social_media)
  console.log(personData.value)
})
</script>

<template>
  <div class="flex flex-col w-full h-screen items-center bg-gray-100 ">
    <div class="flex flex-col w-full bg-[#0288D1]">
      <!-- 头像区域 -->
      <div class="flex flex-col items-center  text-white w-full pt-10 pb-6 border border-[#2297D7]">
        <NAvatar
            class="self-center"
            round
            object-fit="cover"
            :size="100"
            :src="personData.header"
        />
        <h2 class="text-2xl font-semibold mt-5">{{ personData.first_name + ' ' + personData.last_name }}</h2>
        <p class="text-sm opacity-50 mt-2">{{ personData.job }}</p>
      </div>

      <!-- 按钮区域 -->
      <div class="flex w-full items-center h-16 justify-center">
        <div @click="showPhoneOption"
             class="text-white py-2 px-4 w-[100px] transition-all flex flex-col items-center">
          <img class="h-8 w-8 text-white" src="@/assets/phone.svg" alt="Phone"/>
          <span class="text-[10px]">{{ $t('person.nav.call') }}</span>
        </div>
        <div @click="email"
             class="text-white py-2 px-4 w-[100px] transition-all flex flex-col items-center border-l border-r border-[#2297D7]">
          <img class="h-8 w-8 text-white" src="@/assets/send.svg" alt="send"/>
          <span class="text-[10px]">{{ $t('person.nav.email') }}</span>
        </div>
        <div @click="directions"
             class="text-white py-2 px-4 w-[100px] transition-all flex flex-col items-center border-r border-[#2297D7]">
          <img class="h-8 w-8 text-white" src="@/assets/localtion.svg" alt="localtion"/>
          <span class="text-[10px]">{{ $t('person.nav.directions') }}</span>
        </div>
        <div @click="isShowLangOption = true"
             class="text-white py-2 px-4 w-[100px] transition-all flex flex-col items-center">
          <img class="h-8 w-8 text-white" src="@/assets/language.svg" alt="localtion"/>
          <span class="text-[10px]">{{ $t('person.nav.language') }}</span>
        </div>
      </div>
    </div>

    <!-- 联系方式区域 -->
    <div v-if="personData.mobile" class=" bg-white w-full max-w-md pl-6 py-9">
      <div class="flex space-x-6 items-center py-4">
        <div>
          <img class="w-8 h-8" src="@/assets/phone-gray.svg" alt="phone"/>
        </div>
        <div class="flex flex-col w-full">
          <div>{{ personData.mobile }}</div>
          <div class="text-sm text-gray-400">{{ $t('person.info.mobile') }}</div>
        </div>
      </div>
      <div v-if="personData.telephone" class="flex space-x-6 items-center pt-5">
        <div>
          <img class="w-8 h-8 opacity-0" src="@/assets/phone-gray.svg" alt="phone"/>
        </div>
        <div class="flex flex-col w-full border-b border-[#EDEDED] pb-5">
          <div>{{ personData.telephone }}</div>
          <div class="text-sm text-gray-400">{{ $t('person.info.telephone') }}</div>
        </div>
      </div>
      <!--email-->
      <div v-if="personData.email" class="flex space-x-6 items-center pt-5">
        <div class="self-start">
          <img class="w-8 h-8" src="@/assets/email.svg" alt="email"/>
        </div>
        <div class="flex flex-col w-full border-b border-[#EDEDED] pb-5">
          <a href="mailto:610554710@qq.com">{{ personData.email }}</a>
          <div class="text-sm text-gray-400">{{ $t('person.info.email') }}</div>
        </div>
      </div>

      <!--   职位   -->
      <div v-if="personData.company || personData.job" class="flex space-x-6 items-center pt-5">
        <div class="self-start">
          <img class="w-8 h-8" src="@/assets/worker.svg" alt="email"/>
        </div>
        <div class="flex flex-col w-full border-b border-[#EDEDED] pb-5">
          <div>{{ personData.company }}</div>
          <div class="text-sm text-gray-400">{{ personData.job }}</div>
        </div>
      </div>


      <!--   地址   -->
      <div v-if="personData.address" class="flex space-x-6 items-center pt-5">
        <div class="self-start">
          <img class="w-8 h-8" src="@/assets/location-gray.svg" alt="email"/>
        </div>
        <div class="flex flex-col w-full border-b border-[#EDEDED] pb-5">
          <div>{{ addressMap[personData.address] }}</div>
          <div class="text-[#77B5F6] text-md h-12 flex items-center" @click="directions">{{
              $t('person.info.show')
            }}
          </div>
        </div>
      </div>


      <!--   网址   -->
      <div v-if="personData.website" class="flex space-x-6 items-center pt-5" @click="openWebsite">
        <div class="self-start">
          <img class="w-8 h-8" src="@/assets/website.svg" alt="website"/>
        </div>
        <div class="flex flex-col w-full border-b border-[#EDEDED] pb-5">
          <div>{{ personData.website }}</div>
          <div class="text-sm text-gray-400">{{ $t('person.info.website') }}</div>
        </div>
      </div>

      <!--   简介   -->
      <div v-if="personData.summary" class="flex space-x-6 items-center pt-5">
        <div class="self-start">
          <img class="w-8 h-8" src="@/assets/profile.svg" alt="website"/>
        </div>
        <div class="flex flex-col w-full border-b border-[#EDEDED] pb-5">
          <div>{{ personData.website }}</div>
          <div class="text-sm text-gray-400">{{ $t('person.info.summary') }}</div>
        </div>
      </div>
      <!--   社交媒体   -->
      <div class="flex space-x-6 items-center pt-5">
        <div class="self-start">
          <div class="w-8 h-8"/>
        </div>
        <div class="flex flex-col w-full">
          <div class="text-md mb-2">Social Media</div>
          <div class="flex flex-wrap justify-start items-center">
            <img v-if="social.weixin.status" class="w-8 h-8 m-2" src="@/assets/social-icon/weixin-green.svg"
                 alt="social" @click="toSocial('weixin')"/>
            <img v-if="social.line.status" class="w-8 h-8 m-2" src="@/assets/social-icon/line-green.svg" alt="social"
                 @click="toSocial('line')"/>
            <img v-if="social.whatsapp.status" class="w-8 h-8 m-2" src="@/assets/social-icon/whatsapp-green.svg"
                 alt="social" @click="toSocial('whatsapp')"/>
          </div>
        </div>
      </div>
    </div>
  </div>
  <NFloatButton :right="20" :bottom="20" width="3.5rem" height="3.5rem" shape="circle" class="bg-[#0288D1]"
                @click="toAdd()">
    <img class="w-8 h-8" src="@/assets/add-white.svg" alt="add"/>
  </NFloatButton>

  <n-drawer v-model:show="isShowPhoneOption" placement="bottom" :default-height="210">
    <n-drawer-content>
      <div class="flex flex-col w-full space-y-3">
        <n-button tertiary class="w-full text-lg h-12 m-0" @click="addToContacts()">
          {{ $t('person.info.save') }}
        </n-button>
        <n-button tertiary class="w-full text-lg h-12 m-0" @click="callPhone">
          {{ $t('person.info.call') }}
        </n-button>
        <n-button tertiary class="w-full text-lg h-12 m-0" type="error" @click="isShowPhoneOption = false">
          {{ $t('person.info.cancel') }}
        </n-button>

      </div>
    </n-drawer-content>
  </n-drawer>
  <n-drawer v-model:show="isShowLangOption" placement="bottom" :default-height="210">
    <n-drawer-content>
      <div class="flex flex-col w-full space-y-3">
        <n-button quaternary class="w-full text-lg h-12 m-0" type="info" @click="changeLanguage('en')">
          English
        </n-button>
        <n-button quaternary class="w-full text-lg h-12 m-0" type="info" @click="changeLanguage('zh')">
          简体中文
        </n-button>
        <n-button quaternary class="w-full text-lg h-12 m-0" type="info" @click="changeLanguage('th')">
          ภาษาอังกฤษ
        </n-button>

      </div>
    </n-drawer-content>
  </n-drawer>
</template>


<style scoped>
/* 这里不需要额外的CSS，因为已用Tailwind CSS完成 */
</style>
