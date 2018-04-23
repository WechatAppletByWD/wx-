var app = getApp();
Page({
  data: {
  },
  onLoad: function(option){
    var that = this;
    wx.request({
      url: 'http://address/180404web_bg_war/taskByTLocationId', //通过任务ID获取任务
      data: {
        tlocation_id: option.currentTarget
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData(res.data.object);
        console.log(that.data)
      }
    })
  }
})