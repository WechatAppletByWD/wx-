//app.js
App({

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    // 登录
    new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          var that = this;
          wx.request({
            url: 'http://address/api/getUserInfo',
            data: {
              code: res.code
            },
            success: function (res) {
              console.log('openid', res.data.openid)
              that.globalData.openid = res.data.openid;
              console.log(that.globalData)
              resolve()
            },
            fail: function () {

            }
          })
        }
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                  resolve(res.userInfo);

                },

              })
            }
          }
        })
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        wx.request({
          url: 'http://address/180404web_bg_war/userByLocationId',
          data: {
            location_id: that.globalData.openid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            if (res.data.code === "400") {     //新用户
              var userInfo = that.globalData.userInfo;
              //新用户将信息存入数据库
              wx.request({
                url: 'http://address/180404web_bg_war/newUser', //仅为示例，并非真实的接口地址
                method: 'POST',
                data: {
                  "location_id": that.globalData.openid,
                  "username": userInfo.nickName,
                  "password": "xxxxxxxxx",
                  "sex": userInfo.gender,
                  "wechat": "xxxxxxxxx",
                  "qq": "xxxxxxxx",
                  "tel": "",
                  "address": "",
                  "ip": "127.121.34.516xxx",
                  "device": "iphonexxxx",
                  "address_id": "xxxxxxxxxxxxx",
                  "avatarUrl": userInfo.avatarUrl
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  resolve(res)
                }
              })
            } else {
              that.globalData.address = res.data.object.address
              resolve(res);
            }
          }
        })
      })
    }).then(() => {
      if (!that.globalData.address) {
        wx.chooseLocation({
          success: function (res) {
            that.globalData.address = res.address;
            var userInfo = that.globalData.userInfo;
            wx.request({
              url: 'http://address/180404web_bg_war/userUpdate', //仅为示例，并非真实的接口地址
              method: 'POST',
              data: {
                "location_id": that.globalData.openid,
                "username": userInfo.nickName,
                "password": "xxxxxxxxx",
                "sex": userInfo.gender,
                "wechat": "xxxxxxxxx",
                "qq": "xxxxxxxx",
                "tel": "",
                "address": res.address,
                "ip": "127.121.34.516xxx",
                "device": "iphonexxxx",
                "address_id": "xxxxxxxxxxxxx",
                "avatarUrl": userInfo.avatarUrl
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
              }
            })
          }
        })
      }
    }).catch((err) => {
      console.error(err)
    })
  },
  globalData: {
    userInfo: null,
    openid: null,
    address: null
  }
})