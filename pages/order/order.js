var app = getApp();
Page({
  data: {
    array: [],
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0, 
    model: ''
  },
  onPullDownRefresh: function () {
    this.getData();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  onLoad: function () {
    var that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });  
    this.getData();
  },
  getData: function(){
    var that = this;
    wx.request({
      url: app.url+'/wx_server/taskByLocationId',
      data: {
        location_id: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({ array: res.data.data });
        console.log('order', res.data.data)

        //随机首字背景颜色
        for (var i = 0; i < that.data.array.length; i++) {
          var headBgColor = `array[${i}].headBgColor`;
          var random_color = [];
          for (var j = 0; j < 3; j++) {
            random_color.push(that.random(255))
          }
          var headBgColorValue = `rgb(${random_color[0]}, ${random_color[1]}, ${random_color[2]})`;
          var headColor = `array[${i}].headColor`;
          var headColorValue = `rgb(${255 - random_color[0]}, ${255 - random_color[1]}, ${255 - random_color[2]})`;
          that.setData({ [headColor]: headColorValue })
          that.setData({ [headBgColor]: headBgColorValue })
          console.log('随机颜色循环')
        }
        console.log(that.data)
      }
    })
  },
  random: function(max){
    return Math.floor(Math.random()*max);
  },
  gotoContent: function (event) {
    console.log(event);
    wx.navigateTo({
      url: '../content/content?currentTarget=' + event.currentTarget.id + '&isOrder=1'
    })
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });
    console.log(e.detail.current)
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    
    var that = this;
    console.log('ok', e)
    if (this.data.currentTab === e.target.dataset.current) {
      
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //取消接单
  taskInceptCancel: function(e){
    var that = this;
    console.log('取消接单', e)
    wx.request({
      url: app.url+'/wx_server/taskInceptCancel', //仅为示例，并非真实的接口地址
      data: {
        location_id: e.currentTarget.dataset.location_id,
        tlocation_id: e.currentTarget.dataset.tlocation_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('取消接单完成', res.data)
        wx.showModal({
          title: '已取消接单',
          content: that.data.model,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定', res.confirm);
              that.getData();
              wx.reLaunch({
                url: '../../pages/order/order'
              })
            }
          }
        })
      }
    })
  },
  //撤回
  taskCancel: function (e) {
    var that = this;
    console.log('撤回订单', e)
    wx.request({
      url: app.url+'/wx_server/taskCancel', //仅为示例，并非真实的接口地址
      data: {
        location_id: e.currentTarget.dataset.location_id,
        tlocation_id: e.currentTarget.dataset.tlocation_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('撤回任务完成', res.data)
        wx.showModal({
          title: '已撤回任务',
          content: that.data.model,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定', res.confirm);
              that.getData();
              wx.redirectTo({
                url: '../../pages/order/order'
              })
            }
          }
        })
      }
    })
  },
  //完成
  taskAchieve: function (e) {
    var that = this;
    console.log('完成接单', e)
    wx.request({
      url: app.url+'/wx_server/taskAchieve', //仅为示例，并非真实的接口地址
      data: {
        location_id: e.currentTarget.dataset.location_id,
        tlocation_id: e.currentTarget.dataset.tlocation_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('任务完成', res.data)
        wx.showModal({
          title: '任务完成',
          content: that.data.model,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定', res.confirm);
              that.getData();
              wx.reLaunch({
                url: '../../pages/order/order'
              })
            }
          }
        })
      }
    })
  }


})