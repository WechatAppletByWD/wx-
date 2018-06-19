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
    flag: true,
    model: null,
    getMsg: '加载中...',
    backgroundPosition: 0,
    imgReady: false,         //图片显示控制变量
    count: 0            //记录请求数据条数
  },

  show: function () {
    this.setData({ flag: false })
  },
  hide: function () {
    this.setData({ flag: true })
  },
  // 上拉加载回调接口
  onReachBottom: function () {
    // 我们用total和count来控制分页，total代表已请求数据的总数，count代表每次请求的个数。
    // 上拉时需把total在原来的基础上加上count，代表从count条后的数据开始请求。
    // total += count;
    // 网络请求
    console.log('到底')
    if (this.data.count === -1) {

      return;
    }
    this.getList(this.data.count);
    // this.periphery();
  },
  // onPageScroll: function(e){
  //   //监听滚动，修改背景图位置，实现视差滚动
  //   console.log(e);
  //   if (e.scrollTop%5===0){
  //     this.setData({ backgroundPosition: -e.scrollTop / 2 + 'px' })
  //   }

  //   console.log(this.data.backgroundPosition)
  // },
  onPullDownRefresh: function () {
    this.refresh();
  },
  
  refresh: function () {
    //初始化数据
    this.setData({ count: 0 })
    this.setData({ array: [] })
    this.setData({ getMsg: '加载中...' })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
    this.getList(this.data.count);
  },
  onLoad: function () {
    this.getList(this.data.count);
    
    var that = this;
    

  },
  getList: function (start) {
    var that = this;

    that.setData({ imgReady: false })         //图片路径转json完成修改控制变量，显示图片
    console.log('开始获取任务')
    new Promise((resolve, rejected) => {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy
          that.setData({ latitude: res.latitude });
          that.setData({ longitude: res.longitude })
          console.log('getLocation', res, 'this.data', that.data)
          resolve(start);
        }
      })
    }).then((start) => {
      return new Promise((resolve, rejected) => {
        wx.request({
          url: app.url+'/wx_server/getConditionalTasks',
          data: {
            start: start,
            length: 10,
            status: 0,
            longitude: that.data.longitude,
            latitude: that.data.latitude
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            var dataList = res.data.data;
            console.log(dataList)
            //截取要显示的字符串
            dataList.forEach((item) => {
              if (item.tlocation_id) {

                item.tcreate_time = item.tcreate_time.substring(5, 16);
                item.tcreate_time = item.tcreate_time.replace('-', '/');
                if (item.avatarUrl.indexOf("https") === -1) {
                  item.avatarUrl = "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLSf9eVs6Qp5SkeeibperoiawRdWqGFiblh9oIb8EXRP6vyJexcdlqDCIkM9VkkpiaajKpFDwoUuHqDhQ/0"
                }
              }

            })

            var array = that.data.array.concat(dataList);
            that.setData({ array: array });
            that.setData({ count: that.data.count + 10 })
            if (dataList.length < 10) {    //最后一组数据
              that.setData({ count: -1 })
              that.setData({ getMsg: '这回真没有了' })
              console.log('这回真没有了')
            }
            console.log('首页数据加载完成', res.data, '\n总体', that.data)
            resolve(start);
          }
        })
      })
    }).then((start) => {

      var arr = that.data.array;
      for (let i = start; i < arr.length; i++) {

        console.log('首页数据处理完成', `array[${i}].tavatarUrl`)
        var key = `array[${i}].tavatarUrl`;
        var json = null;
        try {
          json = JSON.parse(arr[i].tavatarUrl);
        } catch (err) {

        }

        that.setData({ [key]: json })
      }

      that.setData({ imgReady: true })         //图片路径转json完成修改控制变量，显示图片
    })
  },
  gotoContent: function (event) {
    console.log(event);
    wx.navigateTo({
      url: '../content/content?currentTarget=' + event.currentTarget.id
    })
  },
  taskIncept: function (event) {
    var that = this;
    wx.request({
      url: app.url+'/wx_server/taskIncept',
      data: {
        tlocation_id: event.currentTarget.id,
        tincept_id: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('接单回执', res.data)
        if (res.data.code === "200") {
          that.setData({ model: '接单成功' })
        } else {
          that.setData({ model: '接单失败' })
        }

      },
      fail: function (res) {

      },
      complete: function () {

        wx.showModal({
          title: '提示',
          content: that.data.model,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定', res.confirm);
              that.refresh();
            }
          },

        })
      }
    })
  }


})