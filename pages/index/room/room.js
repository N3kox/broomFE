// pages/test_student/test_student.js
var colorSet = require('../../../utils/colorset.js')

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classroomList: [
    ],
    isStudent:true,
  },

  sendsocket:function(msg){
    wx.sendSocketMessage({
      data: msg
    });
    
  },
  /*
    Multi_test:function(){
      var msg = {
        "info_type":"stu_multi",
        "info" : "multi_message",
        "status" : "yes"
      };
      this.sendsocket(JSON.stringify(msg));
      console.log("sent");
    },
  */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      isStudent: app.globalData.isStudent
    })
    var msg = {
      "info_type": "require_classroom_info",
      "isStudent": that.data.isStudent
    };
    console.log(msg);
    if (app.globalData.socket_open) {
      that.sendsocket(JSON.stringify(msg));
    }
    console.log("sent require for classroom info");
    wx.onSocketMessage(function (res) {
      var res_info = JSON.parse(res.data);
      console.log(res_info);
      if (res_info[0].info_type == 'classroom_index') {
        //console.log("roominfo:", res_info);
        //重新渲染
        var res_classroomList = [];
        var color_count = 1;

        for (var i = 1; i < res_info.length; i++) {
          var lockinfo = '否';
          if (res_info[i].locked === 1)
            lockinfo = '是';

          var set_color = colorSet.GetColor(color_count);
          var classroom_push = {
            "number": res_info[i].roomid,
            //座位传值数量尚未获得并修改（后端
            "chair_sum": res_info[i].count,
            "locked": lockinfo,
            //"id": res_info[i].id
            "color": set_color,
          };

          res_classroomList.push(classroom_push);

          color_count++;
          if (res_info[i].locked === 1 && that.data.isStudent)
            color_count--;
        };
        //
        that.setData({
          classroomList: res_classroomList,
        })
        console.log("now:", that.data.classroomList);
      }
    });

  },
  getin_room:function(e){
    let str = JSON.stringify(e.currentTarget.dataset.room);
    console.log(e.currentTarget.dataset.room);
    wx.navigateTo({
      url: '/pages/roomFunction/roomDisplay/roomDisplay?room='+str,
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

    

    /*
    wx.onSocketMessage(function (res) {
      var msg = JSON.parse(res.data);
      console.log("多消息处理测试返回数据:", msg);

    })
    */

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