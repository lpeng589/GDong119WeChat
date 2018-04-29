var app = getApp();
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    app.showLoading('正在加载中');
    app.wxlogin(() => {
      app.globalData.token;
      app.globalData.user;
      wx.switchTab({ url: '../home/home' });
    });
  },
})