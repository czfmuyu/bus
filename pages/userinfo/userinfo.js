// userinfo.js
var system;
var userId;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    avatarUrl:'',
    phone:'',
  },
  
  //转发
  bindmemu:function(){
    this.onReady();
  },
  
  //添加公交卡
  bindaddcard:function(){
    //获取时间戳
    var timestamp = (new Date()).valueOf();
    console.log('获取到的时间戳');
    console.log(timestamp);
     
  
  },

  //点击账单，获取账单页面
  catchpPrice: function () {
    wx.navigateTo({
      url: '../priceList/priceList',
    })
  },

  //跳转到地图组件
  bindto:function(){
    wx.switchTab({
      url: '../map/map',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options');
    console.log(options);
    var that = this;
    //获取用户信息，头像，昵称
    wx.getUserInfo({
      success: function (res) {
        that.setData({ nickName: res.userInfo.nickName });
        that.setData({ avatarUrl: res.userInfo.avatarUrl });
      }
    })
    // end 获取用户信息，头像，昵称
    // 获取用户电话
    wx.getStorage({
      key: 'phone',
      success: function (res) {
        that.setData({ phone: res.data });
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取用户手机操作系统版本
    wx.getSystemInfo({
      success: function (res) {

        var SDKVersion = res.SDKVersion.slice(0, 3);
        console.log('客户端版本号');
        console.log(SDKVersion);
        console.log(SDKVersion < 1.3);
        console.log('客户端版本号');
        if (SDKVersion < 1.3) {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
        }
      }
    })
    //end获取用户手机操作系统版本
    
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取用户手机操作系统版本
    wx.getSystemInfo({
      success: function (res) {
        system = res.system;
      }
    })
    //end获取用户手机操作系统版本
    //获取userid
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        userId = res.data
      },
    });
    //end获取userid

    
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
  onShareAppMessage: function (option) {
    console.log(option);
    return {
      path: '/pages/welcome/welcome',
      title:'微信乘车快捷支付',
      success: function (res) {
        // 转发成功
        console.log('转发成功');
        console.log(res);
      },
      fail: function (res) {
        // 转发失败
        
      }
    }
  }
})