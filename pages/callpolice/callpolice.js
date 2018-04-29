var app = getApp();
var that = null;
var address="";
var flag=false;
var scanKey="";
Page({ 
    data : {
    baojing : "baojing1.png",
    stop : false,   //判断是否可以进入报警详情
    id : -1,
    status : 0,
    other :"hide",
    },
    position :{
        x: -1,
        y: -1,
        v: 1,    //绘圆的半径
        t : 0   //判断是否长按超过3秒
    },
    //报警
    baojing: function(e) {
        clearTimeout(this.t);
        if(this.data.stop){
            return;
        }
        if(this.data.id>0){
            this.data.stop=true;
            wx.navigateTo({url: '../alarmdetail/alarmdetail?id='+this.data.id+'&status='+this.data.status+'&address='+address})
        }else{
            wx.request({
            url: app.globalData.localurl+'wxalarmadd.htm',
            data: {
                _code : app.globalData.code,    
                address : address  
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
            'content-type': 'application/json'
            },
            success: function(res){
                wx.showToast({
                    title: '报警成功',
                    icon: 'success',
                    success : function(){
                        that.data.stop=true;
                        wx.navigateTo({url: '../alarmdetail/alarmdetail?id='+res.data.data+'&status=true&address='+address})
                    }
                })
            },
            fail: function() {
            // fail
            },
            complete: function() {
            // complete
            }
            })
        }
    },
  //触摸动作开始
  t : "",
  start :　function(e){
    if(that.data.baojing=="baojing1.png"){
        that.setData({
        baojing:"baojing_red.png",
            stop : false
        })
    }else{
        that.setData({
        baojing:"baojing1.png",
        stop : false
        })
    }
    that.position.t++;
   // this.drawcirclepre();
    that.t =setTimeout(that.start,200);
    if(that.position.t>10&&flag){
        that.position.t=0;
        clearTimeout(that.t);
        that.baojing();
    }
  },
  end : function(){
      that.setData({
        baojing:"baojing1.png",
        stop : true
        })
     //   this.position.t=0;  
     //   this.position.v=0;
     //   this.position.x=-9999;
        // var context = wx.createContext();
        // context.clearRect(0, 0, 500, 500);
        // wx.drawCanvas({
        // canvasId: 'canvas',
        // actions: context.getActions()
        // })
        that.position.t=0;
        clearTimeout(this.t);
  },
  //循环绘圆形
  drawcirclepre : function(){
    if(this.position.v>320){
        this.position.v=296;
        this.drawcircle();
        this.position.v=256;
        this.drawcircle();
        this.position.v=128;
        this.drawcircle();   
        this.position.v=64;
        this.drawcircle();   
        this.position.v=32;
        this.drawcircle();   
    }
    this.position.v=this.position.v+17;
    this.drawcircle();
  },
  //绘图
  drawcircle : function(){
    var p = this.position;
    var context = wx.createContext();
    context.setLineWidth(5);
    if(p.v>32){
        ball(p.x, p.y,p.v-16,"#ffffff","#d81e06");
        if(p.v>64){
            ball(p.x, p.y,p.v-64,"#ffffff","#d81e06");
            if(p.v>128){
                ball(p.x, p.y,p.v-128,"#ffffff","#1296db");
                if(p.v>216){
                    ball(p.x, p.y,p.v-216,"#ffffff","#d81e06");
                }
            }
        }
    }
    wx.drawCanvas({
    canvasId: 'canvas',
    actions: context.getActions()
    })
     function ball(x, y,z,fill,stroke) {
      context.beginPath(0)
      context.arc(x, y, z, 0, Math.PI * 2)
      context.setFillStyle(fill)
      context.setStrokeStyle(stroke)
      //context.fill()
      context.stroke()
    }
  },
  onLoad: function (e) {

    flag=false;
    that = this
    scanKey="";
    if(e.key!=undefined&&e.key!=null){
      scanKey=e.key;
    }
    scanKey="1"
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      wx.request({
                  url: app.globalData.localurl+'wxlogin.htm',
                  data: {
                    _code : app.globalData.code,
                    nickname : userInfo.nickName,
                    headimgurl : userInfo.avatarUrl,
                    city :  userInfo.city,
                    sex : userInfo.gender,
                    province :  userInfo.province,
                    country : userInfo.country,
                    key:scanKey,
                    logintoken : app.globalData.token,
                  },
                    header: {
                      'Content-Type': 'application/json'
                  },
                  success: function(res){
    
                     wx.getLocation({
                        type: 'wgs84',
                        success: function(res) {
                     
                            that.getaddress(res.latitude,res.longitude);
                            that.getalarmid();
                        },
                        fail: function(res) {
                           // console.log(res);
                        }
                        })
                  },
                  fail: function(res) {
                   //   console.log(res);
                  },
                  complete: function(res) {
                      
                  }
                })
    })
  },
    getaddress: function(latitude,longitude) {
    wx.request({
        url: app.globalData.localurl+'wxgetaddress.htm',
        data: {
            _code : app.globalData.code,
            logintoken : app.globalData.token,
            Latitude : latitude,
            Longitude : longitude
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
        'content-type': 'application/json'
        },
        success: function(res){
            console.log("getaddress")
          console.log(res)
            if(res.data.code==0){
                address=res.data.data
            }
        },
        fail: function(res) {
        },
        complete: function(res) {
        }
    })
    },
    onShow : function(e){
       // this.getalarmid();
    },
    getalarmid : function(){
        clearTimeout(that.t);
        wx.request({
          url: app.globalData.localurl+'getwxalarm.htm',
          data: {
              _code : app.globalData.code,
              logintoken : app.globalData.token
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/json'
          },
          success: function(res){
            
           
            that.data.id=-1;
            that.data.status=0;

            if(res.data.code==0){
                var result = res.data.data;
                that.data.status = result.status;

                if(result.status!=2){
                    that.data.id = result.id;
                    console.log(that.data.id+"<----getalarmid")
                    //that.start();
                }
            }
            flag=true;
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    },
     picshow : function(){
       that.setData({
          other:"",
      })
    }, 
    pichide : function(){
       that.setData({
          other:"hide",
      })
    },
    onShareAppMessage: function(){
         return {
            title: '广东119报警',
            desc: '欢迎使用119小微警',
            path: 'pages/callpolice/callpolice'
        }
    }
})
