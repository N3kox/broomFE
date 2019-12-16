// pages/classDetail/classDetail.js
var app = getApp();
var mes = require('../../../utils/mes.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid: '',
    name: '',
    code: '',
    isStudent: true,
    isShow_teacher: false,
    isShow_student: false,
    //签到过程后端处理，签到结果前端显示，不占用算力
    seatReg: [],
    tapReg: [],
    stu_no: '',
  },

  deleteClass: function (options) {
    var that = this;
    if (that.data.cid != '') {
      wx.showModal({
        title: '删除课程',
        content: '确定删除',
        success: function (res) {
          if (res.cancel) {
          } else {
            var m = {
              info_type: 'deleteClass',
              cid: that.data.cid,
              code: that.data.code
            }
            mes.sendMessage(JSON.stringify(m))
            wx.showToast({
              title: '处理中',
              icon: 'loading'
            })
          }
        }
      })
    }
  },

  quitClass: function () {
    let that = this;
    //console.log('code:',this.data.code);
    wx.showModal({
      title: '确认',
      content: '确认退出班级？',
      success: function (res) {
        if (res.cancel) {
        } else {
          let m = {
            info_type: 'quitClass',
            cid: that.data.cid,
            stu_no: app.globalData.uno,
          }
          mes.sendMessage(JSON.stringify(m))
          wx.showToast({
            title: '处理中',
            icon: 'loading',
          })
        }
      }
    })
  },

  changeReg: function (status) {
    var m = {
      info_type: 'regTeacher',
      cid: this.data.cid,
      reg: status
    }
    mes.sendMessage(JSON.stringify(m))
  },

  regTeacher: function () {
    this.setData({
      isShow_teacher: !this.data.isShow_teacher
    })
    this.changeReg(1);
  },

  //新增逻辑函数，改变学生签到的显示状态
  showRegStudetn: function () {
    this.setData({
      isShow_student: !this.data.isShow_student
    })
  },

  regStudent: function () {
    var m = {
      info_type: 'regStudent',
      cid: this.data.cid,
      reg: 1,
      stu_no: this.data.stu_no,
    }
    mes.sendMessage(JSON.stringify(m));
    wx.showToast({
      title: '签到中',
      icon: 'loading',
      duration: 2000
    })
  },

  PopConfirm: function () {
    this.setData({
      isShow_teacher: !this.data.isShow_teacher
    })
    wx.navigateTo({
      url: '../regResult/regResult?cid=' + JSON.stringify(this.data.cid),
    })
  },

  Popup: function () {
    this.setData({
      isShow_teacher: !this.data.isShow_teacher
    })
    this.changeReg(0);
  },

  onLoad: function (options) {
    var that = this;
    //var a = JSON.parse(options.cid);
    //var b = JSON.parse(options.code);
    //var c = JSON.parse(options.name);
    that.setData({
      cid: JSON.parse(options.cid),
      code: JSON.parse(options.code),
      name : JSON.parse(options.name),
      isStudent: app.globalData.isStudent,
      stu_no: app.globalData.uno
    })
    wx.onSocketMessage(function (res) {
      var mes = JSON.parse(res.data)
      if (mes.info_type == 'deleteClass') {
        if (mes.errcode == 0) {
          wx.showToast({
            title: '删除课程成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack({
            })
          }, 2000)
        } else {
          wx.showToast({
            title: '删除课程失败，请重试',
            icon: 'loading',
            duration: 2000
          })
        }
      }
      else if (mes.info_type == 'regStudent') {
        if (mes.errcode == 0) {
          wx.showToast({
            title: '签到成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack({

            })
          }, 2000)
        }
        else if (mes.errcode == 2) {
          wx.showToast({
            title: '班级签到未开启',
            icon: 'loading',
            duration: 2000
          })
        }
        else {
          wx.showToast({
            title: '签到失败，请重试',
            icon: 'loading',
            duration: 2000
          })
        }
      }
      else if (mes.info_type == 'quitClass') {
        if (mes.errcode == 0) {
          wx.showToast({
            title: '退出班级成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/index/main/main',
            })
          }, 2000)
        } else {
          wx.showToast({
            title: '退出班级失败,请重试',
            icon: 'loading',
            duration: 2000
          })
        }
      }
      else if (mes.info_type == 'regTeacher') {
        console.log('签到状态反转');
      }
    })
  },

  computerControl : function(){
    console.log("startComputerControlDemo");
    wx.navigateTo({
      url: '../image/image',
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