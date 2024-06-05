<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import bottomImg from '@/assets/fixed-bottom.jpg'
import a from '@/assets/a.gif'
import b from '@/assets/b.gif'
import { onMounted } from 'vue'

defineProps<{ msg: string }>()


onMounted(() => {
  columns.value = lineArray.map((item) => {
    return {
      text: item.line,
      value: item.line,
      children: item.site.map(min => {
        return {
          text: min,
          value: min,
        }
      })
    }
  })

  //计算失效时间
  confirmToast()
})

//失效时间
const time = ref(10 * 60 * 1000);
const countDown = ref()

let loading = ref(false)
//下拉刷新
const onRefresh = () => {
  setTimeout(() => {
    loading.value = false;
    countDown.value.reset();
  }, 500);
};

//选择时间
let show = ref(false)
const columnsTime = [
  { text: '17:30~17:40', value: '17:30~17:40' },
  { text: '17:40~17:50', value: '17:40~17:50' },
  { text: '17:50~18:00', value: '17:50~18:00' },
  { text: '18:00~18:10', value: '18:00~18:10' },
  { text: '18:10~18:20', value: '18:10~18:20' },
  { text: '18:20~18:30', value: '18:20~18:30' },
]
const selectedValues = ref(['18:00~18:10']);

const showTimePicker = () => {
  show.value = true
}
const closeToast = () => {
  show.value = false
}

const timeShow = ref('18:00~18:10');
const confirmToast = (callback?: any) => {
  if (callback) {
    timeShow.value = callback.selectedValues[0]
  }

  //选择的时间点
  let lastTime = dayjs().format('YYYY-MM-DD ') + timeShow.value.split('~')[1]

  //失效时间=结束时间 + 10分钟
  const durationInMinutes = dayjs(lastTime).diff(dayjs(), 'minute') + 10;
  const durationInSecond = dayjs(lastTime).diff(dayjs(), 'second') % 60;
  time.value = durationInMinutes * 60 * 1000 + durationInSecond * 1000

  closeToast()
}

const onFinish = () => {

}

// 地铁线
const lineArray = [{
  line: '1号线',
  site: ['石桥铺站']
}, {
  line: '2号线',
  site: ['杨家坪站', '临江门站']
}, {
  line: '3号线',
  site: ['金童路站', '金渝站']
}, {
  line: '5号线',
  site: ['幸福广场站']
}, {
  line: '6号线',
  site: ['江北城站', '光电园站']
}, {
  line: '环线',
  site: ['沙坪坝站']
}]
let lineText = ref(lineArray[4].line)
let siteText = ref(lineArray[4].site[0])
let showLine = ref(false)
let columns: any = ref([])


const lineChange = () => {
  showLine.value = true
}

const onCancel = () => {
  showLine.value = false
}

const onConfirm = (callback: any) => {
  let row = callback.selectedValues;
  lineText.value = row[0]
  siteText.value = row[1]
  onCancel()
}

let showDialogTips = ref(false)
let showDialogTipsA = ref(false)

const onClickLeft = () => {
  showDialogTipsA.value = true
}
</script>

