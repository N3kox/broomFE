// pages/classFunction/joinClass/joinClass.js
var app = getApp();
var mes = require('../../../utils/mes.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length : 0,
    code : '',
    sendMark : false,
    stu_no : '',

  },

  inputClassCode:function(e){
    var that = this;
    this.setData({
      length : e.detail.value.length,
      code : e.detail.value 
    })
    if(this.data.length == 5 && this.data.sendMark == false){
      let m = {
        info_type : 'joinClass',
        stu_no : that.data.stu_no,
        code : that.data.code
      }
      this.data.sendMark = true
      mes.sendMessage(JSON.stringify(m))
      wx.showToast({
        title: '正在处理',
        icon : 'loading',
        duration : 5000,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.data.stu_no = app.globalData.uno;

    //未接受到消息前禁止重发消息
    wx.onSocketMessage(function(res){
      var r = JSON.parse(res.data);
      console.log(r)
      if(r.info_type == 'joinClass'){
        that.data.sendMark = false;
        if(r.errcode == 0){
          wx.showToast({
            title: '加入班级成功',
            icon : 'success',
            duration : 1500,
          })
          setTimeout(function(){
            wx.navigateBack({
              
            })
          },2100)
        }
        else{
          switch(r.errtype){
            case 'dbError':{
              wx.showToast({
                title: '输入错误',
                icon : 'loading',
                duration : 1500,
              })
              break;
            }
            case 'noSuchClass':{
              wx.showToast({
                title: '无此班级',
                icon:'loading',
                duration:1500,
              })
              break;
            }
            case 'joinError':{
              wx.showToast({
                title: '加入班级错误',
                icon:'loading',
                duration:1500,
              })
            }
          }
        }
      }
    })
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