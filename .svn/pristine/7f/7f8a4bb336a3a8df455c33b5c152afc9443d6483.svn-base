var app = getApp();
var that = null;
var alarmid="";
var status="";
var id=0;
var interval="";
Page({ 
    data : {
       pic_img:"../../image/pic.png",
       video_img:"../../image/vedio.png",
       voice_img:"../../image/voice.png",
       voice_bth:'uploadvoice',
       array:[],
       text_class:'text_class',
       text:'',
       voiceimg : "voice1.png",
       tempvoice : "",
       voice : [], //语音文件的数组,
       other : "hide",
       container : "",
       src : "",
       address:"",
       zhuan:0
    },
onLoad: function (e) {
  console.log(e)
      that = this
     // that.automaticposition(); //获取地址
      alarmid=e.id
      status=e.status
      id=0;
      this.setData({address:e.address})
      interval = setInterval(function () {that.refresh()}, 1000)
  },
  onUnload: function (e) {
      clearInterval(interval);
  },
send: function(t,c) {
    if(t==0){
        that.setData({text:'' })
    }
    else if( t==4){
        that.setData({address:c})
    }else{
        
    }
    wx.request({
        url: app.globalData.localurl+'wxalarmdetailadd.htm',
        data: {
            _code : app.globalData.code,  
            alarmid :  alarmid,
            logintoken : app.globalData.token,
            type : t,
            content :c
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
        'content-type': 'application/json'
        },
        success: function(res){
         //  if(res.data.code==0){
        //      that.data.array.push(res.data.data.list[0])
          //      that.setData({array:that.data.array,text_class:'' })
          //      location.hash="#"+that.data.array.length-1;  
         //   }
        },
        fail: function() {
        // fail
        },
        complete: function() {
        // complete
        }
    })
  },
  contentinput : function(e){
      that.setData({text:e.detail.value })  
  },
  sendtext: function(e) {
      if(that.data.text!=null&&that.data.text!=''&&that.data.text!=undefined&&status){
         that.send(0,that.data.text)    
      }
  },
     uploadpic: function(e) {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
 //           console.log(app.globalData.localurl+'wxupload.htm?_code='+app.globalData.code);
            app.showToast('上传中','loading',10000);
            var tempFilePaths = res.tempFilePaths[0]
            wx.uploadFile({
            url: app.globalData.localurl+'wxupload.htm?_code='+app.globalData.code+'&name2=wximage&filePath2='+tempFilePaths, //仅为示例，非真实的接口地址
            filePath: tempFilePaths,
            name: 'wximage',
            formData:{
                
            },
            success: function(res){
                wx.hideToast();
                var obj = JSON.parse(res.data);
                that.send(3,obj.msg)   
            }
            })
        }
     })
  },
  uploadvideo: function(e) {
      wx.chooseVideo({
            sourceType: ['album','camera'],
            maxDuration: 60,
            camera: ['back'],
            success: function(res) {
            app.showToast('上传中','loading',10000);
            var tempFilePaths = res.tempFilePath
            wx.uploadFile({
            url: app.globalData.localurl+'wxupload.htm?_code='+app.globalData.code+'&name2=wxfile&filePath2='+tempFilePaths, //仅为示例，非真实的接口地址
            filePath: tempFilePaths,
            name: 'wxfile',
            formData:{
                
            },
            success: function(res){
                wx.hideToast();
                var obj = JSON.parse(res.data);
                that.send(2,obj.msg)   
            }
            })
            }
        })
  },
