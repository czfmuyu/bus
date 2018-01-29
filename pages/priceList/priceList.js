// priceList.js
var app = getApp();
var userId;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    priceList:'',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        userId = res.data;       
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: 'https://www.wetripay.com/xcxApp/api/billing/userbilling',
      method: 'GET',
      data: {
        'uid': userId,
        'index': '0',
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': app.globalData.authorization,
        'version': '5000',
        'platform': 'xcx'
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res.data.data);
        if (res.data.data.billingList == ''){
          wx.showModal({
            title: '提示',
            content: '您暂时没有乘车记录',
          })
        };
        that.setData({priceList:res.data.data.billingList});
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})