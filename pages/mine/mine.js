var app = getApp();  
Page({
  data: {
    userInfo: {},
    motto: 'Hello World',
    // orderItems
  },
  //事件处理函数
  toOrder: function () {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  gotoSetting: function () {
    console.log(app.globalData)
    var info = `?openid=${app.globalData.openid}`;
    wx.navigateTo({
      url: '../../pages/setting/setting' + info,
    })
  },
  onLoad: function () {
    this.setData({'userInfo': app.globalData.userInfo});
    var safe_tel_key = 'userInfo.safe_tel';
    var safe_tel_value = `${this.data.userInfo.tel.substring(0, 3)}****${this.data.userInfo.tel.substring(7, 10)}`
    this.setData({ [safe_tel_key]: safe_tel_value});

    console.log(this.data.userInfo)  
  }
})