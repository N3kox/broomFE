// pages/classFunction/searchRoom/searchRoom.js
var mes = require('../../../utils/mes.js')
var color_set = require("../../../utils/colorset.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curInput:'',
    roomList:[],
  },


  inputRoomId: function (e) {
    var that = this;
    this.setData({
      curInput: e.detail.value,
    })
    let m = {
      info_type : 'searchRoom',
      roomid : that.data.curInput
    }
    mes.sendMessage(JSON.stringify(m));
  },

  findRid : function(roomid){
    for (let i = 0; i < this.data.roomList.length; i++) {
      let room = this.data.roomList[i];
      if (room.roomid == roomid){
        return room;
      }
    }
    return null;
  },

  returnRoom:function(e){
    let page = getCurrentPages();
    let prevPage = page[page.length - 2];
    let room = this.findRid(e.currentTarget.dataset.roomid);
    console.log(e);
    prevPage.setData({
      rid:room.rid,
      roomid:room.roomid
    })
    wx.navigateBack({})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.onSocketMessage(function(res){
      var m = JSON.parse(res.data);
      if (m.info_type == 'searchRoom'){
        if(m.errcode == 0){
          var pushList = [];
          for (var i = 0; i < m.roomList.length; i++) {
            var room_color = color_set.GetColor(i+1);
            var pushItem = {
              "rid": m.roomList[i].rid,
              "roomid": m.roomList[i].roomid,
              "roomcolor": room_color,
            }
            pushList.push(pushItem);
          }
          that.setData({roomList : pushList})
        }
        
        console.log("roomList",that.data.roomList)
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