var app = getApp();
Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIget: 1,
    // nickName: app.globalData.userInfo.nickName,
    message: [
      'fdsahjfsdahjkf',
      'fdsajhfkdasjfks',
      'fdsjaklfjiouhioth',
      'fadsgfdgfjhyru',
      'reytreytgfhfsggfd',
      'fgdshghgfjfhgf'
    ],
    rotateX: 0,        //滚筒消息旋转角度
    motto: 'Hello World',
    showMenu: 0
    // orderItems
  },
  getUserInfo: function () {
    var that = this;
    console.log('app.data', app.globalData)
    console.log('授权成功')
    wx.getUserInfo({
      success: function (res) {
        that.setData({ canIget: 1 });
        console.log(res.userInfo)
        app.globalData.userInfo = res.userInfo
        console.log(app.globalData)
        new Promise((resolve, reject) => {
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              var that = this;
              wx.request({
                url: app.url + '/wx/api/getUserInfo',
                data: {
                  code: res.code
                },
                success: function (res) {
                  console.log('openid', res.data.openid)
                  app.globalData.openid = res.data.openid;
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
            wx.request({
              url: app.url + '/wx_server/userByLocationId',
              data: {
                location_id: app.globalData.openid
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log('查询用户', res.data)
                if (!res.data.object.username || !res.data.object.location_id) {     //新用户
                  var userInfo = app.globalData.userInfo;
                  console.log('新用户请求注册', app.globalData)
                  //新用户将信息存入数据库
                  wx.request({
                    url: app.url + '/wx_server/newUser', //仅为示例，并非真实的接口地址
                    method: 'POST',
                    data: {
                      "location_id": app.globalData.openid,
                      "username": app.globalData.userInfo.nickName,
                      "password": "xxxxxxxxx",
                      "sex": app.globalData.userInfo.gender,
                      "wechat": "xxxxxxxxx",
                      "qq": "xxxxxxxx",
                      "tel": "",
                      "address": "",
                      "ip": "127.121.34.516xxx",
                      "device": "iphonexxxx",
                      "address_id": "xxxxxxxxxxxxx",
                      "avatarUrl": app.globalData.userInfo.avatarUrl
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                      console.log('注册成功')
                      wx.request({
                        url: app.url + '/wx_server/userByLocationId', 
                        data: {
                          location_id: app.globalData.openid
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
                      app.globalData.userInfo.address = res.data.object.address
                      app.globalData.userInfo.tel = res.data.object.tel
                      app.globalData.userInfo_wx = res.data.object
                      that.getData()
                      resolve(res)
                    }
                  })
                } else {
                  console.log('老用户')
                  that.getData()
                  console.log('data.userInfo => ', that.data.userInfo)
                  app.globalData.userInfo.address = res.data.object.address
                  app.globalData.userInfo.tel = res.data.object.tel
                  app.globalData.userInfo_wx = res.data.object
                  resolve(res);
                }
              }
            })
          })
        }).then(() => {
          return new Promise((resolve, reject)=>{

          
            if (!app.globalData.userInfo.address) {
              wx.chooseLocation({
                success: function (res) {
                  app.globalData.address = res.name;
                  console.log('globalData', app.globalData)
                  var userInfo = app.globalData.userInfo;
                  wx.request({
                    url: app.url + '/wx_server/userUpdate',
                    method: 'POST',
                    data: {
                      "location_id": app.globalData.openid,
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
                      resolve()
                    }
                  })
                }
              })
            }else{
              resolve()
            }
          })
        }).catch((err) => {
          console.error(err)
        })
      }
    })

  },
  //事件处理函数
  toOrder: function () {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  onPullDownRefresh: function () {
    this.getData();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  gotoSetting: function () {
    console.log(app.globalData)
    var info = `?openid=${app.globalData.openid}`;
    wx.navigateTo({
      url: '../../pages/setting/setting' + info,
    })
  },
  gotoAuthor: function () {
    wx.navigateTo({
      url: '../../pages/author/author',
    })
  },
  showMenu: function(){
    this.setData({ showMenu: 1});
    
  },
  closeShow: function(){
    this.setData({ showMenu: 0 });
  },
  gotoOpinion: function(){
    var info = `?openid=${app.globalData.openid}`;
    wx.navigateTo({
      url: '../../pages/opinion/opinion' + info,
    })
  },
  getData: function(){
    var that = this;
    wx.request({
      url: app.url+'/wx_server/userByLocationId', //
      data: {
        location_id: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('globalData.openid', app.globalData.openid)
        console.log('uerInfo', res.data)
        that.setData({userInfo: res.data.object})
        var safe_tel_key = 'userInfo.safe_tel';
        var safe_tel_value = `${that.data.userInfo.tel.substring(0, 3)}****${that.data.userInfo.tel.substring(7, 11)}`
        that.setData({ [safe_tel_key]: safe_tel_value });
        var userName = 'userInfo.nickName';
        that.setData({ [userName]: res.data.object.username });
      }
    })
  },
  
  onLoad: function (option) {

    // this.getUserInfo();
    var that = this;
    console.log('我的页面，global数据', app.globalData)
    
    setInterval(()=>{
      var value = (that.data.rotateX + 60) % 36000;
      that.setData({rotateX: value});
    }, 2000)
    this.getMsg();

    // 查看是否授权
    console.log('gd', app.globalData)
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log('已经授权', res.userInfo)
              that.setData({ canIget: 1 });
              that.getUserInfo();
              
            }
          })
        } else {
          console.log('未授权')
          that.setData({ canIget: 0 });
        }
      }
    })
  },
  getMsg: function () {
    var that = this;
    wx.request({
      url: app.url+'/wx_server/getSystemMessage', //
      data: {
        start: 0,
        length: 6
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({ message: res.data.data});
        console.log('系统消息', res.data)
      }
    })
  }

})