//app.js
App({
  
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;

    //获取api
    wx.request({
      url: that.url +'/wx_server/getAllApi', 
      data: {
       
      },
      dataType: 'json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var json = res.data.object;
        json = json.replace(/'/g, '"');
        json = JSON.parse(json);
        that.globalData.api = json;
        console.log('获取api =>', json);
      }
    })

    // 登录
    new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            var that = this;
            wx.request({
              url: that.url +'/wx/api/getUserInfo',
              data: {
                code: res.code
              },
              success: function (res) {
                console.log('openid', res.data.openid)
                that.globalData.openid = res.data.openid;
                console.log(res.data)
                resolve()
              },
              fail: function () {

              }
            })
          }
        })
      }).then(() => {
      return new Promise((resolve, reject) => {
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            this.globalData.userInfo = res.userInfo
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
            console.log('请求数据完成', that.globalData.userInfo)
            resolve(res.userInfo);

          }

        })
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        wx.request({
          url: that.url +'/wx_server/userByLocationId',
          data: {
            location_id: that.globalData.openid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            if (res.data.code === "400") {     //新用户
              var userInfo = that.globalData.userInfo;
              console.log('新用户请求注册')
              //新用户将信息存入数据库
              wx.request({
                url: that.url +'/wx_server/newUser', //仅为示例，并非真实的接口地址
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
              console.log('老用户')
              that.globalData.userInfo.address = res.data.object.address
              that.globalData.userInfo.tel = res.data.object.tel
              that.globalData.userInfo_wx = res.data.object
              resolve(res);
            }
          }
        })
      })
    }).then(() => {

      if (!that.globalData.userInfo.address) {
        wx.chooseLocation({
          success: function (res) {
            that.globalData.address = res.name;
            console.log('globalData', that.globalData)
            var userInfo = that.globalData.userInfo;
            wx.request({
              url: that.url+'/wx_server/userUpdate',
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
    userInfo_wx: null,
    demo: null,
    api: null
  },
  url: 'address'  ///////address
})