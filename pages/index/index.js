var app = getApp();
Page({
  data: {
    array: [],
    imgUrls: [
      'http://5b0988e595225.cdn.sohucs.com/images/20171018/dc4263c3df0e44a5980390ae0449aaf7.jpeg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },
  onLoad: function(){
    var that = this;
    
    // wx.chooseLocation({
    //   success: function (res) {
    //     console.log(res)
    //   }
    // })
    
    wx.request({
      url: 'http://address/180404web_bg_war/getAllTasks', 
      data: {
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({array: res.data.data});
        console.log(res.data.data)
      }
    })
  },
  gotoContent: function(event){
    console.log(event);
    wx.navigateTo({
      url: '../content/content?currentTarget=' + event.currentTarget.id
    })
  }
  
 
})