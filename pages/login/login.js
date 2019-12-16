var app = getApp();
var md5 = require('../../utils/md5.js');
var mes = require('../../utils/mes.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuno_ret:"",
    password_ret:"",
    servermsg:[],
    stuno:"",
    password:'',
    rstuno:"",
    rpassword:"",
    code:'',
  },
  
  onLoad:function(options){
    let that = this;
    if (wx.getStorageSync("isLogin") == true) {
      //账密登录态校验
      //利用storage===undefined判断账密登录态
      console.log(wx.getStorageSync("cache_stu_no"));
      if (wx.getStorageSync("cache_stu_no") != undefined) {
        console.log("sutno cached now send!!");
        let message = {
          info_type: 'storageLogin',
          stu_no: wx.getStorageSync("cache_stu_no")
        }
        mes.sendMessage(JSON.stringify(message))
      }
      //授权登录态校验
      else {
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              wx.login({
                success: res => {
                  that.setData({
                    code: res.code
                  })
                  //8.11 重构逻辑，处理解密错误
                  wx.getUserInfo({
                    success: res => {
                      let enc = res.encryptedData;
                      let iv = res.iv;
                      let message = {
                        info_type: 'islogged',
                        code: that.data.code,
                        encryptedData: encodeURIComponent(enc),
                        iv: encodeURIComponent(iv)
                      }
                      mes.sendMessage(JSON.stringify(message));
                    }
                  })
                }
              })
            }
            else {
              console.log("#???");
            }
          }
        })
      }
    }
    //未登录
    wx.onSocketMessage(function (res) {
      //每次接收到消息下列语句都会执行
      var server_msg = JSON.parse(res.data);
      if (server_msg.info_type === 'check_info_done') {
        console.log("servermsg:", server_msg);
        if (server_msg.errcode == 0) {
          if (server_msg.usertype == "student") {
            wx.setStorageSync('cache_stu_no', that.data.stuno);
            app.globalData.uno = that.data.stuno;
            app.globalData.name = server_msg.name;
            app.globalData.isStudent = true;
            console.log("room:", server_msg.room);
            if (server_msg.room != null)
              wx.setStorageSync('cache_room', server_msg.room);
            else
              wx.setStorageSync('cache_room', '无');
            wx.showToast({
              title: '登陆成功',
              icon: 'success',
              duration: 2000
            });
            setTimeout(function () {
              wx.switchTab({
                url: '../index/main/main',
              })
            }, 2000);
            console.log('loginfunction over.');
          }
          else if (server_msg.usertype == "teacher") {
            wx.setStorageSync('cache_stu_no', that.data.stuno);
            app.globalData.uno = that.data.stuno;
            app.globalData.name = server_msg.name;
            app.globalData.isStudent = false;
            //console.log("app.globalData.isStudent", app.globalData.isStudent)
            wx.showToast({
              title: '教师登陆成功',
              icon: 'success',
              duration: 2000
            });
            setTimeout(function () {
              wx.switchTab({
                url: '../index/main/main',
              })
            }, 2000);
          }
        }
        else {
          wx.showToast({
            title: '学号或密码错误',
            icon: 'loading',
            duration: 2000
          })
        }
      }
      else if (server_msg.info_type == 'storageLogin'){
        console.log("storageLogin!");
        if(server_msg.errcode == 0){
          app.globalData.uno = server_msg.stu_no;
          app.globalData.name = server_msg.name;
          if (server_msg.room != null)
            wx.setStorageSync('cache_room', server_msg.room);
          else
            wx.setStorageSync('cache_room', '无');
          wx.showToast({
            title: '授权登录成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../index/main/main',
            })
          },2000);
        }
        //此情况不会发生，仅做测试
        else if(server_msg.errcode == 1){
          if(server_msg.reason == 'noRegister'){
            wx.showToast({
              title: '您尚未注册',
              icon: 'loading',
              duration: 2000
            })
            setTimeout(function () {
              wx.navigateTo({
                url: '../register/register',
              })
            }, 2000);
          }
        }
      }
      else if (server_msg.info_type == 'wxlogin' || server_msg.info_type == 'islogged'){
        console.log("wxlogin or islogged")
        console.log(server_msg);
        if(server_msg.errcode == 1){
          if(server_msg.reason == 'stm'){
            console.log('session time out');
            wx.showToast({
              title: '授权信息失效，请重试',
              icon: 'loading',
              duration: 2000,
            })
          }
          else if(server_msg.reason == 'noRegister'){
            console.log("用户尚未注册");
            wx.showToast({
              title: '您尚未注册',
              icon:'loading',
              duration:2000
            })
            setTimeout(function(){
              wx.navigateTo({
                url: '../register/register',
              })},2000);
          }
        }
        else{
          wx.setStorageSync("isLogin", true)
          wx.setStorageSync('cache_stu_no', server_msg.stu_no);
          app.globalData.uno = server_msg.stu_no;
          app.globalData.name = server_msg.name;
          if (server_msg.room != null)
            wx.setStorageSync('cache_room', server_msg.room);
          else
            wx.setStorageSync('cache_room', '无');
          wx.showToast({
            title: '授权登录成功',
            icon:'success',
            duration:2000
          })
          setTimeout(function(){
            wx.switchTab({
              url: '../index/main/main',
            })
          },2000);
        }
      }
    });



    wx.onSocketError(function (res) {
      console.log('websocket error plz check!', res)
    });
    //初始化

  },

  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      wx.login({
        success: res => {
          console.log(`button get code:${res.code}`)
          let message = { 
            info_type: 'wxlogin',
            code: res.code,
            encryptedData: encodeURIComponent(e.detail.encryptedData),
            iv: encodeURIComponent(e.detail.iv)
          };
          mes.sendMessage(JSON.stringify(message));
          that.setData({
            code: res.code,
          })
          wx.showToast({
            title: '登录中',
            icon: 'loading',
            duration: 2000
          })
        }
      })

    } else {
      wx.showModal({
        title: '已拒绝',
        content: '您已拒绝授权，无法获取登录信息',
        showCancel: false,
        confirmText: '返回授权',
        success: res => {
          if (res.confirm)
            console.log("#login:return to login page")
        }
      })
    }
  },
  

  StuNoInput:function(e){
    this.setData({
      stuno:e.detail.value
    })
  },

  PasswordInput:function(e){
    this.setData({
      password:e.detail.value
    })
  },

