App({
  globalData: {
    socket_open: false,
    adminUserViewId: '',
    token: "token",
    userInfo: null,
    tempRoom: '',
    isStudent: true,
    mod : '../../utils/md5.js',
    uno:'',
    name:'',
    
    //cache_stu_no : '',
    //BaseURL:"http://...",
  },
  onLaunch:function(){
    /* 
    wx.login({
      success:res=>{

      }
    })

    wx.getSetting({
      success:res=>{
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success:res=>{
              this.globalData.userInfo = res.userInfo
              if(this.userInfoReadyCallback){
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    */
    
    var that = this;
    //连接
    wx.connectSocket({
      url: 'wss://',
      //url: 'ws://localhost:83'
    });
    wx.onSocketOpen(function (res ) {
      that.globalData.socket_open = true;

    })
    //重启
    wx.onSocketClose(function (res) {
      that.globalData.socket_open = false;
      wx.connectSocket({
        url: 'wss://',
        //url: 'ws://localhost:83'
      })
      wx.onSocketOpen(function (res) {
        that.globalData.socket_open = true;
      })
    })

  },
  
})
