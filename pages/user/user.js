var app = getApp();
let interval = null;
let that = null;
Page({
  data: {
    user: {}
  },
  onLoad: function (options) {
    that = this;
  },
  onShow: function () {
    that.setData({ user: app.globalData.user });
    that.lx();
  },
  onHide: function(){
    interval && clearInterval(interval); 
  },
  onUnload: function(){
    interval && clearInterval(interval); 
  },
  userauth: function(){
    //判断用户是否已授权
    if (that.data.user.state != '1'){
      app.getauth();
    }else{
      that.userinfo();
    }
  },
  userinfo: function(){
    var param = '?headimgurl=' + that.data.user.headimgurl
      + '&name=' + that.data.user.name
      + '&phone=' + that.data.user.phone
      + '&sex=' + that.data.user.sex
      + '&sign_sex=' + that.data.user.sign_sex
      + '&cardtype=身份证'
      + '&cardid=' + that.data.user.cardid
      + '&cardtime=' + that.data.user.cardtime
	  wx.navigateTo({url: '../userinfo/userinfo' + param})
  },
  lx: function(){
    if (that.data.user.state != '1') {
      // 轮询认证状态
      interval = setInterval(function () {
        that.setData({ user: app.globalData.user });
        if (that.data.user.state == '1') {
          clearInterval(interval);
        }
        console.log("定时任务：");
      }, 1000);
    }
  }
})