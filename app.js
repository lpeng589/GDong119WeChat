var that = null;
App({
  onLaunch: function () {
    that = this;
  },
  onShow: function (options) {
    //验证token参数是否存在
    if (options.referrerInfo){
      //token存在，调用接口获取认证结果
      that.getuser(options.referrerInfo.extraData.token);
    }
  },
  globalData: {
    token: '',
    user: null,
    userInfo: null,
    code:null,
  //localurl: "https://gdxf.pnkoo.cn/"
    // localurl: "https://shop.pnkoo.cn/"
 // localurl: "http://192.168.23.246:8080/"
    localurl: "http://localhost:8088/"
  },
  //用户信息
  getuser: function (token, callback){
    var param = { 'logintoken': that.globalData.token };
    if (token){
      param.token = token;
    }
    that.commonReq('getuser.htm', param, resp => {
      that.globalData.user = {};
      that.globalData.user['state'] = resp.data.sign_status;
      that.globalData.user['headimgurl'] = resp.data.headimgurl;
      that.globalData.user['name'] = resp.data.sign_name;
      that.globalData.user['sex'] = resp.data.sex;
      that.globalData.user['sign_sex'] = resp.data.sign_sex;
      that.globalData.user['phone'] = resp.data.sign_phone;
      that.globalData.user['cardid'] = resp.data.sign_id;
      that.globalData.user['cardtime'] = resp.data.sign_ID_valid_date;
      (callback && typeof (callback) === "function") && callback();
    });
  },
  getUserInfo: function (cb) {
    if (this.globalData.userInfo && false) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
           
            //直接将code存入storage
            that.globalData.code = res.code;
            wx.getUserInfo({
              success: function (res) {
                console.log(that.globalData.token)
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            })
          }
        }
      })
    }
  },
  //认证
  getauth: function(){

    that.commonReq('wxsign.htm', { 'logintoken': that.globalData.token }, resp => {
      wx.navigateToMiniProgram({
        appId: 'wxbd7df96b05f70ff7',
        page: 'page/component/pages/index/index',
        extraData: {
          signature: resp.data.signature,
          uid: resp.data.uid,
          appid: resp.data.appid
        },
   //    envVersion: 'trial'
          envVersion: 'release'
      })
    });
  },
  //登陆
  wxlogin: function (callback){
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          lang: 'zh_CN',
          success: function (user) {
            var param = {};
            param['_code'] = res.code;
            param['nickname'] = user.userInfo.nickName;
            param['headimgurl'] = user.userInfo.avatarUrl;
            param['sex'] = user.userInfo.gender;
            param['country'] = user.userInfo.country;
            param['city'] = user.userInfo.city;
            param['province'] = user.userInfo.province;
            //调用服务器登陆
            that.commonPromise('mwxxcxklogin.html', param).then(resp => {
              console.log('登陆成功：', resp.data.logintoken);
              that.globalData.token = resp.data.logintoken;
              (callback && typeof (callback) === "function") && that.getuser('',callback);
            },error => {
              console.log('登陆失败');
            })
          }
        })
      }
    })
  },
  commonReq: function(url,param,callback){
    wx.request({
      url: that.globalData.localurl + url,
      data: param,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        callback(res.data);
      },
      fail: function (res) {
        callback(res);
      }
    })
  },
  commonPromise: function (url, param){
    return new Promise(function (resolve, reject) {
      wx.request({
        url: that.globalData.localurl + url,
        data: param,
        header: { 'content-type': 'application/json' },
        success: function (res) {
          resolve(res.data);
        },
        fail: function (res) {
          reject(res);
        }
      })
    });
  },
  showModel: function(title,callback){
    wx.showModal({
      title: '提示',
      content: title,
      success: function (res) {
        if (res.confirm) {
          callback(true);
        } else if (res.cancel) {
          callback(false);
        }
      }
    })
  },
  showLoading: function (title, mask){
    wx.showLoading({ title: title, mask: mask ? mask : true });
  },
  showToast: function (title, icon, duration){
    wx.showToast({ 
      title: title,
      icon: icon ? icon : 'loading', 
      duration: duration ? duration : 1000
    })
  },
})