//app.js
App({
  
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
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
            console.log('openid',res.data.openid)
            that.globalData.openid = res.data.openid;
            console.log(that.globalData)
          },
          fail: function () {

          }
        })
      }
    })
    // 获取用户信息
    let p1 = new Promise((resolve, reject) => {
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

                }
              })
            }
          }
        })
      })
    
    let p2 =  new Promise((resolve, reject) => {
        //用户信息发送后台存储
        resolve();
      })
   
    var that = this;
    /*Promise.all([
      p1,
      p2
    ])
      .then((res) => {
        //用户信息发送后台存储
        var data = res[0];
        console.log('pe', that)
        wx.request({
          url: 'http://address/180404web_bg_war/newUserfasd',
          data: {
            "location_id": that.globalData.openid,
            "username": data.nickName,
            "password": "67676rrhf",
            "sex": data.gender,
            "wechat": "",
            "qq": "",
            "tel": "1889999167",
            "address": "哈理工",
            "ip": "127.121.34.516",
            "device": "iphone",
            "credit": "122",
            "rank": "2",
            "address_id": "wieiwei1erre2018980",
            "create_time": "20180902",
            "avatarUrl": data.avatarUrl
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log('p3_2', res.data)
          }
        })
      }
      );*/




  },
  globalData: {
    userInfo: null,
    openid: null
  }
})