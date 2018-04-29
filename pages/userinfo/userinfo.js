Page({
  data: {
    userinfo: {}
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      userinfo: options
    });
  }
})