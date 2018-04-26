var app = getApp();
Page({
  data: {
    array: [],
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'http://address/180404web_bg_war/getTaskByLocationId',
      data: {
        location_id: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({ array: res.data.data });
        console.log('order', res.data.data)
      }
    })
  },
  gotoContent: function (event) {
    console.log(event)
  }


})