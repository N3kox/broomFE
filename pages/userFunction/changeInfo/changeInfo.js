// pages/changeInfo/changeInfo.js
//未解决：checkpassword颜色设置问题
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //配置数据
    config_name: {
      icon_df: "my",
    },
    config_password: {
      icon_df: "lock"
    },
    config_checkPassword: {
      icon_df: "radiobox",
      icon_right: "roundcheck",
      icon_wrong: "roundclose",
    },
    config_color: {
      df: "gray",
      right: "green",
      wrong: "red",
    },
    //页面数据
    change_name: {
      value: "",
      icon: "my",
      color: "gray",
    },
    change_password: {
      value: "",
      icon: "lock",
      color: "gray",
    },
    check_password: {
      value: "",
      icon: "radiobox",
      color: "gray",
    },
    //检查标记，标记为true时表示各项检测完成，可以向服务器上传修改数据
    isChecked: false,
  },

  /**
   * 新增逻辑函数
   */
  //判定修改密码与确认密码对应
  passwordCorrect: function () {
    //password change items
    var item_1 = "change_password.color";
    //checkPassword change items
    var item_2 = "check_password.icon";
    var item_3 = "check_password.color";

    //初次密码输入为空，修改密码颜色为df
    if (this.data.change_password.value.length == 0) {
      this.setData({
        [item_1]: this.data.config_color.df,
        isChecked: false,
      })
    }
    else {
      //密码不为空
      this.setData({
        [item_1]: this.data.config_color.right,
      })
    }

    //确认密码为空，修改确认图标和颜色为df
    if (this.data.check_password.value.length == 0) {
      this.setData({
        [item_2]: this.data.config_checkPassword.icon_df,
        [item_3]: this.data.config_color.df,
        isChecked: false,
      })
    }
    //两次输入密码不一致，修改确认密码图标和颜色为wrong
    else if (this.data.change_password.value != this.data.check_password.value) {
      this.setData({
        [item_2]: this.data.config_checkPassword.icon_wrong,
        [item_3]: this.data.config_color.wrong,
      })
    }
    //两次密码输入一致，修改确认密码图标为right
    else if (this.data.change_password.value == this.data.check_password.value) {
      this.setData({
        [item_2]: this.data.config_checkPassword.icon_right,
        [item_3]: this.data.config_color.right,
      })
    }
  },

  inputName: function (e) {
    var changeItem_1 = "change_name.value";
    var changeItem_2 = "change_name.color";
    var setColor = this.data.config_color.right;

    if (e.detail.value.length == 0) {
      setColor = this.data.config_color.wrong;
      this.setData({
        isChecked: false,
      })
    }

    this.setData({
      [changeItem_1]: e.detail.value,
      [changeItem_2]: setColor,
    })
  },

  inputPassword: function (e) {
    var that = this;
    //set value
    var item_1 = "change_password.value";
    this.setData({
      [item_1]: e.detail.value,
    })
    //set icon and color
    that.passwordCorrect();
  },

  checkPassword: function (e) {
    var that = this;
    //set value
    var item_1 = "check_password.value";
    this.setData({
      [item_1]: e.detail.value,
    })
    //set icon and color
    that.passwordCorrect();
  },

  /**
   * 服务器传输数据接口
   * 需求数据及参数自定义
   */
  Send: function () {
    //修改的两个数据：修改的用户名，修改的密码
    var chang_name = this.data.chang_name.value;
    var chang_password = this.data.chang_password.value;
  },

  //提交修改
  submitChange: function () {
    //修改用户名不为空，且两次密码一致
    if ((this.data.change_name.value.length != 0) && (this.data.change_password.value.length != 0) && (this.data.change_password.value == this.data.check_password.value) ){
      this.Send();
    }
    else{
      wx.showToast({
        title: '信息提交不正确',
        icon: 'loading',
        duration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.name);
    var item_1 = "change_name.value";
    var item_2 = "change_name.color";

    var precedeName = app.globalData.name;
    if (precedeName.length == 0) {
      var setColor = this.data.config_color.df;
    }
    else {
      var setColor = this.data.config_color.right;
    }

    this.setData({
      [item_1]: precedeName,
      [item_2]: setColor,
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