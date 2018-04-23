var app = getApp();
Page({
  data: {
    focus: false,
    inputValue: '',
    input_data: {
      "title": "取火龙果",
      "content": "美团",
      "tend_time": "20180412",
      "tcreate_id": "9999999999999999999999999",
      "type": "0",
      "tavatarUrl": "http:akskakska",
      "reward": "3.2",
      "timeLimit": "20180419"
    }
  },
  formSubmit: function (e) {
    this.setData({
      input_data: {
        "title": e.detail.value.title,
        "content": e.detail.value.content,
        "tend_time": "20180412",
        "tcreate_id": app.globalData.openid,
        "type": "0",
        "tavatarUrl": "http:akskakska",
        "reward": "3.2",
        "timeLimit": "20180419"
      }
    })
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    console.log('input_data', app.globalData)
    wx.request({
      url: 'http://address/180404web_bg_war/newTask', //仅为示例，并非真实的接口地址
      data: that.data.input_data,
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        
      }
    })
  },
  gotoMap: function (event){
    console.log(event)  
    // wx.navigateTo({
    //   url: '../../pages/map/map'
    // })
    wx.chooseLocation({
      success: function(res){
        console.log('yuan', res)
      }
    })
  },
  onLoad: function(){
  },
  onUnload: function(){
    wx.reLaunch({
      url: '../../pages/index/index'
    })
  }
})