// pages/newClass/newClass.js
var app = getApp();
var mes = require('../../../utils/mes.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    rid:'',
    roomid:'',
  },

  classNameInput:function(e){
    this.setData({
      name: e.detail.value
    })
  },

  chooseClass:function(){
    wx.navigateTo({
      url: '../searchRoom/searchRoom',
    })
  },

  submitNewClass:function(e){
    var that = this;
    if(this.data.name.length != 0){
      if(this.data.rid){
        if (app.globalData.socket_open == true) {
          var msg = {
            info_type: "newClass",
            name: that.data.name,
            tea_no: app.globalData.uno,
            rid: that.data.rid
          };
          mes.sendMessage(JSON.stringify(msg))
          //toast做延迟显示
          setTimeout(function () {
            wx.showToast({
              title: '处理中',
              icon: 'loading',
              duration: 4000,
            })
          })
        }
        else {
          wx.showToast({
            title: '网络错误',
            icon: 'loading',
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          title: '房间不能为空',
          icon: 'loading',
          duration: 2000
        })
      }
      
    }else{
      wx.showToast({
        title: '名称不能为空',
        icon:'loading',
        duration:2000
      })
    }

  },

  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('show')
    wx.onSocketMessage(function (res) {
      var mes = JSON.parse(res.data);
      console.log(mes)
      if (mes.info_type == 'newClass') {
        if (mes.errcode == 0) {
          //覆盖处理中toast  
          wx.showToast({
            title: '新建课程成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function(){
            wx.navigateBack({
            })
          },2000)
        }
        else {
          wx.showToast({
            title: '请重试',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})