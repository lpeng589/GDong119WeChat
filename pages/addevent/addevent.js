var app = getApp();
var that = null;
var index = 0;
var video = null;
var state = true;
var picker_index = 0;
Page({ 
    data : {
      imgurls: [],
      src_video: '',
      play_video: '',
      src_audio: '',
      audio_state: 0,//0：未开始；1：进行中；2：已结束；3：正在播放
      address : '',
      content: '',
      isplay: false,
      array: ['请选择类型','无消防手续', '安全出口数量不足', '安全出口、疏散通道被占用、堵塞', '消防车通道被占用、堵塞', '消防设施器材损坏', '外墙门窗上设置影响逃生、灭火救援的障碍物', '消防产品不合格', '燃气、电气线路数设不安全', '违章动火', '违规存储易燃易爆危险品', '其它消防违法行为和火灾隐患'],
      picker_index: 0,
      jubao : '',
      formId : '',
      latitude: '',
      longitude: '',
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      picker_index: e.detail.value
    })
  },
  bindTextareaChange: function (e) {
    console.log('textarea发送选择改变，携带值为', e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },
  onLoad: function () {
    that = this;
    //自动定位
    that.automaticposition();
    if (app.globalData.token == null || app.globalData.token == '') {//
      app.showLoading('正在加载中');
      app.wxlogin(() => {
        wx.hideLoading();
        wx.switchTab({ url: '../addevent/addevent' });
      });
    }
  },
  onShow: function(){
    that.authTip();
  },
  authTip: function(){
    if (state) {
      if (app.globalData.user.state != '1' && false) {
        app.showModel('您还没有实名认证，不能使用随手拍功能，请先前往认证！', ok => {
          if (ok) {
            app.getauth();
            state = false;
          } else {
            wx.switchTab({ url: '../home/home' });
          }
        });
      }
    }
  },
  selectimage: function(){
    wx.chooseImage({
      count: 3 - that.data.imgurls.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = that.data.imgurls.concat(res.tempFilePaths);
        that.setData({
          imgurls: tempFilePaths
        });
      }
    })
  },
  delimage: function(e){
    var index = e.currentTarget.dataset.id;
    var arr = this.data.imgurls;
    arr.splice(index,1);
    this.setData({
      imgurls: arr
    });
  },
  selectvideo: function(){
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        that.setData({
          src_video: res.tempFilePath
        });
        video = wx.createVideoContext('myvideo');
      }
    })
  },
  playvideo: function(){
    that.setData({
      play_video: that.data.src_video,
      isplay: true
    });
    video.seek(0);
    video.play();
  },
  endvideo: function (e) {
    that.setData({ play_video: '', isplay: false});
  },
  fullscreenchange: function (e) {
    //退出全屏，关掉视频
    if (!e.detail.fullScreen){
      video.pause();
      that.setData({ play_video: '', isplay: false});
    }
  },
  startaudio: function(){
    wx.startRecord({
      success: function (res) {
        that.setData({
          src_audio: res.tempFilePath
        })
      },
      fail: function (res) {
        //录音失败
      }
    });
    that.setData({
      audio_state: 1
    });
  },
  endaudio: function () {
    that.setData({
      audio_state: 2
    });
    wx.stopRecord();
  },
  playaudio: function(){
    that.setData({
      audio_state: 3
    });
    wx.playVoice({ filePath: that.data.src_audio, success: function () { that.setData({ audio_state: 2 }); } })
  },
  stopaudio: function () {
    that.setData({
      audio_state: 2
    });
    wx.stopVoice();
  },
  addevent: function(e){
/*    if (app.globalData.user.state != '1') {
      app.showModel('您还没有实名认证，不能使用随手拍功能，请先前往认证！', ok => {
        if (ok) {
          app.getauth();
        }
      });
      return;
    }*/
    var content = e.detail.value.content;
    var jubao = e.detail.value.jubao;
    var formId = e.detail.formId;
    if ( e.detail.value.picker == 0){
      this.showMsg('请选择类型！');
    } else if (content==''){
      this.showMsg('请输入详细内容！');
    }else{
      app.showLoading('正在提交中...请稍后！');
      var event = { 'logintoken': app.globalData.token };
      event['phone'] = app.globalData.user.phone;
      event['content'] = content;
      event['type'] = e.detail.value.picker;
      event['address'] = that.data.address;
      event['jubao'] = jubao;
      event['formId'] = formId;
      event['latitude'] = that.data.latitude;
      event['longitude'] = that.data.longitude ;
      var url = app.globalData.localurl + 'wxupload.htm';
      //上传视频
      if (that.data.src_video){
        that.uploadfile(url + '?name2=wxfile&filePath2=', that.data.src_video, "wxfile", function (path) {
          event['video'] = path;
          //上传录音
          if (that.data.src_audio) {
            that.uploadfile(url + '?name2=wxfile&filePath2=', that.data.src_audio, "wxfile", function (path) {
              event['voice'] = path;
              //上传图片
              that.saveimage(event, that.data.imgurls, url);
            });
          }else{
            //上传图片
            that.saveimage(event, that.data.imgurls, url);
          }
        });
      }else{
        //上传录音
        if (that.data.src_audio){
          that.uploadfile(url + '?name2=wxfile&filePath2=', that.data.src_audio, "wxfile", function (path) {
            event['voice'] = path;
            //上传图片
            that.saveimage(event, that.data.imgurls, url);
          });
        }else{
          //上传图片
          that.saveimage(event, that.data.imgurls, url);
        }
      }
    }
  },
  saveimage: function (param, files, url){
    if (files[index]){
      that.uploadfile(url + '?name2=wximage&filePath2=', files[index], "wximage", function (path) {
        console.log('path')
        console.log(path)
        index = index + 1;
        param['pic' + index] = path;
        that.saveimage(param, files, url);
      });
    }else{
      //提交表单
      that.submitevent(param);
    }
  },
  submitevent: function(param){

    app.commonReq('wxeventadd.htm', param, resp => {
      wx.setStorageSync('homefresh', true);
      wx.hideLoading();
      if (resp.code==-1){
        wx.showModal({
          title: '温馨提示',
          content: resp.msg,
          confirmColor: "#7e0000",
          showCancel: false,
          success: function (res) {
            
          }
        })
      }else{
        that.initdata();
        wx.showModal({
          title: '提交成功',
          content: '如遇紧急情况可以拨打96119',
          confirmColor: "#7e0000",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log("../home/home")
              wx.switchTab({ url: '../home/home' });
            } else if (res.cancel) {
              wx.switchTab({ url: '../home/home' });
            }
          }
        })
      }
    });
  },
  uploadfile: function (url, filepath, name, callback){
    wx.uploadFile({
      url: url + filepath,
      filePath: filepath,
      name: name,
      formData: { 'logintoken': app.globalData.token },
      success: function (res) {
        console.log("-----res")
        console.log(res)
        var obj = "";
        if(res.data != "" && res.data != undefined){
           obj = JSON.parse(res.data);
        }
        (callback && typeof (callback) === "function") && callback(obj.msg);
      }
    })
  },
  clearForm: function(){
    that.initdata();
  },
  automaticposition: function(){
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var param = { 'logintoken': app.globalData.token };
        param.latitude = res.latitude;
        param.longitude = res.longitude;
        app.commonReq('wxgetaddress.htm', param, resp => {
          if (resp.code == 0) {
            that.setData({ address: resp.data });
            that.setData({ latitude: res.latitude })
            that.setData({ longitude: res.longitude })
          }
        });
      }
    })
  },
  updateaddress: function(e) {
    wx.chooseLocation({
      success: function(res) {
        that.setData({address:res.name})
        that.setData({ latitude: res.latitude })
        that.setData({ longitude: res.longitude })
      }
    })
  },
  //预览图像
  showimgurl: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: that.data.imgurls
    })
  },
  initdata: function(){
    //初始化数据
    index = 0;
    that.setData({
      imgurls: [],
      src_video: '',
      src_audio: '',
      audio_state: 0,//0：未开始；1：进行中；2：已结束；3：正在播放
      content: '',
      jubao: '',
      picker_index:0
    });
  },
  showMsg(msg) {
    wx.showModal({
      title: '温馨提示',
      content: msg,
      showCancel: false,
      confirmColor:"#7e0000",
      confirmText: '我知道了'
    });
  },
  onShareAppMessage: function (res) {
    return {
      title: '广东消防一点通',
      path: '/pages/addevent/addevent',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
