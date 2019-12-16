// pages/register/register.js
var mes = require('../../utils/mes.js');
var md5 = require('../../utils/md5.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuNo:'',
    pwd1:'',
    pwd2:'',
    enc:'',
    iv:'',
    pattern: /^[\w_-]{6,16}$/,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '未开放注册',
      icon:'loading',
      duration:1500
    })
    setTimeout(function(){
      wx.navigateBack({
        
      })
    },1500)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  NameInput:function(e){
    this.setData({
      name:e.detail.value
    })
  },

  StuNoInput: function (e) {
    this.setData({
      stuNo: e.detail.value
    })
  },
  Password1Input: function (e) {
    this.setData({
      pwd1: e.detail.value
    })
  },
  Password2Input: function (e) {
    this.setData({
      pwd2: e.detail.value
    })
  },
  regist:function(e){
    let that = this;
    let pat = /^[\w_-]{6,16}$/;
    console.log(this.data.stuNo);
    console.log(this.data.pwd1);
    console.log(this.data.pwd2);
    console.log(e.detail);
    if(this.data.stuNo.length == 0 || this.data.pwd1.length == 0 || this.data.pwd2.length == 0){
      console.log("len = 0");
      wx.showToast({
        title: '学号密码不能为空',
        icon:'loading',
        duration:2000
      })
    }
    else if(this.data.pwd1 != this.data.pwd2){
      console.log("pwd1 pwd2 different");
      wx.showToast({
        title: '输入密码不一致',
        icon:'loading',
        duration:2000
      });
    }
    else if(pat.test(this.data.pwd1) == false){
      console.log("pattern false");
      if(pwd1.length > 16 || pwd1.length < 8){
        wx.showToast({
          title: '密码长度8-16位',
          icon:'loading',
          duration:2000
        });
      }
      else{
        wx.showToast({
          title: '密码限定数字与字符组合',
          icon:'loading',
          duration:2000
        })
      }
    }
    else{
      if (e.detail.userInfo) {
        wx.login({
          success: res => {
            console.log(`button get code:${res.code}`)
            let message = {
              info_type: 'register',
              stu_no:that.data.stuNo,
              pwd:md5.hexMD5(that.data.pwd1),
              code: res.code,
              encryptedData: encodeURIComponent(e.detail.encryptedData),
              iv: encodeURIComponent(e.detail.iv)
            };
            mes.sendMessage(JSON.stringify(message));
            console.log(message);
          }
        })

      } else {
        wx.showModal({
          title: '已拒绝',
          content: '您已拒绝授权，无法注册',
          showCancel: false,
          confirmText: '返回授权',
          success: res => {
            if (res.confirm)
              console.log("#register:return to register page")
          }
        })
      }
    }
    
    wx.onSocketMessage(function(res){
      var message = JSON.parse(res.data);
      console.log(message);
      switch(message.info_type){
        case 'register':{
          if(message.errcode == 0){
            //注册成功
            wx.setStorageSync('cache_stu_no', that.data.stuNo);
            app.globalData.uno = that.data.stuNo;
            app.globalData.isStudent = true;
            wx.setStorageSync('cache_room', '无');
            wx.setStorageSync("isLogin", true);
            wx.showToast({
              title: '注册成功',
              duration:2000,
              icon:'success',
            })
            setTimeout(function(){
              wx.switchTab({
                url: '../index/main/main',
              })
            },2000);
          }
          else{
            if (message.errReason == 'reged'){
              wx.showToast({
                title: '此学号已注册',
                icon:'loading',
                duration:2000
              })
            }
            else if (message.errReason == 'stm'){
              wx.showToast({
                title: '授权失效',
                icon:'loading',
                duration:2000
              })
            } 
            else{
              wx.showToast({
                title: '数据库Error',
                icon:'loading',
                duration:2000
              })
            }
          }
          break;
        }
      }
      
    })
    
  },
  //temprary




})