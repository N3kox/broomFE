// pages/room_display/room_display.js
var app = getApp();
var mes = require('../../../utils/mes.js')
var pageUtils = require('../../../utils/pageUtils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //速度变化快慢比例
    move_ratio: 5,
    //两个坐标轴的速度变化
    //在5比例下的变化范围[-10,10]
    spead_x: 0,
    spead_y: 0,
    //无关参数
    button_move_x : 50,
    button_move_y : 50,
    button1_bg: "white",
    button2_bg: "white",
    connected : false,
    saveString : '',
  },

  //左键单击
  BindLeft: function () {
    console.log("点击了左键（单击）");
    mes.sendMessage(JSON.stringify({
      info_type : 'mouseClick',
      button : 'left',
      double : false //双击关闭
    }))
  },

  //右键单击
  BindRight: function () {
    console.log("点击了右键（单击）");
    mes.sendMessage(JSON.stringify({
      info_type : 'mouseClick',
      button : 'right',
      double : false
    }))
  },
  
  //发送
  typeStringSend: function () {
    console.log(`点击了发送 : ${this.data.saveString}`);
    let that = this;
    mes.sendMessage(JSON.stringify({
      info_type : 'typeString',
      content : that.data.saveString
    }))
    this.setData({
      saveString : ''
    })

  },
  //输入框输入
  typeString: function (e) {
    this.setData({
      saveString: e.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    let that = this;
    mes.sendMessage(JSON.stringify({
      info_type : 'startComputerControl'
    }))

    wx.onSocketMessage(function(res){
      let mes = JSON.parse(res.data);
      console.log(mes);
      switch(mes.info_type){
        case 'startComputerControl':{
          if(res.errcode){
            wx.showToast({
              title: '电脑端未启动',
              icon:'loading',
              duration:1500
            })
            setTimeout(()=>{
              wx.navigateBack({  
              })
            },1500)
          }
          break;
        }
        case 'checkReady':{
          that.data.connected = true;
          wx.showToast({
            title: '已连接',
            duration:1000
          })
          break;
        }
        case 'closePair':{
          let page = pageUtils.getPageName();
          if(page == 'image'){
            wx.showToast({
              title: '电脑断联',
              icon: 'loading',
              duration: 1500
            })
            setTimeout(() => {
              wx.navigateBack({
              })
            }, 1500);
          }
          break;
        }
      }
    })
    wx.showToast({
      title: '等待连接',
      icon: 'loading',
      duration: 10000,
    })
    setTimeout(()=>{
      if(that.data.connected == false && pageUtils.getPageName() == 'image'){
        wx.navigateBack({
        })
      }
    },10000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var context = wx.createCanvasContext("canvas_move", this)
    context.drawImage("../../../images/button_move.png",this.data.button_move_x,this.data.button_move_y,100,100)
    context.draw()
  },

  //点击画布的函数
  touchStartCanvas: function (e) {
    //console.log(e,e.changedTouches[0].x, e.changedTouches[0].y);
    var context = wx.createCanvasContext("canvas_move", this);
    context.drawImage("../../../images/button_move_touch.png", 50, 50, 100, 100);
    context.draw();
  },

  touchMoveCanvas: function (e) {
    //console.log(e);
    var that = this;
    var now_x = e.changedTouches[0].x - 50;
    var now_y = e.changedTouches[0].y - 50;

    if( now_x < 0 )
      now_x = 0
    if( now_x > 100 )
      now_x = 100
    if( now_y < 0 )
      now_y = 0
    if( now_y > 100 )
      now_y = 100

    // move_x, move_y为左上角的位置
    // 按钮图标宽高100
    // 所以中心位置为：x+50,y+50
    this.setData({
      button_move_x: now_x,
      button_move_y: now_y,
    })

    this.setData({
      spead_x: (this.data.button_move_x - 50) / this.data.move_ratio,
      spead_y: (this.data.button_move_y - 50) / this.data.move_ratio,
    })

    console.log("s_x:",this.data.spead_x,"s_y:",this.data.spead_y);
    mes.sendMessage(JSON.stringify({
      info_type : 'padMove',
      speedX : that.data.spead_x,
      speedY : that.data.spead_y,
    }))
    var context = wx.createCanvasContext("canvas_move", this);
    context.drawImage("../../../images/button_move_touch.png", this.data.button_move_x, this.data.button_move_y, 100, 100);
    context.draw();
  },

  touchEndCanvas: function () {
    var context = wx.createCanvasContext("canvas_move", this);
    context.drawImage("../../../images/button_move.png", 50, 50, 100, 100);
    context.draw();
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
    console.log("隐藏")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("卸载")
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

  },

})