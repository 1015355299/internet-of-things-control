<template>
  <div>
    <el-container>
      <el-header>物联网小车控制平台</el-header>
      <el-main>
        <el-row type="flex">
          <el-col :span="24">
            <el-input
              placeholder="请输入设备编号"
              v-model="deviceNum"
              clearable
            ></el-input
          ></el-col>
        </el-row>
        <el-row :gutter="1" type="flex">
          <el-col :span="8">
            <el-select v-model="encoded" placeholder="请选择编码格式">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option> </el-select></el-col
          ><el-col :span="5">
            <el-button size="mini" type="info" @click="check">
              {{ isConnected ? '断开' : '检测' }}
            </el-button> </el-col
          ><el-col :span="6">
            <el-button size="mini" :type="isConnected ? 'primary' : 'info'">
              {{ isConnected ? '已连接' : '未连接' }}
            </el-button> </el-col
          ><el-col :span="5">
            <el-button size="small" type="success" @click="saveConfig" round>保存</el-button>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12"
            ><el-switch
              class="mode"
              v-model="mode"
              active-text="配置"
              inactive-text="启用"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-col>
          <el-col :span="12"
            ><el-button
              class="addBtn"
              @click="addBtn"
              icon="el-icon-plus"
              circle
            ></el-button>
            <el-button
              class="subBtn"
              @click="subBtn"
              icon="el-icon-minus"
              circle
            ></el-button
          ></el-col>
        </el-row>

        <el-row
          type="flex"
          v-for="row in Math.ceil(btns.length / 3)"
          :key="row"
        >
          <el-col
            :span="8"
            v-for="col in btns.length - row * 3 < 0 ? btns.length % 3 : 3"
            :key="col"
            ><el-button
              type="primary"
              round
              @mousedown="touch($event, row, col)"
              @mouseup="endSend"
              @touchstart.native="touch($event, row, col)"
              @touchend.native="endSend"
              >{{ btns[(row - 1) * 3 + (col - 1)].content }}</el-button
            ></el-col
          >
        </el-row>
        <el-dialog
          title="配置按钮发送内容"
          :visible.sync="centerDialogVisible"
          width="80%"
          center
        >
          <div class="dialog-title">按钮名：</div>
          <el-input
            placeholder="请输入按钮名"
            v-model="inputContent"
            clearable
          ></el-input>
          <div class="dialog-title">发送内容({{ encoded }})：</div>
          <el-input
            placeholder="请输入发送内容"
            v-model="inputCmd"
            clearable
          ></el-input>
          <div class="dialog-title">发送间隔(ms)：</div>
          <el-input
            placeholder="请输入发送间隔,默认长按不连续发送"
            v-model="inputInterval"
            clearable
          >
          </el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog()">取 消</el-button>
            <el-button type="primary" @click="closeDialog">确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      options: [
        { label: 'UTF-8', value: 'utf8' },
        { label: 'HEX', value: 'hex' },
      ],
      encoded: 'utf8',
      btns: [
        { content: '变速', cmd: 'change#', interval: 0 },
        { content: '前进', cmd: 'forward#', interval: 0 },
        { content: '刹车', cmd: 'brake#', interval: 0 },
        { content: '左转', cmd: 'left1#', interval: 0 },
        { content: '后退', cmd: 'back#', interval: 0 },
        { content: '右转', cmd: 'right1#', interval: 0 },
        { content: '自由', cmd: 'free#', interval: 0 },
        { content: '循迹', cmd: 'xunji#', interval: 0 },
        { content: '避障', cmd: 'bizhang#', interval: 0 },
        { content: '左小转', cmd: 'left0#', interval: 0 },
        { content: '左大转', cmd: 'left2#', interval: 0 },
        { content: '左转90', cmd: 'left3#', interval: 0 },
        { content: '左转180', cmd: 'left4#', interval: 0 },
        { content: '右小转', cmd: 'right0#', interval: 0 },
        { content: '右大转', cmd: 'right2#', interval: 0 },
        { content: '右转90', cmd: 'right3#', interval: 0 },
        { content: '右转180', cmd: 'right4#', interval: 0 },
        { content: '切换控制', cmd: 'control#', interval: 0 },
      ],
      mode: 0, // 按钮模式
      centerDialogVisible: false, // 弹出框
      inputContent: '按钮',
      inputCmd: '',
      inputInterval: '',
      curIndex: 0,
      sendingTimers: [],
      isConnected: false,
      pollTimer: 0,
      deviceNum: null,
    }
  },

  methods: {
    // 添加按钮
    addBtn() {
      this.btns.push({
        content: '按钮',
        cmd: '',
        interval: 0,
      })
    },
    // 删除按钮
    subBtn() {
      this.btns.pop()
    },
    // 点击按钮
    touch(e, row = 1, col = 3) {
      console.dir(e.target)
      const index = (row - 1) * 3 + (col - 1)
      const content = this.btns[index].content
      const cmd = this.btns[index].cmd
      const interval = this.btns[index].interval

      this.curIndex = index
      if (this.mode) {
        //配置按钮
        this.inputContent = content
        this.inputCmd = cmd
        this.inputInterval = interval
        this.centerDialogVisible = true
      } else {
        // 触发按钮，发送数据
        this.sendData(e, cmd, interval)
      }
      //console.log(this.btns[index].cmd, this.btns[index].interval, this.mode)
    },
    sendData(e, cmd = '', interval = 0, encoded = this.encoded) {
      if (interval !== 0) {
        //连续发送
        const id = setInterval(() => {
          //console.log('发送：' + cmd, '间隔：' + interval)
          this.$http.post('sendCmd', { cmd, interval, encoded })
        }, interval)
        this.sendingTimers.push({ name: e.target.innerText, id })
      } else {
        // 单个发送
        //console.log('发送：' + cmd)
        //console.log(encoded)
        this.$http.post('sendCmd', { cmd, interval, encoded })
      }
    },
    endSend(e) {
      for (let i = 0; i < this.sendingTimers.length; i++) {
        if (this.sendingTimers[i].name == e.target.innerText) {
          clearInterval(this.sendingTimers[i].id)
          this.sendingTimers.splice(i, 1)
          break
        }
      }
    },
    closeDialog() {
      this.btns[this.curIndex].content = this.inputContent
      this.btns[this.curIndex].cmd = this.inputCmd
      this.btns[this.curIndex].interval = this.inputInterval
      this.centerDialogVisible = false
    },
    saveConfig() {
      localStorage.setItem('btn_config', JSON.stringify(this.btns))
      this.$message.success(`保存配置成功！`)
    },
    getConfig() {
      this.btns = JSON.parse(localStorage.getItem('btn_config'))
    },
    check() {
      if (this.isConnected) {
        //断开
        this.$http.get('closeSocket').then((res) => {
          if (res.data.connected) {
            clearInterval(this.pollTimer)
            if (this.isConnected) {
              this.$message.warning(`连接断开失败，请手动断开设备！`)
            }
            this.isConnected = false
          } else {
            clearInterval(this.pollTimer)
            if (this.isConnected) {
              this.$message.success(`连接断开成功！`)
            }
            this.isConnected = false
          }
        })
      } else {
        if (this.deviceNum == null || isNaN(this.deviceNum)){
          return this.$message.warning(`请输入正确的设备编号！`)
        }
        this.$message.warning(`检测设备中！`)
        this.$http.get(`getStatus/${this.deviceNum}`).then(({ data }) => {
          if (data.msg == 'device is not find!') {
            return this.$message.warning(`设备未找到！`)
          } else {
            this.pollTimer = setInterval(async () => {
              const res = await this.$http.get(`getStatus/${this.deviceNum}`)
              if (res.data.connected) {
                if (!this.isConnected) this.$message.success(`连接成功！`)
              } else {
                if (this.isConnected) this.$message.warning(`连接断开！`)
              }
              this.isConnected = res.data.connected
            }, 3000)
          }
        })
      }
    },
  },
  mounted() {
    if (localStorage.getItem('btn_config')) {
      this.getConfig()
    }
  },
}
</script>
<style scoped>
* {
  -moz-user-select: none; /* Firefox私有属性 */
  -webkit-user-select: none; /* WebKit内核私有属性 */
  -ms-user-select: none; /* IE私有属性(IE10及以后) */
  -khtml-user-select: none; /* KHTML内核私有属性 */
  -o-user-select: none; /* Opera私有属性 */
  user-select: none; /* CSS3属性 */
}
.el-header {
  text-align: center;
}
.el-main {
  text-align: center;
}
.el-row {
  text-align: center;
}
.el-col {
  height: 9vh;
  line-height: 9vh;
}
.dialog-title {
  margin: 2vh 0;
}
</style>
