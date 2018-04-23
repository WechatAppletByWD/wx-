var app = getApp();
Page({
  data: {
    array: [],
  },
  onLoad: function () {
    //this.setData({ array: app.globalData });
    console.log(app.globalData)
  },
  gotoContent: function (event) {
    console.log(event)
  }


})