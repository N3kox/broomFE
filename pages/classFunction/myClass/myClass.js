// pages/myClass/myClass.js
var app = getApp();
var mes = require('../../../utils/mes.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isStudent : false,
    tea_no:'',
    classInfo : [],
    noroom :false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */

  enterClass: function(e){
    let cid = JSON.stringify(e.currentTarget.dataset.cid);
    var code;
    var name;
    for(var i=0;i<this.data.classInfo.length;i++){
      var t = this.data.classInfo[i]
      if(t.cid == cid){
        code = t.code;
        name = t.name;
        break;
      }
    }
    wx.navigateTo({
      url: '../classDetail/classDetail?cid=' + cid + '&code=' + JSON.stringify(code) + '&name=' + JSON.stringify(name),
    })
  },

  onLoad: function (options) {
    var that = this;
    //console.log(getCurrentPages())
    this.setData({
      tea_no : app.globalData.uno,
    })
    var msg = {
      info_type : "myClass",
      tea_no : that.data.tea_no,
    }
    if(app.globalData.socket_open == true){
      mes.sendMessage(JSON.stringify(msg));
    }
    else{
      setTimeout(function(){
        wx.showToast({
          title: '网络连接失败',
          icon: 'loading',
          duration: 2000
        })
        wx.navigateBack({})
      })
    }
    wx.onSocketMessage(function(res){
      var message = JSON.parse(res.data);
      if (message[0].info_type == 'myClass') {
        if(message[0].errcode == 0){
          var info = [];
          var a = message[1];
          console.log('a.'+a)
          if(a!=undefined){
            for (var i = 0; i < a.length; i++) {
              var pushInfo = {
                cid: a[i].cid,
                name: a[i].name,
                code: a[i].code,
              };
              info.push(pushInfo);
              that.setData({
                classInfo: info
              })
              console.log(that.data.classInfo)
            }
          }else{
            that.setData({
              noroom : true
            })
          }
        }
        else{
          console.log("获取教室信息失败，返回")
          wx.navigateBack({})
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
   * 生命周期函数--监听页面显示   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏f
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