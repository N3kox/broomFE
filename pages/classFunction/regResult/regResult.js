// pages/classFunction/regResult/regResult.js
var app = getApp();
var mes = require('../../../utils/mes.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid:'',
    class_name: '',
    class_student_count:0,
    green_num: 0,
    green_show: false,
    //学号，姓名
    green_list: [],
    red_num: 0,
    red_show: true,
    //学号，姓名，失败状态
    red_list: []
  },

  /**
   * 界面显示逻辑函数
   */
  show_Red: function () {
    this.setData({
      red_show: true,
      green_show: false,
    })
  },
  show_Green: function () {
    this.setData({
      green_show: true,
      red_show: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      cid : JSON.parse(options.cid),
    })
    let m = {
      info_type : 'regResult',
      cid : this.data.cid,
    }
    mes.sendMessage(JSON.stringify(m))
    wx.onSocketMessage(function(res){
      var mes = JSON.parse(res.data)
      console.log(mes);
      if(mes.info_type == 'regResult'){
        if(mes.errcode == 1){
          wx.showToast({
            title: '签到列表获取失败,请稍后重试',
            icon:'loading',
            duration:2000
          })
          setTimeout(function(){
            wx.navigateBack({
            })
          },2000);
        }else{
          let result = mes.result;
          let tempGreenList = [], tempRedList = [];
          for (let i = 0; i < result.length; i++) {
            //添加到greenList中
            if (result[i].status == 1) {
              tempGreenList.push({
                stu_no: result[i].stu_no,
                name: result[i].name,
                status: 'Green'
              })
            }
            //添加到redList中
            else {
              tempRedList.push({
                stu_no: result[i].stu_no,
                name: result[i].name,
                status: 'Red'//需要修改至未签到原因  
              })
            }
          }
          that.setData({
            green_list: tempGreenList,
            red_list: tempRedList,
            green_num: tempGreenList.length,
            red_num: tempRedList.length,
            class_student_count: result.length,
            class_name : mes.name
          })
          console.log(that.data.green_list);
          console.log(that.data.red_list);
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