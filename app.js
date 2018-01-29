//app.js

App({
  onLaunch: function () {
    
    //************************* */
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }/*else{
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }*/
  },
  onShow: function (options) {
    //监听网络状态
    wx.onNetworkStatusChange(function(res){
      if (res.isConnected == false){
        wx.showModal({
          title: '提示',
          content: '无网络状态',
        })
      }
    });
    
    //end 监听网络状态
    
    // Do something when show.
    
    /*wx.getSetting({
      success(res) {
        if (!res['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询
            }
          })
        }
      }
    })*/
    //end 通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
  },
  globalData:{
    userInfo:null,
    authorization:'', 
  }
})