var app = getApp();  
Page({
  data: {
    userInfo: {},
    motto: 'Hello World',
    // orderItems
    orderItems: [
      {
        typeId: 0,
        name: '待付款',
        url: 'bill',
        imageurl: '',
      },
      {
        typeId: 1,
        name: '待发货',
        url: 'bill',
        imageurl: '',
      },
      {
        typeId: 2,
        name: '待收货',
        url: 'bill',
        imageurl: ''
      },
      {
        typeId: 3,
        name: '待评价',
        url: 'bill',
        imageurl: ''
      }
    ],
  },
  //事件处理函数
  toOrder: function () {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  gotoSetting: function () {
    var info = `?username=${this.data.userInfo.nickName}`;
    wx.navigateTo({
      url: '../../pages/setting/setting' + info,
    })
  },
  onLoad: function () {
    this.setData({'userInfo': app.globalData.userInfo});
    console.log(this.data.userInfo)  
  }
})