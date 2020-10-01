<template>
  <div>
    <el-container>
      <el-header>物联网小车控制平台</el-header>
      <el-main>
        <el-row type="flex">
          <el-select v-model="encoded" placeholder="请选择编码格式">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
            </el-switch
          ></el-col>
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
              @touchstart.native="
                touch((row - 1) * 3 + (col - 1), btns.cmd, btns.interval)
              "
              @touchend.native="endSend"
              >按钮{{ (row - 1) * 3 + col }}</el-button
            ></el-col
          >
        </el-row>
        <el-dialog
          title="配置按钮发送内容"
          :visible.sync="centerDialogVisible"
          width="80%"
          center
        >
          <div class="dialog-title">发送内容({{encoded}})：</div>
          <el-input
            placeholder="请输入发送内容"
            v-model="inputValue1"
            clearable
          ></el-input>
          <div class="dialog-title">发送间隔(ms)：</div>
          <el-input
            placeholder="请输入发送间隔,默认长按不连续发送"
            v-model="inputValue2"
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
      options:[
        {
          label:'UTF-8',
          value:'UTF-8'
        },
        {
          label:'HEX',
          value:'HEX'
        }
      ],
      encoded:'UTF-8',
      btns: [],
      mode: 0,
      centerDialogVisible: false,
      inputValue1: '',
      inputValue2: '',
      curNum: 0,
      sendingTimer: 0,
    }
  },

  methods: {
    createBtn() {
      for (let i = 0; i < 6; i++) {
        this.btns.push({
          cmd: 'forward#',
          interval: 0,
        })
      }
    },
    addBtn() {
      this.btns.push({
        cmd: '',
        interval: 0,
      })
    },
    subBtn() {
      this.btns.pop()
    },
    touch(index, cmd, interval) {
      this.curNum = index
      if (this.mode) {
        //配置按钮
        this.centerDialogVisible = true
        this.inputValue1 = this.btns[index].cmd
        this.inputValue2 = this.btns[index].interval
      } else {
        this.sendData(cmd, interval)
      }
      //console.log(this.btns[index].cmd, this.btns[index].interval, this.mode)
    },
    sendData(cmd = '', interval = 0) {
      if (interval !== 0) {
        this.sendingTimer = setInterval(() => {
          console.log('发送：' + cmd, '间隔：' + interval)
          this.$http.post('sendCmd',{cmd,interval})
        }, interval)
      } else {
        console.log('发送：' + cmd)
      }
    },
    endSend() {
      clearInterval(this.sendingTimer)
    },
    closeDialog() {
      this.btns[this.curNum].cmd = this.inputValue1
      this.btns[this.curNum].interval = this.inputValue2
      this.centerDialogVisible = false
    },
  },
  mounted() {
    this.createBtn()
  },
}
</script>
<style scoped>
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
  height: 10vh;
  line-height: 10vh;
}
.dialog-title {
  margin: 2vh 0;
}
</style>
