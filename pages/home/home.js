var app = getApp();
var state = true;
var that = null;
Page({
  data: {
    img_url: '',
    img_data: [],
    swiperCurrent: 0,
    page: 1,
    is_fresh: true,
    event_data: [],
    buttom: ''
  },
  onLoad: function (options) {
    that = this;
  },
  onShow: function () {
    var value = wx.getStorageSync('homefresh');
    if (value){
      that.setData({ page: 1, is_fresh: true, buttom: '' })
      that.getimagelist();
      that.geteventlist();
      wx.setStorageSync('homefresh', false);
    }else{
      if (that.data.event_data.length == 0){
        that.getimagelist();
        that.geteventlist();
      }
    }
  },
  //获取轮播图
  getimagelist: function(){
    app.commonReq('mposlink.html', {}, resp => {
      
      that.setData({
        img_data: resp.data.poslinklist,
        img_url: resp.data.imageRootPath
      })
    });
  },
  geteventlist: function(){
    app.showLoading('正在加载中');
    state = false;
    var param = { 'page': that.data.page, 'logintoken': app.globalData.token};
    app.commonReq('wxeventlist.htm', param, resp => {
      state = true;
      wx.hideLoading();
      if (resp.data.length > 0) {
        console.log(resp.data)
        that.setData({
          page: param.page + 1,
          event_data: resp.data
        })
      } else {
        that.setData({
          is_fresh: false,
          buttom: '已无更多数据'
        })
      }
    });
  },
  swiperChange: function (e) {
    that.setData({ swiperCurrent: e.detail.current });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    that.setData({
      page: 1,
      is_fresh: true,
      buttom: ''
    }) 
    that.geteventlist();
    that.getimagelist();
  },
  eventdetail: function(e){
    wx.navigateTo({
      url: '../eventdetail/eventdetail?id=' + e.currentTarget.dataset.id
    })
  },
  addevent: function(){
    wx.switchTab({ url: '../addevent/addevent' });
  },
  //上拉加载
  onReachBottom: function () {
    if (this.data.is_fresh && state) {
      that.geteventlist();
    } else {
      that.setData({
        buttom: '已无更多数据'
      });
    }
  },

  onShareAppMessage: function (res) {
    return {
      title: '广东消防一点通',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})