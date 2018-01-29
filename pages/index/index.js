//index.js
//获取应用实例
var app = getApp();
var nickName;
var avatarUrl;
var openid;
var sessionkey;
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    phone: '',
    focus:true,
    motaiHeight:0,
    button:true,
    disabled:false
  },
  //开始注册
  start:function(){
    this.setData({ disabled: true });
    console.log(1111111111)
  },
  //结束导引
  finish:function(){
    this.setData({motaiHeight:0});
    this.setData({ button: true });
    wx.redirectTo({
      url: '../welcome/welcome',
    })
  },
  //判断是否授权
  judge:function(){
    var that = this;
    //判断用户是否授权
    wx.authorize({
      scope: 'scope.userInfo',
      success: function (res) {
        console.log(res);
        console.log('判断用户是否授权');
        //获取用户信息，头像，昵称
        wx.getUserInfo({
          success: function (res) {
            nickName = res.userInfo.nickName;
            avatarUrl = res.userInfo.avatarUrl;
          }
        });
        // end 获取用户信息，头像，昵称
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '没有授权获取昵称头像信息，不能正常使用，是否允许获取昵称头像信息？',
          confirmText: '允许',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success:function(res){
                  console.log('判断');
                  console.log(res);
                  console.log(res.authSetting["scope.userInfo"]);
                  if (res.authSetting["scope.userInfo"]){
                    //获取用户信息，头像，昵称
                    wx.getUserInfo({
                      success: function (res) {
                        nickName = res.userInfo.nickName;
                        avatarUrl = res.userInfo.avatarUrl;
                      }
                    });
                    // end 获取用户信息，头像，昵称
                  }
                }
              });
              
            } else if (res.cancel) {
              that.judge();
            }
          }
        })
      }
    });
    //end判断用户是否授权

  },
  //申请获取电话号码
  getPhoneNumber: function (e) {
    
    var that = this;
    console.log(e);
    if (e.detail.errMsg != 'getPhoneNumber:ok') {
      this.setData({ disabled: false });

    } else {
      var AppId = "wx7ca3874267495d35";
      console.log(sessionkey);
      console.log(12);
      var pc = new WXBizDataCrypt(AppId, sessionkey);
      console.log(e.detail.encryptedData);
      console.log(e.detail.iv);
      console.log(pc);
      var datas = pc.decryptData(e.detail.encryptedData, e.detail.iv);
      console.log(datas);
      var purePhoneNumber = datas.purePhoneNumber;
      console.log(openid);
      console.log(purePhoneNumber);
      console.log(nickName);
      console.log(avatarUrl);
      //发送电话号码
      wx.request({
        url: 'https://www.wetripay.com/xcxApp/api/weixinlogin/xcxbinguser',
        method: 'POST',
        data: {
          'openid': openid,
          'phone': purePhoneNumber,
          'nickname': nickName,
          'imgurl': avatarUrl,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
          if (res.data.data.tcode == '200') {
            app.globalData.authorization = res.data.data.loginResult.authorizationId;
            // userid放到缓存
            wx.setStorage({
              key: 'userId',
              data: res.data.data.loginResult.user.id,
            });
            //end userid放到缓存
            //弹出引导页
            wx.showToast({
              title: '注册成功',
              image:'../images/success.png',
  
              success:function(){
                setTimeout(function(){
                  that.setData({ motaiHeight: 100 });
                  that.setData({ button: false });
                  //创建动画队列
                  /*var animation = wx.createAnimation({
                    duration:'200',
                    timingFunction:'ease'
                  });
                  that.animation = animation;
                  var aHeight = "100%";
                  that.animation.height(aHeight).opacity(1).step();
                  that.setData({animation:animation.export()});
                  //end 创建动画队列*/
                },2000);
              }
            })
            
            //end 弹出引导页
          } else if (res.data.data.tcode == '500') {
            wx.showModal({
              title: '提示',
              content: '服务器异常，请重新登录',
            })
          };
        }
      })
      //end 发送电话号码*/
    }
  },
  //end 申请获取电话号码
  onLoad: function () {

  },
  
  //监听页面进行显示
  onShow:function(){

    this.judge();

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

    //获取用户信息，头像，昵称
    wx.getUserInfo({
      success: function (res) {
        nickName = res.userInfo.nickName;
        avatarUrl = res.userInfo.avatarUrl;
      }
    });
    // end 获取用户信息，头像，昵称

    //获取openid
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        openid = res.data;
      },
    });
    //获取sessionkey
    wx.getStorage({
      key: 'sessionkey',
      success: function (res) {
        sessionkey = res.data;
      },
    });
  
  },
  //end 监听页面进行显示
  
})