//loginfunction 需要修改
  login:function(event){
    var that = this;
    if(this.data.stuno.length == 0||this.data.password.length==0){
      wx.showToast({
        title:'学号或密码不能为空',
        icon:'loading',
        duration:2000
      })
    }
    else if (this.data.stuno === '123' && this.data.password === '123')
    {
      wx.setStorageSync('uid', 'admin');
      wx.showToast({
        title: 'adminlogin',
        icon: 'success',
        duration: 2000
      });
      
      setTimeout(function () {
        wx.switchTab({
          url: '../index/main/main'
        })
        /*
        wx.navigateTo({
          url: '/pages/index/index',
        })
        */
      }, 2000);
      
    }
    else
    {
      //this.data.socket_open
      if (app.globalData.socket_open == false)
      {
        wx.showToast({
          title: 'error net connect',
          icon: 'loading',
          duration: 2000
        })
      }
      else{
        console.log('websocket发送信息!!');
        var json_msg = {
          info_type: "login",
          "stuno": that.data.stuno,
          "password": md5.hexMD5(that.data.password)
        };
        that.sendSocketMessage(JSON.stringify(json_msg));
        wx.showToast({
          title: '登录中',
          icon:'loading',
          duration:2000
        })
      }
    }
  },
  register:function(){
    wx.navigateTo({
      url: '../register/register',
    })
  },
 


//以下代码待定作为测试，之后可以注释掉
//以下为点击发送至nodejs后端，需要修改

  sendSocketMessage: function (msg) {
    if (app.globalData.socket_open) {
      wx.sendSocketMessage({
        data: msg
      })
    }
  },

  findpwd:function(e){
    console.log("忘记密码(没做呢)")
  }


//以下为按钮点击调用测试
/*
  nodejs_link_test:function(e){
    if(this.data.socket_open === false)
      this.init_function();
    console.log('nodejs_link_test on!!');
    var json_msg = {
      "cur_stuno" : this.data.rstuno,
      "cur_stupa" : this.data.rpassword
    };
    z``
    if (this.data.socket_open == true)
      this.sendSocketMessage(JSON.stringify(json_msg));
    //this.linkClose();
  }
*/

})

