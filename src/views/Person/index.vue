<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {NAvatar, NButton, NDrawer, NDrawerContent, NTooltip, NModal, NText, NQrCode, useMessage} from "naive-ui";
import {useRoute, useRouter} from "vue-router";
import {getPersonByCode} from "@/api/person";
import {useI18n} from 'vue-i18n';
import {Person, Social} from "@/type/person";
import {useAppStore} from '@/store/app'
import {getCurrentUrl} from "@/utils/app";
import html2canvas from 'html2canvas'
import { gaodeAddressUrl,googleAddressUrl} from "@/views/Person/data";
import logo from '@/assets/img/logo.jpg'


const appStore = useAppStore();
const message = useMessage();
const {locale, t} = useI18n();
const isShowPhoneOption = ref(false)
const isShowShareDrawer = ref(false)
const isShowMapDrawer = ref(false)
const isShowQRCodeModel = ref(false)
const currentAddress = ref('')
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
  ThailandPlant: t('addPerson.address.ThailandPlant'),
  JapanOffice: t('addPerson.address.JapanOffice'),
  VietnamOffice: t('addPerson.address.VietnamOffice'),
});

const showOtherOptions = ref(false);


// 初始化 personData
const personData = ref<Person>({
  id: 0,
  header: "",
  address: "",
  b_address: '',
  code: "",
  company: "",
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
  website: ""
});

const companyMap = ref({
  huitong: t('addPerson.company.huitong'),
})

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
  appStore.setLanguage(lang)
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
    ThailandPlant: t('addPerson.address.ThailandPlant'),
    JapanOffice: t('addPerson.address.JapanOffice'),
    VietnamOffice: t('addPerson.address.VietnamOffice'),
  };
  companyMap.value = {
    huitong: t('addPerson.company.huitong'),
  }

}

function openWebsite() {
  window.open('https://' + personData.value.website, "_blank");
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
  if (personData.value.mobile.includes('+')) {
    const mobile = personData.value.mobile.split(" ")[1]
    console.log(mobile)
    window.location.href = `tel:${mobile}`
  }
  window.location.href = `tel:${personData.value.mobile}`
}

function email() {
  window.location.href = `mailto:${personData.value.email}`;
}

function directions(channel: string) {
  if (channel === 'baidu') {
    message.warning('暂未开放')
    return;
  }
  if (channel === 'gaode') {
    const url = gaodeAddressUrl[currentAddress.value]
    window.open(url, "_blank");
    return;
  }
  if (channel === 'google') {
    const url = googleAddressUrl[currentAddress.value]
    window.open(url, "_blank");
    return;
  }
}

const isZH = computed(() => {
  return appStore.getLanguage() === "zh";
})
const isEN = computed(() => {
  return appStore.getLanguage() === "en";
})
const isTH = computed(() => {
  return appStore.getLanguage() === "th";
})
const isJA = computed(() => {
  return appStore.getLanguage() === "ja";
})
const isVI = computed(() => {
  return appStore.getLanguage() === "vi";
})

// 跳转到社交媒体
async function toSocial(s: string) {
  if (s === 'weixin') {
    if (await navigator.clipboard) {
      await navigator.clipboard.writeText(social.value.weixin.value)
      message.success('链接已复制到剪切板!')
      // 可选：打开微信客户端（但无法直接跳转到搜索页面）
      window.location.href = 'weixin://';
    } else {
      message.error('复制失败，请手动复制')
    }
    return;
  }

  if (s === 'line') {
    window.open(`https://line.me/R/ti/p/~${social.value.line.value}`, "_blank");
    return;
  }
  if (s === 'whatsapp') {
    window.open(`https://wa.me/${social.value.whatsapp.value}`, "_blank");
  }
}

// 复制到剪切板
async function toClipboard() {
  // 获取当前页面的网址链接
  const url = window.location.href;

  await navigator.clipboard.writeText(url)
  message.success('链接已复制到剪切板!')
}

function openMapDrawer(address?: string) {
  isShowMapDrawer.value = true;
  if (address) currentAddress.value = address;
  else currentAddress.value = '';
}

// 生成QR码
function createQRCode() {
  console.log('createQRCode')
  isShowQRCodeModel.value = true;
  isShowShareDrawer.value = false;
}

//下载QR图
function downloadQRCode() {
  console.log('downloadQRCode')
  const qr = document.getElementById('qr')
  html2canvas(qr).then((canvas) => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL(); // 转换为图片URL
    link.download = 'popup-content.png'; // 设置下载文件名
    link.click(); // 触发下载
  });
}


