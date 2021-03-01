<template>
  <div class="config-main">
    <div class="main-top">
      <el-card class="box-card" :body-style="{ color: '#eee' }">
        <div slot="header" class="card-header">
          <span>MQTT服务器</span>
          <el-button style="float: right; padding: 3px 0" type="text">{{
            mqttIsConnected ? '断开连接' : '开始连接'
          }}</el-button>
        </div>
        <div class="card-item">
          <div class="card-item-left">
            <ul>
              <li>
                复位云控制连接：<el-button
                  type="primary"
                  size="mini"
                  :loading="true"
                  @click="handleResetCloudControl"
                  ><i class="iconfont icon-fuwei1"></i
                ></el-button>
              </li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div class="card-item-right"></div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>云控制服务器</span>
          <el-button style="float: right; padding: 3px 0" type="text">{{
            controlIsConnected ? '断开连接' : '开始连接'
          }}</el-button>
        </div>
        <div class="card-item">
          <div class="card-item-left">
            <ul>
              <li>
                复位MQTT连接：<el-button
                  type="primary"
                  size="mini"
                  :loading="true"
                  @click="handleResetMqtt"
                  ><i class="iconfont icon-fuwei1"></i
                ></el-button>
              </li>
              <li>
                无线波特率：<el-input
                  class="baud-rate"
                  size="mini"
                  placeholder="请输入波特率,默认691200,最高691200"
                  v-model="carState.baudRate"
                  type="number"
                  clearable
                >
                </el-input>
              </li>
              <li>
                在线固件升级：<el-upload
                  class="upload"
                  ref="upload"
                  action="http://127.0.0.1:4444/updatefirmware/"
                  :auto-upload="false"
                  :multiple="false"
                  :show-file-list="false"
                >
                  <el-button slot="trigger" size="small" type="primary"
                    >选取固件</el-button
                  >
                  <el-button
                    style="margin-left: 10px;"
                    size="small"
                    type="success"
                    @click="submitUpload"
                    >更新到设备</el-button
                  >
                </el-upload>
              </li>
            </ul>
          </div>
          <div class="card-item-right"></div>
        </div>
      </el-card>
    </div>
    <div class="main-bottom">
      <el-card class="box-card" :body-style="{ color: '#eee' }">
        <div slot="header" class="card-header">
          <span>默认配置</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            >应用</el-button
          >
        </div>
        <div class="config-body">
          <div class="camera-left">
            <ul>
              <li>
                <i class="iconfont icon-14"></i>对比度：<el-select
                  :class="'select-item '"
                  v-model="carState.camera_contrast"
                  placeholder="请选择"
                  popper-class="option-list"
                >
                  <el-option
                    v-for="item in selectList"
                    :key="item"
                    :label="item + '级'"
                    :value="item"
                    >{{ item }} 级
                  </el-option>
                </el-select>
              </li>
              <li>
                <i class="iconfont icon-saturation"></i>饱和度：<el-select
                  :class="'select-item '"
                  v-model="carState.camera_saturation"
                  placeholder="请选择"
                  popper-class="option-list"
                >
                  <el-option
                    v-for="item in selectList"
                    :key="item"
                    :label="item + '级'"
                    :value="item"
                    >{{ item }} 级
                  </el-option>
                </el-select>
              </li>
              <li>
                <i class="iconfont icon-heibaipingheng"></i>白平衡：<el-select
                  :class="'select-item '"
                  v-model="carState.camera_light_mode"
                  placeholder="请选择"
                  popper-class="option-list"
                >
                  <el-option
                    v-for="item in selectList"
                    :key="item"
                    :label="item + '级'"
                    :value="item"
                    >{{ item }} 级
                  </el-option>
                </el-select>
              </li>
              <li>
                <i class="iconfont icon-football_name"></i>模式：<el-select
                  :class="'select-item '"
                  v-model="carState.camera_mode"
                  placeholder="请选择"
                  popper-class="option-list"
                >
                  <el-option label="连续" :value="0"> </el-option>
                </el-select>
              </li>
              <li>
                <i class="iconfont icon-geshi_tupianjpg"></i>格式：<el-select
                  :class="'select-item '"
                  v-model="carState.camera_workmode"
                  placeholder="请选择"
                  popper-class="option-list"
                >
                  <el-option label="JPG" :value="1"> </el-option>
                </el-select>
              </li>
            </ul>
          </div>
          <div class="camera-right">
            <ul>
              <li>
                <i class="iconfont icon-brightj2"></i>亮度：<el-select
                  :class="'select-item '"
                  v-model="carState.camera_brightness"
                  placeholder="请选择"
                  popper-class="option-list"
                >
                  <el-option
                    v-for="item in selectList"
                    :key="item"
                    :label="item + '级'"
                    :value="item"
                    >{{ item }} 级
                  </el-option>
                </el-select>
              </li>
              <li>
                <i class="iconfont icon-texiao"></i>特效：<el-select
                  :class="'select-item '"
                  v-model="carState.camera_effect"
                  placeholder="请选择"
                  popper-class="option-list"
                >
                  <el-option
                    v-for="(item, index) in camera_effectList"
                    :key="index"
                    :label="item"
                    :value="index"
                  >
                  </el-option>
                </el-select>
              </li>
              <li>
                <i class="iconfont icon-puguang"></i>曝光：<el-select
                  :class="'select-item '"
                  v-model="carState.camera_autoexposure_level"
                  placeholder="请选择"
                  popper-class="option-list"
                >
                  <el-option
                    v-for="item in selectList"
                    :key="item"
                    :label="item + '级'"
                    :value="item"
                    >{{ item }} 级
                  </el-option>
                </el-select>
              </li>
              <li>
                <i class="iconfont icon-tiaoxingma"></i>彩条：<el-select
                  :class="'select-item '"
                  v-model="carState.camera_color_bar"
                  placeholder="请选择"
                  popper-class="option-list"
                >
                  <el-option label="关闭" :value="0"> </el-option>
                  <el-option label="开启" :value="1"> </el-option>
                </el-select>
              </li>
              <li>
                <i class="iconfont icon-quanping_huaban1"></i>尺寸：<el-select
                  :class="'select-item '"
                  v-model="carState.camera_size"
                  placeholder="请选择"
                  popper-class="option-list"
                >
                  <el-option
                    v-for="(item, index) in camera_size"
                    :key="index"
                    :label="item"
                    :value="index"
                  >
                  </el-option>
                </el-select>
              </li>
            </ul>
          </div>
          <div class="duoji-setting">
            <ul>
              <li>
                <i class="iconfont icon-duoji1"></i>一维舵机角度：
                <el-slider
                  class="duoji"
                  v-model="carState.cur_duoji_1_angle"
                  :min="-135"
                  :max="135"
                  :step="1"
                  show-tooltip
                >
                </el-slider>
              </li>
              <li>
                <i class="iconfont icon-chuangyipingtai_duoji"></i
                >二维舵机角度：
                <el-slider
                  class="duoji"
                  v-model="carState.cur_duoji_2_angle"
                  :min="-45"
                  :max="135"
                  :step="1"
                  show-tooltip
                >
                </el-slider>
              </li>
              <li>
                <i class="iconfont icon-xuanzhuan"></i>设置旋转速度：
                <el-slider
                  class="duoji"
                  v-model="carState.set_dir_speed_whole"
                  :min="0"
                  :max="200"
                  :step="1"
                  show-tooltip
                >
                </el-slider>
              </li>
              <li>
                <i class="iconfont icon-shipin2"></i>默认开启视频：
                <el-switch class="img-open" v-model="carState.camera_is_abort">
                </el-switch>
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      camera_effectList: [
        '正常',
        '负片',
        '黑白',
        '偏红色',
        '偏绿色',
        '偏蓝色',
        '复古',
      ],
      camera_size: [
        '160*120', //QQVGA
        '176*144', //QCIF
        '320*240', //QVGA
        '400*240', //WQVGA 3
        '352*288', //CIF
        '640*480', //VGA 5
        '800*600', //SVGA 6
        '1024*768', //XGA
        '1280*800', //WXGA
        '1280*960', //XVGA  9
        '1440*900', //WXGA+
        '1280*1024', //SXGA
        '1600*1200', //UXGA	12
      ],
      selectList: [0, 1, 2, 3, 4],
      carState: {
        camera_is_abort: 0,
        mqttIsConnected: false,
        controlIsConnected: false,
        baudRate: 115200, // 波特率
        // 舵机
        cur_duoji_1_angle: 0,
        cur_duoji_2_angle: 0,
        set_dir_speed_whole: 20,
        // 相机设置
        camera_mode: 0, // 模式
        camera_workmode: 1, // 格式
        camera_contrast: 2, // 对比度
        camera_saturation: 4, // 饱和度
        camera_effect: 0, // 特效
        camera_autoexposure_level: 0, // 曝光
        camera_light_mode: 4, // 白平衡
        camera_brightness: 3, // 亮度
        camera_color_bar: 0, // 彩条
        camera_size: 5, // 尺寸
        camera_is_abort: 1, // 是否中断标志位
      },
    }
  },
  methods: {
    /* 事件 */
    // 上传固件更新小车
    submitUpload() {
      this.$refs.upload.submit();
    },
    uploadFile(...res){
      console.log(...res);
    },
  },
}
</script>

<style scoped>
.config-main {
  height: 100vh;
  min-width: 568px !important;
}
.main-top {
  height: 50vh;
  min-width: 568px !important;
  padding: 10px;
  display: flex;
}
.main-bottom {
  position: relative;
  height: 35vh;
  min-width: 568px !important;
  padding: 10px;
  display: flex;
}
.box-card {
  flex: 1;
  background-color: #3388ee33;
  margin: 0 10px;
  color: #eee;
}
.camera-left,
.camera-right {
  width: 30%;
  float: left;
}
.duoji-setting {
  width: 40%;
  float: left;
  height: 100%;
  display: flex;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}
.duoji-setting > ul > li {
  display: flex;
  justify-content: center;
  align-items: center;
}
.duoji-setting > ul > li > i {
  padding-right: 5px;
}

.duoji,
.img-open {
  width: 150px !important;
}
.card-item-left > ul > li,
.card-item-right > ul > li {
  display: flex;
  align-items: center;
  margin: 10px 0px;
}
.baud-rate {
  display: inline-block;
  width: 320px;
}
.baud-rate /deep/ .el-input__inner {
  background: #2233aa !important;
}
.upload{
  display: flex;
  align-items: center;
  width: 230px;
  flex-wrap: wrap;
}
</style>