<template>
  <div class="body-wrapper">
    <div class="top-bar">
      <van-nav-bar title="预约结果" safe-area-inset-top left-arrow @click-left="onClickLeft">
        <template #left>
          <van-space :size="20">
            <van-icon name="arrow-left" color="#333" size="22" />
            <van-icon name="cross" color="#333" size="22" />
          </van-space>
        </template>
      </van-nav-bar>
    </div>
    <van-notice-bar :scrollable="false" color="#c38938" left-icon="volume-o" background="#feedc3">
      <p class="notice">请务必在预约时间段<span class="time-class">前5分钟</span>内进站</p>
    </van-notice-bar>
    <van-pull-refresh v-model="loading" @refresh="onRefresh" style="height: calc(100% - 150px);">
      <div class="content-box">
        <div class="qr-code-box">
          <div class="lose-time">
            <van-count-down ref="countDown" :time="time" @finish="onFinish">
              <template #default="timeData">
                <span class="colon">失效时间：</span>
                <span class="block" v-if="timeData.hours > 0">{{ timeData.hours }}</span>
                <span class="colon" v-if="timeData.hours > 0">小时</span>
                <span class="block">{{ timeData.minutes }}</span>
                <span class="colon">分</span>
                <span class="block">{{ timeData.seconds }}</span>
                <span class="colon">秒</span>
              </template>
            </van-count-down>
          </div>
          <div class="code">
            <vue-qrcode :value="'www.baidu.com'" :width="200" :margin="0"
              :errorCorrectionLevel="'quartile'"></vue-qrcode>
          </div>
        </div>
        <p class="tips">请凭此二维码，前往地铁站指定预约通道扫码进站</p>

        <div class="text-center" @click="lineChange">
          <span class="line">{{ lineText }}</span>
          <span class="line-name">{{ siteText }}</span>
        </div>
        <div class="text-center">
          <span class="line">{{ dayjs().format('YYYY-MM-DD') }}</span>
          <span class="line-name" @click="showTimePicker">{{ timeShow }}</span>
        </div>
      </div>

    </van-pull-refresh>

    <!--时间选择-->
    <van-popup v-model:show="show" round position="bottom" :style="{ height: '30%' }">
      <van-picker v-model="selectedValues" title="选择时间段" :columns="columnsTime" @confirm="confirmToast"
        @cancel="closeToast" />
    </van-popup>

    <!-- 线路选择 -->
    <van-popup v-model:show="showLine" round position="bottom" :style="{ height: '30%' }">
      <van-picker title="选择线路" :columns="columns" @confirm="onConfirm" @cancel="onCancel" />
    </van-popup>
  </div>
  <div class="fixed-qr-code" @click="() => { showDialogTips = true }">
    <van-icon class="code-icon" name="qr" :size="24" color="#508fff" />
    <div class="go-bus">去乘车</div>
  </div>

  <div class="fixed-bottom">
    <img :src="bottomImg" alt="">
  </div>

  <van-dialog class="dialog-box" v-model:show="showDialogTips" title="">
    <img :src="a" />
  </van-dialog>

  <van-dialog class="dialog-box" v-model:show="showDialogTipsA" title="">
    <img :src="b" />
  </van-dialog>

</template>

<style lang="less" scoped>
.body-wrapper {
  height: 100vh;
}

.top-bar {
  width: 100%;
  font-family: '幼圆,黑体';

  :deep(.van-nav-bar__title) {
    font-weight: 800;
  }
}


.notice {
  font-size: 12px;
  color: #b57a31;

  .time-class {
    font-size: 16px;
    color: #ff8221;
  }
}

.content-box {
  box-shadow: 0px 0px 6px #ddd;
  width: 90%;
  margin: 10px auto 0 auto;
  padding-bottom: 20px;
  border-radius: 8px;
}

.qr-code-box {
  padding-top: 50px;

  .lose-time {
    background: #ecf1fd;
    border: 1px solid #ecf1fd;
    line-height: 24px;
    border-radius: 2px;
    font-weight: 600;
    width: 46%;
    margin: 0 auto;
    font-size: 14px;
    color: #333;
  }

  .code {
    width: 210px;
    margin: 10px auto;
    height: 210px;
  }
}

.tips {
  width: 80%;
  padding: 4px;
  border-radius: 2px;
  background-color: #f6f6f6;
  color: #999;
  text-align: cetner;
  margin: 0 auto;
  font-size: 12px;
  margin-bottom: 10px;
}

.text-center {
  text-align: center;
}

.line {
  font-size: 15px;
  color: #333;
  margin-right: 8px;
}

.line-name {
  color: #13b675;
  font-size: 24px;
}

.fixed-qr-code {
  position: fixed;
  right: 0;
  top: 35%;
  width: 60px;
  height: 52px;
  background-color: #d4e3ff;
  border-top-left-radius: 60%;
  border-bottom-left-radius: 60%;
  padding-left: 8px;
  box-sizing: border-box;
  color: #508fff;

  .code-icon {
    font-weight: bold;
    margin-top: 8px;
  }

  .go-bus {
    font-size: 9px;
    text-align: center;
    margin-top: -4px;
  }
}

.fixed-bottom {
  width: 100vw;
  height: auto;
  position: fixed;
  bottom: -8px;
  left: 0px;
  right: 0px;

  img {
    width: 100%;
  }
}

.dialog-box {
  img {
    width: 100%
  }
}
</style>
