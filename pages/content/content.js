var app = getApp();
Page({
  data: {
    flag: true
  },
  show: function () {
    this.setData({ flag: false })
  },
  hide: function () {
    this.setData({ flag: true })
  },
  call: function(){
    var that = this;
    console.log(that.data.userInfo.tel)
    wx.makePhoneCall({
      phoneNumber: that.data.userInfo.tel //仅为示例，并非真实的电话号码
    })
  },
  onLoad: function(option){
    var that = this;
    new Promise((resolve, reject)=>{
      wx.request({
        url: 'http://address/180404web_bg_war/taskByTLocationId', //通过任务ID获取任务
        data: {
          tlocation_id: option.currentTarget
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          that.setData({taskInfo: res.data.object});
          console.log(that.data)
          resolve(res.data.object)
        }
      })
    }).then((res)=>{
      return new Promise((resolve, reject)=>{
        wx.request({
          url: 'http://address/180404web_bg_war/userByLocationId', //通过任务ID获取任务
          data: {
            location_id: res.tcreate_id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            that.setData({userInfo: res.data.object});
            console.log(that.data)
          }
        })
      })
    })
    
  },
  taskIncept: function (event) {
    wx.request({
      url: 'http://address/180404web_bg_war/taskIncept', //仅为示例，并非真实的接口地址
      data: {
        tlocation_id: event.currentTarget.id,
        tincept_id: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  }
})