uploadvoice : function(e) {
    that.setData({
        voice_bth:'endvoice',
        voice_img:'../../image/voiceend.png'
    })
    wx.startRecord({
    success: function (res) {
        wx.uploadFile({
        url: app.globalData.localurl+'wxupload.htm?_code='+app.globalData.code+'&name2=wxfile&filePath2='+res.tempFilePath, //仅为示例，非真实的接口地址
        filePath: res.tempFilePath,
        name: 'wxfile',
        formData:{
            
        },
        success: function(res){
            that.setData({voice_bth:'uploadvoice', voice_img:'../../image/voice.png'})
            var obj = JSON.parse(res.data);
            that.send(1,obj.msg)   
        }
    })
    }
})
  },
  endvoice: function(e) {
       that.setData({voice_bth:''})
       wx.stopRecord()   
  },
  automaticposition: function () {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log("///")
        console.log(res)
        console.log("///")
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
getaddress: function() {
    this.setData({zhuan:this.data.zhuan+720})  
    wx.getLocation({
        type: 'wgs84',
        success: function(res) {
            wx.request({
            url: app.globalData.localurl+'wxgetaddress.htm',
            data: {
                _code : app.globalData.code,
                Latitude : res.latitude,
                Longitude : res.longitude
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
            'content-type': 'application/json'
            },
            success: function(res){
                if(res.data.code==0){
                    that.send(4,res.data.data)   
                }
            }
        })
        }
        })
  },
  onShow : function(){
      
    //   if(status!=2&&status!=true&&false){
    //       id=0;
    //       this.data.array=[];
    //         wx.request({
    //           url: app.globalData.localurl+'dealdetail.htm',
    //           data: {
    //               _code : app.globalData.code,
    //               alarmid :  alarmid,
    //               id :  id,
    //           },
    //           method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //           header: {
    //           'content-type': 'application/json'
    //           },
    //           success: function(res){
    //             if(res.data.data!=null&&res.data.data!=''&&res.data.data!=undefined){
    //              //   var a=1;
    //              /*   for(var i=res.data.data.length-1;i>=0;i--){
    //                 that.data.array.push(res.data.data[i]);
    //                     console.log(res.data.data[i].id);
    //                     if(a==1){
    //                         id=res.data.data[i].id;
    //                         a=2;
    //                     }
    //                 }   */

    //                 for(var i=0;i<res.data.data.length;i++){
    //                     that.data.array.push(res.data.data[i]);
    //                     if(i+1==res.data.data.length){
    //                         id=res.data.data[i].id;
    //                     }
    //                 }
    //                 that.setData({
    //                     array:that.data.array,
    //                     text_class:'',
    //                     text : '' 
    //                 })
    //             }  
    //           },
    //           fail: function() {
    //             // fail
    //           },
    //           complete: function() {
    //             // complete
    //           }
    //         })
    //   }
  },
  //播放暂停录音
   voice:function(e){
       console.log(e);
       var id = e.target.dataset.id;
       if(this.data.voice[id]!=null){
           this.playVoice(this.data.voice[id]);
       }else{
           this.data.voice[id]=e.target.dataset.src.replace("http://pnkooweibo.oss-cn-shenzhen.aliyuncs.com","https://d.pnkoo.cn");
           wx.downloadFile({
                url: this.data.voice[id], //仅为示例，并非真实的资源
                success: function(res) {
                        that.data.voice[id]=res.tempFilePath;
                        that.playVoice(that.data.voice[id]);
                },
                fail : function(e){
                    console.log(e.errMsg);
                },
            })
       }
   },
   playVoice : function(tempFilePath){
       wx.playVoice({
        filePath: tempFilePath,
            success : function(e){
                
            },
            complete: function(){
                console.log(replaceVoice);
            }
        })
   },
   call : function(){
       wx.makePhoneCall({
        phoneNumber: '119' 
        })
   },
   showbig : function(e){
       if(this.data.other=="hide"){
           this.setData({
               other:"",
               container:"hide",
               src:e.target.dataset.src
            })
       }else{
           this.setData({
              other:"hide",
              container:"",
              src:""
            })
       }
   },
  updateaddress: function(e) {
       wx.chooseLocation({
        success: function(res) {
            that.send(4,res.name)   
        }
        }) 
  },
  refresh: function(e) {//刷新内容
      wx.request({
              url: app.globalData.localurl+'dealdetail.htm',
              data: {
                  _code : app.globalData.code,
                  logintoken : app.globalData.token,
                  alarmid :  alarmid,
                  id :  id,
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
              'content-type': 'application/json'
              },
              success: function(res){
                if(res.data.data!=null&&res.data.data!=''&&res.data.data!=undefined){
                    for(var i=0;i<res.data.data.length;i++){
                    that.data.array.push(res.data.data[i]);
                            id=res.data.data[i].id;
                        }
                    that.setData({
                    array:that.data.array,
                    })
                }  
              },
              fail: function() {
                // fail
              },
              complete: function() {
                // complete
              }
            })
  },
    onShareAppMessage: function(){
         return {
            title: '广东消防报警',
            desc: '欢迎使用119小微警',
            path: 'pages/index/index'
        }
    }
})
