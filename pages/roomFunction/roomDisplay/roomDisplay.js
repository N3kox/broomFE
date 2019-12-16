// pages/room_display/room_display.js
var app = getApp();
var mes = require('../../../utils/mes.js');

Page({

  /**
   * 页面的初始数据
   */
  

  data: {
    clo: 15,
    room:'',
    room_detail:[],
    room_array:[],
    humidity:'',
    temperature:'',
    timer:'',
    isStudent:true,
    //stu_no = '277'
    currentX:-1,
    currentY:-1,
  },
  
  //消息发送封装
  sendmessage:function(msg){
    wx.sendSocketMessage({
      data: msg,
    })
  },

  //消息发送定时器
  msgTimer: function (msg) {
    var that = this
    this.data.timer = setTimeout(function () {
      that.sendmessage(JSON.stringify(msg));
      that.msgTimer(msg);
      console.log("5 sec passed")
    }, 5000)
  },

  //定时器销毁
  msgTimerDestory:function(){
    var that = this;
    clearTimeout(this.data.timer)
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    var ret_array =[];
    var usrNo = wx.getStorageSync('cache_stu_no');
    var roomid =  JSON.parse(options.room);
    that.setData({
      room : roomid,
      isStudent : app.globalData.isStudent,
      //timer : null,
    })
    var msg= {
      info_type: "room_id",
      room_id: that.data.room,
      stu_no: wx.getStorageSync('cache_stu_no')
    }
    //初次获取信息
    that.sendmessage(JSON.stringify(msg));
    
    //递归定时刷新信息
    that.msgTimer(msg);
    wx.onSocketMessage(function(res){
      var mes = JSON.parse(res.data);
      console.log(mes);
      if(mes[0].info_type === 'this_classroom_info')
      { 
        //case1：数据库插入正确，无需new Array设定长度，可以创建不被浪费的二维数组
        //       但是此方法无法在数据库新插入项到末尾后正确显示      
        //console.log("right!");
        
        //var mes_push = [];
        var mes_info = mes[1];
        var row_count = 1;//记录行数
        var _array = [];//记录记录行内信息
        var _push = [];

        /*
        for(var i=0;i<mes_info.length;i++){
          var infopush = {
            "id":mes_info[i].id,
            "room_row":mes_info[i].room_row,
            "room_column":mes_info[i].room_column,
            "status":mes_info[i].status,
          }
          mes_push.push(infopush);
          if(mes_info[i].room_row == row_count){
            //console.log("匹配:",mes_info[i].status);
            _array.push(mes_info[i].status);
          }
          else{
            _push.push(_array);
            //console.log("array:",_array);
            row_count++;
            _array = [];
            _array.push(mes_info[i].status);
          }       
        }
        _push.push(_array);     
        that.setData({
          room_detail : mes_push,
          room_array : _push
        })
        //console.log("_push:", _push);
        console.log("room_detail:",that.data.room_detail);
        console.log("room_array:",that.data.room_array);
        */

        //case2:new Array(30),二维数组，按照row和column定位插入
        //      数据库行列无需顺序，但是位置量固定，30x30
        var array_30x15 = new Array(30);
        for(var i=0;i<array_30x15.length;i++)
          array_30x15[i] = new Array(15);
        for (var i = 0; i < mes_info.length; i++) {
          /*
          var seatinfo = {
            "id": mes_info[i].id,
            "seat_row": mes_info[i].seat_row,
            "seat_column": mes_info[i].seat_column,
            "status": mes_info[i].status,
            "stu_no": wx.getStorageSync('cache_stu_no'),
          }
          */
          //压缩数据进入数组
          array_30x15[mes_info[i].seat_row][mes_info[i].seat_column] = mes_info[i].status;
          if(mes_info[i].status == 2){
            that.setData({
              currentX : mes_info[i].seat_row,
              currentY : mes_info[i].seat_column
            })
          }
        }
        //处理温度湿度数据
        var hum = '暂无数据',tem = '暂无数据';
        if (mes[0].humidity != null)
          hum = mes[0].humidity + '%'
        if (mes[0].temperature != null)
          tem = mes[0].temperature + '℃'
        
        that.setData({
          //room_detail: mes_push,
          room_array: array_30x15,
          humidity: hum,
          temperature: tem,
        })
        //console.log("_array:", that.data.room_array);

      }
      
      else if (mes[0].info_type === 'take_seat_done') {
        if (mes[0].errcode == 0){
          console.log("刷新啦");
          //刷新缓存中存储的room
          wx.setStorageSync('cache_room', that.data.room);
          that.msgTimerDestory();
          that.onLoad(options);
        }
        else {
          that.setData({
            currentX : -1,
            currentY : -1,
          });
    
          if(mes[0].errmsg == 'updateError'){
            console.log("take_seat_done error!");
            console.log("遇到了未知问题，需要重试（这种的弹窗做一个比较好，暂定toast）");
          }
          else if (mes[0].errmsg == 'seatToken'){
            console.log("冲突占座")
            wx.showToast({
              title: '被别人抢走了哦',
              icon:'loading',
              duration:1000,
            })
          } else if (mes[0].info_type == 'resetSeatError'){
            console.log("座位重置错误")
            wx.showToast({
              title: '请重试',
              icon:'loading',
              duration:1000,
            })
          }
          
        }
      }
      else if (mes[0].info_type === 'remove_seat')
      {
        if (mes[0].errcode == 0){
          //移除全局房间存储信息并刷新页面
          wx.setStorageSync('cache_room', '无');
          that.setData({
            currentX : -1,
            currentY : -1,
          })
          that.msgTimerDestory();
          that.onLoad(options);
          
        }
      }
      else if (mes[0].info_type === 'init_error'){
        //初始化错误
      }
      
      //var ra = new Array();
      
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
    console.log("隐藏")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("卸载")
    var that = this;
    //console.log(that.data.timer);
    that.msgTimerDestory();
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

  operateSeat: function () {
    //座位舵机控制方法

  },
  lockRoom:function(){
    let that = this;
    var msg = {
      info_type: "lockRoom",
      roomid: that.data.room,
      tea_no: wx.getStorageSync('cache_stu_no')
    }
    if (app.globalData.socket_open == true){
      wx.sendSocketMessage({ data: JSON.stringify(msg) });
      wx.showToast({
        title: '让请求飞一会',
        icon: 'loading',
        duration: 1500,
      })
    }
  },
  unlockRoom:function(){
    let that = this;
    var msg = {
      info_type: "unlockRoom",
      roomid: that.data.room,
      tea_no: wx.getStorageSync('cache_stu_no')
    }
    if (app.globalData.socket_open == true){
      wx.sendSocketMessage({ data: JSON.stringify(msg) });
      wx.showToast({
        title: '让请求飞一会',
        icon: 'loading',
        duration: 1500,
      })
    }
  },

  click_seat:function(e){
    var that = this;
    var id = e.target.id;
    //var clo = this.data.clo;
    //console.log(clo);
    var y = (id)%this.data.clo;
    var x = (id-y)/this.data.clo;
    //console.log(id);
    //console.log("x:", x);
    //console.log("y:", y);
    var seat_status = this.data.room_array[x][y];
    switch(seat_status){
      case 2: {
        wx.showModal({
          title: '这座位你承包了',
          content: '点击确定就不要它了',
          success: function (res) {
            //当前写入removeSeat测试函数
            //之后嵌入自定义选择toast
            //this.removeSeat(x,y);
            if (res.cancel) {
            } else {
              //舵机interface
              console.log("舵机此时可以放下");
              that.removeSeat(x, y);
              that.setData({
                currentX : -1,
                currentY : -1
              })
            }
          }
        })
        break;
      }
      case 1:{
        wx.showModal({
          title: '座位被别人占了哦',
          content: '你必不可能坐在这里',
          success:function(res){
            console.log("已点击确定");
          }
        })
        break;
      }
      case 0:{
        //if判断全局信息
        if(wx.getStorageInfoSync('cache_room') != '无'){
          wx.showModal({
            title: '你可以坐在这里',
            content: '点确定就占座了',
            success: function (res) {
              if (res.cancel) {
              } else {
                console.log("这回真点了确认");
                //console.log("room:",that.data.room);
                var msg = {
                  info_type: "take_seat",
                  row: x,
                  column: y,
                  roomid: that.data.room,
                  stu_no: wx.getStorageSync('cache_stu_no')
                }
                //发送座位信息，占座
                if (app.globalData.socket_open == true)
                  wx.sendSocketMessage({ data: JSON.stringify(msg) });
                that.setData({
                  currentX : x,
                  currentY : y,
                })
              }
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }else{
          wx.showToast({
            title: '请先撤去已占座位',
            icon:'loading',
            duration:2000
          })
        }
        break;
      }
      case -1:{
        wx.showModal({
          title: '你不能坐在这里',
          content: '因为这个座位坏了',
          success:function(res){
            console.log("已点击确定")
          }
        })
        break;
      }
      default:
        break;

    }
    
  },

  removeSeat:function(x, y){
    var msg = {
      info_type: "remove_seat",
      row: x,
      column: y,
      roomid: this.data.room,
      stu_no: wx.getStorageSync('cache_stu_no')
    }
    if (app.globalData.socket_open == true)
      wx.sendSocketMessage({data:JSON.stringify(msg)});
  },

  seatFunction:function(){
    let x = this.data.currentX;
    let y = this.data.currentY;
    var msg = {
      info_type : "seatFunction",
      row : x,
      column : y,
      stu_no: wx.getStorageSync('cache_stu_no')
    }
    console.log(msg);
    mes.sendMessage(JSON.stringify(msg));
    
    wx.showToast({
      title: '让请求飞一会',
      icon: 'loading',
      duration: 1500,
    })
  },

})