onMounted(async () => {
  let code = route.params?.code
  try {
    const res = await getPersonByCode(code|| 'ilpvc')
    console.log(res)
    personData.value = {...res}
  }catch (err){
    console.log(err)
  }
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
        <p class="text-sm  mt-2">{{personData.employ_number }}</p>
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
        <div @click="openMapDrawer(personData.b_address || personData.address )"
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
          <div>{{ companyMap[personData.company] }}</div>
          <div class="text-sm text-gray-400">{{ personData.job }}</div>
        </div>
      </div>

      <!--   公司地址   -->
      <div v-if="personData.b_address" class="flex space-x-6 items-center pt-5">
        <div class="self-start">
          <img class="w-8 h-8" src="@/assets/company.svg" alt="email"/>
        </div>
        <div class="flex flex-col w-full border-b border-[#EDEDED] pb-5">
          <!--          <div>{{$t('addPerson.info.ha')+': '+addressMap[personData.address] }}</div>-->
          <div>{{ $t('addPerson.info.ba') + ': ' + addressMap[personData.b_address] }}</div>
          <div class="text-[#77B5F6] text-md h-12 flex items-center"
               @click="openMapDrawer(personData.b_address)">{{
              //directions(personData.b_address)
              $t('person.info.show')
            }}
          </div>
        </div>
      </div>

      <!--   地址   -->
      <div v-if="personData.address" class="flex space-x-6 items-center pt-5">
        <div class="self-start">
          <img class="w-8 h-8" src="@/assets/location-gray.svg" alt="email"/>
        </div>
        <div class="flex flex-col w-full border-b border-[#EDEDED] pb-5">
          <div>{{ $t('addPerson.info.ha') + ': ' + addressMap[personData.address] }}</div>
          <!--          <div v-if="personData.b_address">{{$t('addPerson.info.ha')+': '+addressMap[personData.b_address] }}</div>-->
          <div class="text-[#77B5F6] text-md h-12 flex items-center"
               @click="openMapDrawer(personData.address)">{{
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
          <div class="text-md mb-2">{{$t("person.social.title")}}</div>
          <div class="flex flex-wrap justify-start items-center">
            <NTooltip
                placement="right"
                trigger="hover"
                :show-arrow="false"
                v-if="social.weixin.status"
            >
              <template #trigger>
                <img class="w-8 h-8 m-2" src="@/assets/social-icon/weixin-green.svg"
                     alt="social" @click="toSocial('weixin')"/>
              </template>
              <span> {{ social.weixin.value }}</span>
            </NTooltip>

            <!--            <NInput type="text" class="flex-1 h-8" :default-value="social.weixin.value"/>-->
            <img v-if="social.line.status" class="w-8 h-8 m-2" src="@/assets/social-icon/line-green.svg" alt="social"
                 @click="toSocial('line')"/>
            <img v-if="social.whatsapp.status" class="w-8 h-8 m-2" src="@/assets/social-icon/whatsapp-green.svg"
                 alt="social" @click="toSocial('whatsapp')"/>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="fixed right-6 bottom-6 flex flex-col space-y-2">
    <transition name="fade">
      <div v-if="showOtherOptions" class="bg-[#0288D1] w-14 h-14 flex justify-center items-center rounded-full"
           @click="toAdd">
        <img class="w-8 h-8" src="@/assets/add-person.svg" alt="add"/>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="showOtherOptions" class="bg-[#0288D1] w-14 h-14 flex justify-center items-center rounded-full"
           @click="isShowShareDrawer=true">
        <img class="w-6 h-6" src="@/assets/share.svg" alt="add"/>
      </div>
    </transition>
    <div class="bg-[#0288D1] w-14 h-14 flex justify-center items-center rounded-full"
         @click="showOtherOptions =!showOtherOptions">
      <transition v-if="!showOtherOptions" name="rotate">
        <img :class="['w-8','h-8']" src="@/assets/add-white.svg" alt="add"/>
      </transition>
      <transition v-else name="rotate">
        <img :class="['w-7','h-7']" src="@/assets/close.svg" alt="close"/>
      </transition>
    </div>
  </div>
  <!--  <NFloatButton :right="20" :bottom="20" width="3.5rem" height="3.5rem" shape="circle" class="bg-[#0288D1]"-->
  <!--                @click="toAdd()">-->
  <!--    <img class="w-8 h-8" src="@/assets/add-white.svg" alt="add"/>-->
  <!--  </NFloatButton>-->

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
  <!-- 语言选择弹窗 -->
  <n-drawer :auto-focus="false" v-model:show="isShowLangOption" placement="bottom" :default-height="210">
    <n-drawer-content>
      <div class="flex flex-col w-full space-y-3">
        <n-button v-bind="{quaternary: !isEN}" class="w-full text-lg h-12 m-0" type="info"
                  @click="changeLanguage('en')">
          English
        </n-button>
        <n-button v-bind="{quaternary: !isZH}" class="w-full text-lg h-12 m-0" type="info"
                  @click="changeLanguage('zh')">
          简体中文
        </n-button>
        <n-button v-bind="{quaternary: !isTH}" class="w-full text-lg h-12 m-0" type="info"
                  @click="changeLanguage('th')">
          ภาษาอังกฤษ
        </n-button>
        <n-button v-bind="{quaternary: !isJA}" class="w-full text-lg h-12 m-0" type="info"
                  @click="changeLanguage('ja')">
          にほんご
        </n-button>
        <n-button v-bind="{quaternary: !isVI}" class="w-full text-lg h-12 m-0" type="info"
                  @click="changeLanguage('vi')">
          Việt Nam
        </n-button>

      </div>
    </n-drawer-content>
  </n-drawer>
  <!-- 分享弹窗 -->
  <n-drawer v-model:show="isShowShareDrawer" placement="bottom" :default-height="140">
    <n-drawer-content>
      <div class="flex w-full space-x-5 items-center h-full pt-2">
        <div class="h-full flex flex-col items-center" @click="toClipboard">
          <div class="w-12 h-12 bg-[#e1d384] flex items-center justify-center rounded-full mb-2">
            <img class="w-8 h-8" src="@/assets/share.svg" alt="add"/>
          </div>
          <NText>
            {{ $t('person.drawer.copy') }}
          </NText>
        </div>

        <div class="h-full flex flex-col items-center" @click="createQRCode()">
          <div class="w-12 h-12 bg-[#e1d384] flex items-center justify-center rounded-full mb-2">
            <img class="w-8 h-8" src="@/assets/qrcode.svg" alt="add"/>
          </div>
          <NText>
            {{ $t('person.drawer.qr') }}
          </NText>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
  <!-- 地图软件选择弹窗 -->
  <n-drawer v-model:show="isShowMapDrawer" placement="bottom" :default-height="140">
    <n-drawer-content>
      <div class="flex w-full space-x-10 items-center h-full pt-2">
        <div class="h-full flex flex-col items-center" @click="directions('google')">
          <div class="w-12 h-12 bg-[#e1d384] flex items-center justify-center rounded-full mb-2">
            <img class="w-12 h-12" src="@/assets/map/google-map.svg" alt="add"/>
          </div>
          <NText>
            {{ $t('person.map.google') }}
          </NText>
        </div>

        <div class="h-full flex flex-col items-center" @click="directions('gaode')">
          <div class="w-12 h-12 bg-[#e1d384] flex items-center justify-center rounded-full mb-2">
            <img class="w-12 h-12" src="@/assets/map/gaode-map.svg" alt="add"/>
          </div>
          <NText>
            {{ $t('person.map.gaode') }}
          </NText>
        </div>

        <div class="h-full flex flex-col items-center" @click="directions('baidu')">
          <div class="w-12 h-12 bg-[#e1d384] flex items-center justify-center rounded-full mb-2">
            <img class="w-12 h-12" src="@/assets/map/baidu-map.svg" alt="add"/>
          </div>
          <NText>
            {{ $t('person.map.baidu') }}
          </NText>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>

  <!--  QRCode模态框-->
  <NModal v-model:show="isShowQRCodeModel">
    <div class="flex flex-col space-y-4">
      <div id="qr" class="flex flex-col w-auto justify-center items-center bg-white space-y-2 p-4 border rounded-lg">
        <h2 class="text-2xl font-semibold mt-5">{{ personData.first_name + ' ' + personData.last_name }}</h2>
        <p class="text-sm mt-2">{{ companyMap.huitong }}</p>
        <p class="text-sm opacity-50 mt-2">{{ personData.job }}</p>

        <NQrCode class="box-content"
                 :value="getCurrentUrl()"
                 :size="240"
                 :icon-src="logo"
                 :icon-size="80"
                 :icon-border-radius="10"
                 error-correction-level="H"
                 color="#0288D1"/>
      </div>
      <div class="cursor-pointer items-center flex justify-center" @click="downloadQRCode()">
        <div class="bg-white border rounded-full w-12 h-12 flex justify-center items-center">
          <img class="h-8 w-8" src="@/assets/download.svg" alt="Phone"/>
        </div>
      </div>
    </div>
  </NModal>
</template>


<style scoped>
/* 这里不需要额外的CSS，因为已用Tailwind CSS完成 */
.rotate-enter-active,
.rotate-leave-active {
  transition: transform 0.3s ease;
}

.rotate-enter-from {
  transform: rotate(0deg);
}

.rotate-enter-to {
  transform: rotate(45deg);
}

.rotate-leave-from {
  transform: rotate(45deg);
}

.rotate-leave-to {
  transform: rotate(0deg);
}

.fade {
  transition: all 0.5s ease;
  opacity: 0;
  transform: translateY(20px); /* 初始向下位移 */
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px); /* 进入时的初始状态 */
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0); /* 进入后恢复到正常位置 */
}

.fade-leave-from {
  opacity: 1;
  transform: translateY(0); /* 离开时的初始状态 */
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(20px); /* 离开时向下位移 */
}

</style>
