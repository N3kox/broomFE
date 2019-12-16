var app = getApp()
Page({
  data:{
    isStudent: true,
    room:'default info',
    //uid:'default info',
    stu_no:'default info',
    userInfo:{},
    hasUserInfo:false
  },
  onLoad:function(options){

    //this.init_function();
    /*
    if(app.globalData.userInfo){
      this.setData({
        userInfo:app.globalData.userInfo,
        hasUserInfo:true
      })
    }
    */
    /*
    wx.setTabBarItem({
      index: 1,
      text : 'text',
      iconPath : "images/my.png",
      selectedIconPath : "images/my_hl.png"
    })
    */
    
    var that = this;
    this.setData({
      isStudent: app.globalData.isStudent,
      stu_no: wx.getStorageSync('cache_stu_no'),
      room: wx.getStorageSync('cache_room'),
    });
    /*
    var msg = {
      info_type : 'which_room',
      stu_no : wx.getStorageSync('cache_stu_no'),
    };

    wx.sendSocketMessage({
      data : JSON.stringify(msg)
    });
    */

    wx.onSocketMessage(function(res){
      var msg = JSON.parse(res.data);
      console.log(msg);
      if(msg != null){
        /*
        if (msg.info_type === 'found_room'){
          that.setData({
            room : msg.room,
        });
        
        //that.onLoad(options);
        //console.log("ceshi:::::",that.data.room);
        }
        */
      }
    });
    /*
    wx.showTabBar({
      success:function(res){
        console.log('tabbar show complete');
      },
      fail:function(res){
        console.log(res);
      }
    })
    */
  },


  tapname(event){
    console.log(event)
  },
  enter_page_teacher:function(){
    wx.switchTab({
      url: '../test_teacher/test_teacher',
    })
  },
  enter_page_student:function(){
    wx.switchTab({
      url: '../test_student/test_student',
    })
  },
  //onenet-api获取信息
  Get_data:function(){
    console.log("clicked")
    wx.request({
      url: 'http://api.heclouds.com/devices/516161938',
      header:{
        //'content-type':'application/json',
        'api-key':'DvZnCSwZGNs4extXHZsaXbWoU2E='
      },
      data:{
      },
      success:function(res){
        if(res.data.online)
        {
          console.log('device online')
          console.log(res.data)
        }
        else 
        {
          console.log("device offline")
        }
      },
      fail(res)
      {
        console.log('error connect')
      },
      /*
      complete(res){
        console.log(res.data),
        console.log("data_title:"+res.data.data.title)
      }
      */
    })
  },

  onShow: function () {
    this.setData({
      isStudent: app.globalData.isStudent,
      stu_no: wx.getStorageSync('cache_stu_no'),
      room: wx.getStorageSync('cache_room'),
    });
  },
  operateSeat:function(){
    //座位舵机控制方法
    
  },

  enterChosenRoom:function(){
    try{
      if(this.data.room != '无'){
        wx.navigateTo({
          url: '/pages/roomFunction/roomDisplay/roomDisplay?room=' + this.data.room,
        })
      }
      else{
        wx.showToast({
          title: '尚未选择房间座位',
          icon: 'loading',
          duration: 2000
        })
      }
      
    }catch(e){
      console.log("未能进入房间");
    }
  },
  myClass:function(){
    wx.navigateTo({
      url: '/pages/classFunction/myClass/myClass',
    })
  },

  newClass:function(){
    wx.navigateTo({
      url: '/pages/classFunction/newClass/newClass',
    })
  },
  myClassS:function(){
    wx.navigateTo({
      url: '/pages/classFunction/myClassS/myClassS',
    })
  },
  joinClass:function(){
    wx.navigateTo({
      url: '/pages/classFunction/joinClass/joinClass',
    })
  }
})    