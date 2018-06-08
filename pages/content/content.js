var app = getApp();
Page({
  data: {
    model: null,
    flag: true,
    imgReady: false         //图片显示控制变量
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
  previewImage:function(){
    var that = this;
    wx.previewImage({
      current: that.data.taskInfo.tavatarUrl[0], // 当前显示图片的http链接
      urls: that.data.taskInfo.tavatarUrl // 需要预览的图片http链接列表
    })
  },
  onLoad: function(option){
    var that = this;
    new Promise((resolve, reject)=>{
      that.setData({ imgReady: false })         //图片路径转json完成修改控制变量，不显示图片
      wx.request({
        url: app.url+'/wx_server/taskByTLocationId', //通过任务ID获取任务
        data: {
          tlocation_id: option.currentTarget
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          that.setData({taskInfo: res.data.object});
          console.log(that.data)
          console.log('task: res.data', res.data)
          var key = `taskInfo.tavatarUrl`;
          var json = JSON.parse(res.data.object.tavatarUrl);
          that.setData({ [key]: json })
          that.setData({ imgReady: true })         //显示图片
          resolve(res.data.object)
        }
      })
    }).then((res)=>{
      return new Promise((resolve, reject)=>{
        wx.request({
          url: app.url+'/wx_server/userByLocationId', 
          data: {
            location_id: res.tcreate_id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            that.setData({userInfo: res.data.object});
            console.log('user: res.data', res.data)
            
            console.log('ok', that.data)
          }
        })
      })
    })
    
  },
  taskIncept: function (event) {
    var that = this;
    wx.request({
      url: app.url+'/wx_server/taskIncept', //仅为示例，并非真实的接口地址
      data: {
        tlocation_id: event.currentTarget.id,
        tincept_id: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('接单回执', res.data)
        if (res.data.code === "200") {
          that.setData({ model: '接单成功' })
        } else {
          that.setData({ model: '接单失败' })
        }
      },
      complete: function () {
        wx.showModal({
          title: '提示',
          content: that.data.model,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定', res.confirm);
              wx.reLaunch({
                url: '../../pages/index/index'
              })
            }
          }
        })
      }
    })
  }
})