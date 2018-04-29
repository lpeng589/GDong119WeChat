var app = getApp();
var that = null;
Page({ 
  data : {
    data: {},
    images: [],
    temp_voice: '',
    isplay: false
  },
  onLoad: function (options) {
    that = this;
    that.getdetail(options.id);
    if (app.globalData.token == null || app.globalData.token == '') {//
      app.showLoading('正在加载中');
      app.wxlogin(() => {
      wx.hideLoading();
      wx.switchTab({ url: '../eventdetail/eventdetail' });
      });
    }

  },

  getdetail: function(id) {
    var param = { 'logintoken': app.globalData.token, 'id': id };
    app.commonReq('wxeventdetail.htm', param, resp => {
      if (resp.code == 0) {
        var images = [];
        if (resp.data.pic1) {
          images[0] = resp.data.pic1;
        }
        if (resp.data.pic2) {
          images[1] = resp.data.pic2;
        }
        if (resp.data.pic3) {
          images[2] = resp.data.pic3;
        }
        that.setData({
          data: resp.data,
          images: images
        })
      }
    });
  },
  //预览图像
  showimgurl : function(e){
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: that.data.images
    })
  },
  playaudio: function(){
    if (that.data.temp_voice){
      that.playvoice(that.data.temp_voice);
    }else{
      wx.downloadFile({
        url: that.data.data.voice,
        success: function (res) {
          that.setData({temp_voice: res.tempFilePath});
          that.playvoice(res.tempFilePath);
        }
      })
    }
  },
  stopaudio: function(){
    that.setData({ isplay: false });
    wx.stopVoice();
  },
  playvoice: function(file){
    that.setData({ isplay: true });
    wx.playVoice({ 
      filePath: file,
      success: function () {
        that.setData({ isplay: false });
      }
    })
  }
})
