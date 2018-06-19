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
    latitude: null,
    longitude: null,
    address: '选择任务地点',
    model: '',
    lock: false,
    tavatarUrl: []
  },
  formSubmit: function (e) {
    var that = this;
    if (!that.data.title || !that.data.longitude || !e.detail.value || !e.detail.value.content || !app.globalData.openid) {

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
    } else {
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
          "taddress": that.data.address || app.globalData.userInfo.last_address,
          "longitude": that.data.longitude,
          "latitude": that.data.latitude
        }
      })
      
      wx.request({
        url: app.url+'/wx_server/newTask',
        data: that.data.input_data,
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          that.setData({ model: '发布成功' })
        },
        fail: function (err) {
          that.setData({ model: err.toString() })
        },
        complete: function () {
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
  getLocation: function (event) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        app.globalData.address = res.name;
        that.setData({ address: res.name });
        that.setData({ latitude: res.latitude })
        that.setData({ longitude: res.longitude })
        console.log('手动选择地址', res)
      }
    })
  },
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        //that.setData({ tavatarUrl: res.tempFilePaths })
        console.log('photos', tempFilePaths)
        
        
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.showLoading({
            title: '上传图片中',
          })
          var createRandomId = that.createRandomId();
          console.log('选中图片', tempFilePaths[i], i)
          wx.uploadFile({
            url: 'https://www.yellowfox.cn/wx_server/fileUpload', 
            filePath: tempFilePaths[i],
            name: 'file',
            header: {"Content-Type": "multipart/form-data"},
            success: function (res) {
              console.log('成功', res)
              
              var data = JSON.parse(res.data)
              
              //do something
              that.data.tavatarUrl.push(data.object.url)
              that.setData({ tavatarUrl: that.data.tavatarUrl})
              console.log('图片上传成功')

              
              console.log('loading结束')
              wx.hideLoading();
              
            },
            fail: function(err){  
              console.log('失败', err)

            }

          })
        }
      }
    })
  },
  del_photo: function (e) {
    //删除
    this.data.tavatarUrl.splice(e.currentTarget.dataset.index, 1);
    this.setData({ tavatarUrl: this.data.tavatarUrl });
  },
  onLoad: function () {
    var that = this;
    //定义相机
    this.ctx = wx.createCameraContext()

    console.log('app', app, 'data', this.data)

  },
  onUnload: function () {
    wx.reLaunch({
      url: '../../pages/index/index'
    })
  },
  createRandomId: function () {
    
    return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
  }
})