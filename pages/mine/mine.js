var app = getApp();
Page({
  data: {
    userInfo: {},
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
    var that = this;
    console.log(option.query)
    console.log('我的页面，global数据', app.globalData)
    // this.setData({ 'userInfo': app.globalData.userInfo });
    // var safe_tel_key = 'userInfo.safe_tel';
    // var safe_tel_value = `${this.data.userInfo.tel.substring(0, 3)}****${this.data.userInfo.tel.substring(7, 11)}`
    // this.setData({ [safe_tel_key]: safe_tel_value });
    // var userName = 'userInfo.nickName';
    // this.setData({ [userName]: app.globalData.userInfo_wx.username });
    // console.log(this.data.userInfo)
    this.getData()
    setInterval(()=>{
      var value = (that.data.rotateX + 60) % 36000;
      that.setData({rotateX: value});
    }, 2000)
    this.getMsg();
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