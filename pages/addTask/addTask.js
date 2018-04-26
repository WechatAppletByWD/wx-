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
      "timeLimit": "20180419",
      "taddress": null
    },
    address: '',
    model: ''
  },
  formSubmit: function (e) {
    var that = this;
    if (!e.detail.value || !e.detail.value.content || !app.globalData.openid){
      wx.showModal({
        title: '',
        content: '请将内容填写完整',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }else{
      this.setData({
        input_data: {
          "title": e.detail.value.title,
          "content": e.detail.value.content,
          "tend_time": "20180412",
          "tcreate_id": app.globalData.openid,
          "type": "0",
          "tavatarUrl": "http:akskakska",
          "reward": "3.2",
          "timeLimit": "20180419",
          "taddress": app.globalData.userInfo.last_address || that.data.address
        }
      })
      
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      console.log('input_data', this.data)
      wx.request({
        url: 'http://address/180404web_bg_war/newTask', 
        data: that.data.input_data,
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          that.setData({ model: '发布成功' })
        },
        fail: function(err){
          that.setData({model: err.toString()})
        },
        complete: function(){
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
  },
  getLocation: function (event){
    var that = this;
    wx.chooseLocation({
      success: function(res){
        app.globalData.address = res.address;
        that.setData({address: res.address});
      }
    })
  },
  onLoad: function(){
    this.setData({address: app.globalData.address})
    console.log(this.data)
  },
  onUnload: function(){
    wx.reLaunch({
      url: '../../pages/index/index'
    })
  }
})