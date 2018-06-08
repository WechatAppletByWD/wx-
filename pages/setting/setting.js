// pages/setting/setting.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    model: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    wx.request({
      url: app.url+'/wx_server/userByLocationId', //仅为示例，并非真实的接口地址
      data: {
        location_id: options.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          userInfo: res.data.object
        })
      }
    })

  },
  getLocation: function (event) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        var userInfo_address = 'userInfo.address'
        that.setData({
          [userInfo_address]: res.name
        })
      }
    })
  },
  formSubmit: function (e) {
    var that = this;
    var input = e.detail.value;
    var userInfo = this.data.userInfo;
    console.log('subject', userInfo)
    this.setData({
      input_data: {
        "location_id": userInfo.location_id,
        "username": input.username,
        "password": "6rrhf",
        "sex": "1",
        "wechat": "sd66o",
        "qq": "d221212124w",
        "tel": input.tel,
        "address": input.address,
        "ip": "127.121.34.516",
        "device": "iphone",
        "credit": "122",
        "rank": "2",
        "address_id": "wieiwei1980",
        "avatarUrl": userInfo.avatarUrl
      }
    })

    console.log('input_data', this.data.input_data)
    wx.request({
      url: app.url+'/wx_server/userUpdate',
      data: that.data.input_data,
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        that.setData({ model: '修改成功！' })
      },
      fail: function (err) {
        that.setData({ model: err.toString() })
      },
      complete: function () {
        wx.showModal({
          title: '提示',
          content: that.data.model,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定', res.confirm);
              var params = `?username={$that.data.userInfo.username}&tel={$that.data.userInfo.tel}&address={$that.data.userInfo.address}`
              wx.reLaunch({
                url: '../mine/mine'
              })
            }
          }
        })
      }
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
 
    wx.reLaunch({
      url: '../../pages/mine/mine'
    })
  
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