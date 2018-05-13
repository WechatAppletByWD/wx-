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
    duration: 1000,
    flag: true
  },
  show: function () {
    this.setData({ flag: false })
  },
  hide: function () {
    this.setData({ flag: true })
  },
  onLoad: function () {
    var that = this;

    new Promise((resolve, rejected) => {
      wx.request({
        url: 'http://address/180404web_bg_war/taskByStatus',
        data: {
          status: 0
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          var dataList = res.data.data;
          //截取要显示的字符串
          // dataList.forEach((item) => {
          //   if (item.tlocation_id) {
          //     console.log(item.tcreate_time)
          //     item.tcreate_time = item.tcreate_time.substring(5, 16);
          //     item.tcreate_time = item.tcreate_time.replace('-', '/');
          //     if (item.avatarUrl.indexOf("https") === -1) {
          //       item.avatarUrl = "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLSf9eVs6Qp5SkeeibperoiawRdWqGFiblh9oIb8EXRP6vyJexcdlqDCIkM9VkkpiaajKpFDwoUuHqDhQ/0"
          //     }
          //   }

          // })
          
          that.setData({ array: dataList });
          console.log(dataList)
          resolve();
        }
      })
    }).then(() => {
      var arr = that.data.array;

      for (let i = 0; i < arr.length; i++) {
        var key = `array[${i}].tavatarUrl`;
        var json = JSON.parse(arr[i].tavatarUrl);
        that.setData({ [key]: json })
      }
    })
  },
  gotoContent: function (event) {
    console.log(event);
    wx.navigateTo({
      url: '../content/content?currentTarget=' + event.currentTarget.id
    })
  },
  taskIncept: function (event) {
    wx.request({
      url: 'http://address/180404web_bg_war/taskIncept',
      data: {
        tlocation_id: event.currentTarget.id,
        tincept_id: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  }


})