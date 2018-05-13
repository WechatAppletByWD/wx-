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
      "tavatarUrl": null,
      "reward": "3.2",
      "timeLimit": "20180419",
      "taddress": null
    },
    address: null,
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
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      console.log('input_data', that.data)
      this.setData({
        input_data: {
          "title": e.detail.value.title,
          "content": e.detail.value.content,
          "tend_time": "20180412",
          "tcreate_id": app.globalData.openid,
          "type": "0",
          "tavatarUrl": !that.data.tavatarUrl ? '' : JSON.stringify(that.data.tavatarUrl),
          "reward": "3.2",
          "timeLimit": "20180419",
          "taddress": app.globalData.userInfo.last_address || that.data.address
        }
      })
      
      
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
        app.globalData.address = res.name;
        that.setData({address: res.name});
        console.log(res)
      }
    })
  },
  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({ tavatarUrl: res.tempFilePaths})
        console.log('photos', that.data.tavatarUrl)
      }
    })
  },
  del_photo: function(e){
    //删除
    this.data.tavatarUrl.splice(e.currentTarget.dataset.index, 1);
    this.setData({ tavatarUrl: this.data.tavatarUrl});
  },
  onLoad: function(){
    //定义相机
    this.ctx = wx.createCameraContext()
    this.setData({ address: app.globalData.userInfo_wx.last_address || that.data.address})
    console.log('app', app)
  },
  onUnload: function(){
    wx.reLaunch({
      url: '../../pages/index/index'
    })
  }
})