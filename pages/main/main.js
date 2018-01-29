
var app = getApp();
var QR = require("../../utils/qrcode.js");
var timer;

//var urlBegin;
Page({
  data:{
    //maskHidden:true,
    //imagePath:'',
    //placeholder:{},//默认二维码生成文本
    nickName:'',
    avatarUrl:'',
    canvas:true,
    text:true, 
    boxImage:true,
    userImage:false,  
  },
  //跳转
  bindto:function(){
    wx.navigateTo({
      url: '../index/index',
    })
  },
 
  //获取适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 600;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  
  
  //点击出现账单
  bindLeft: function () {
    wx.navigateTo({
      url: '../userinfo/userinfo',
    })

  },
  //点击联系客服
  bindPhone:function(){
    wx.showModal({
      title: '提示',
      content: '是否联系客服?',
      confirmText: '联系',
      success:function(res){
        if (res.confirm){
          wx.makePhoneCall({
            phoneNumber:'020-85200349',
            success:function(){
              console.log('成功');
            },
            fail:function(){
              console.log('失败');
            }
          })
        }
      },
    })
  },
  //canvas出错
  canvasError:function(res){
    console.log('canvas出错');
    console.log(res);
    console.log('canvas出错');
    
  },
  //mainContent
  mainContent:function(){
  var that = this;
  //第一次绘制二维码
  wx.request({
    url: 'https://www.wetripay.com/xcxApp/api/credential',
    data: {
      'flag': '1'

    },
    method: "GET",
    header: {
      'content-type': 'application/json',
      'authorization': app.globalData.authorization,
      'version': '5000',
      'platform': 'xcx'
    },

    success: function (res) {
      console.log('第一次绘制成功');
      var urlBegin = res.data.data.code;
      //第一次绘制二维码
      //var st = setTimeout(function () {

      var size = that.setCanvasSize();
      wx.showToast({
        title: '生成中...',
        icon: 'loading',
        duration: 500
      });
      console.log(res.data.data.code);
      console.log(size.w);
      console.log(size.h);
      //that.createQrCode(urlBegin, "mycanvas", size.w, size.h);
      console.log('第一次绘画');
      QR.qrApi.draw(urlBegin, "mycanvas", size.w, size.h);
      console.log('第一次绘画');
      //clearTimeout(st);
      clearInterval(timer);
      //第二次绘制
      timer = setInterval(function () {
        console.log('authorizationId');
        console.log(app.globalData.authorization);
        console.log('authorizationId');
        wx.request({
          url: 'https://www.wetripay.com/xcxApp/api/credential?flag=1',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'authorization': app.globalData.authorization,
            'version': '5000',
            'platform': 'xcx'
          },
          method: "GET",
          fail:function(res){
            console.log('第二次执行错误');
            console.log(res);
            console.log('第二次执行错误');
            wx.redirectTo({
              url: '../welcome/welcome',
            })
          },
          success: function (res) {
            console.log('第二次绘制成功');

            //判断状态
            //200画二维码
            console.log('100有乘车信息200二维码');
            console.log(res);
            console.log('100有乘车信息200二维码');

            if (res.data && res.data.data && res.data.data.stcode && res.data.data.stcode == '200') {
              var size = that.setCanvasSize();
              console.log(res.data.data.code);
              console.log(size.w);
              console.log(size.h);
              console.log('执行绘画1');
              QR.qrApi.draw(res.data.data.code, "mycanvas", size.w, size.h);
              console.log('执行绘画2');
              //that.createQrCode(res.data.data.code, "mycanvas", size.w, size.h);
            }

            //100乘车信息
            else if (res.data && res.data.data && res.data.data.stcode && res.data.data.stcode == '100') {
              //清除定时器
              clearInterval(timer);
              //乘车信息放到缓存
              wx.removeStorage({
                key: 'stindex',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'stindex',
                data: res.data.data.stindex,
              });
              wx.removeStorage({
                key: 'busline',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'busline',
                data: res.data.data.busline,
              });
              wx.removeStorage({
                key: 'lineid',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'lineid',
                data: res.data.data.lineid,
              });
              wx.removeStorage({
                key: 'dir',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'dir',
                data: res.data.data.dir,
              });
              //票价
              if (res.data.data.feescale == '1') {
                wx.removeStorage({
                  key: 'price',
                  success: function (res) { },
                });
                wx.setStorage({
                  key: 'price',
                  data: res.data.data.sp + '元',
                });
              } else if (res.data.data.feescale == '2') {
                var price = res.data.data.sp + '-' + res.data.data.ep + '元';
                wx.removeStorage({
                  key: 'price',
                  success: function (res) { },
                });
                wx.setStorage({
                  key: 'price',
                  data: price,
                });
              };
              //end 票价
              wx.removeStorage({
                key: 'start',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'start',
                data: res.data.data.start,
              });
              wx.removeStorage({
                key: 'end',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'end',
                data: res.data.data.end,
              });

              //end 乘车信息放到缓存
              wx.redirectTo({
                url: '../first/first',
              })
            }
            //300成功跳转到支付页面 
            else if (res.data && res.data.data && res.data.data.stcode && res.data.data.stcode == '300') {
              console.log('billingid');
              console.log(res.data.data.billinglist[0].id);
              console.log('billingid');
              clearInterval(timer);
              //bid放到缓存
              wx.removeStorage({
                key: 'bid',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'bid',
                data: res.data.data.billinglist[0].id,
              });
              //end bid放到缓存
              //把数据放到缓存
              wx.removeStorage({
                key: 'cost',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'cost',
                data: res.data.data.billinglist[0].cost,
              });
              wx.removeStorage({
                key: 'remark',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'remark',
                data: res.data.data.billinglist[0].remark,
              });
              wx.removeStorage({
                key: 'getontime',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'getontime',
                data: res.data.data.billinglist[0].getontime.slice(0, 16),
              });
              wx.removeStorage({
                key: 'name',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'name',
                data: res.data.data.billinglist[0].name,
              });
              // end 把数据放到缓存
              wx.redirectTo({
                url: '../end/end',
              });
            } else if (res.data.code == '401') {
              wx.reLaunch({
                url: '../welcome/welcome',
              })
            }
            else {
              //登录超时跳转欢迎页面
              wx.reLaunch({
                url: '../welcome/welcome'
              });
              //end登录超时跳转欢迎页面
            };

          },

        });



      }, 3000);
      //end 第二次绘制*/

      //}, 500);
      //end 第一次绘制二维码
    },
    fail: function (res) {

      console.log('错误');
      console.log(res);
      console.log('成功引起的错误');
      wx.redirectTo({
        url: '../welcome/welcome',
      })
      /*clearInterval(timer);
      //第二次绘制
      timer = setInterval(function () {
 
        wx.request({
          url: 'https://www.wetripay.com/xcxApp/api/credential?flag=1',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'authorization': authorizationId,
            'version': '5000',
            'platform': 'xcx'
          },
          success: function (res) {
 
            //判断状态
            //200画二维码
            console.log('100有乘车信息200二维码');
            console.log(res);
            console.log('100有乘车信息200二维码');
 
            if (res.data.data.stcode == '200') {
              var size = that.setCanvasSize();
              console.log(res.data.data.code);
              console.log(size.w);
              console.log(size.h);
              console.log('执行绘画1');
              QR.qrApi.draw(res.data.data.code, "mycanvas", size.w, size.h);
              console.log('执行绘画2');
              //that.createQrCode(res.data.data.code, "mycanvas", size.w, size.h);
            }
 
            //100乘车信息
            else if (res.data.data.stcode == '100') {
              //清除定时器
              clearInterval(timer);
              //乘车信息放到缓存
              wx.removeStorage({
                key: 'busline',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'busline',
                data: res.data.data.busline,
              });
              wx.removeStorage({
                key: 'lineid',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'lineid',
                data: res.data.data.lineid,
              });
              wx.removeStorage({
                key: 'dir',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'dir',
                data: res.data.data.dir,
              });
              //票价
              if (res.data.data.feescale == '1') {
                wx.removeStorage({
                  key: 'price',
                  success: function (res) { },
                });
                wx.setStorage({
                  key: 'price',
                  data: res.data.data.sp + '元',
                });
              } else if (res.data.data.feescale == '2') {
                var price = res.data.data.sp + '-' + res.data.data.ep + '元';
                wx.removeStorage({
                  key: 'price',
                  success: function (res) { },
                });
                wx.setStorage({
                  key: 'price',
                  data: price,
                });
              };
              //end 票价
              wx.removeStorage({
                key: 'start',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'start',
                data: res.data.data.start,
              });
              wx.removeStorage({
                key: 'end',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'end',
                data: res.data.data.end,
              });
 
              //end 乘车信息放到缓存
              wx.redirectTo({
                url: '../first/first',
              })
            }
            //300成功跳转到支付页面 
            else if (res.data.data.stcode == '300') {
              console.log('billingid');
              console.log(res.data.data.billinglist[0].id);
              console.log('billingid');
              clearInterval(timer);
              //bid放到缓存
              wx.removeStorage({
                key: 'bid',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'bid',
                data: res.data.data.billinglist[0].id,
              });
              //end bid放到缓存
              //把数据放到缓存
              wx.removeStorage({
                key: 'cost',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'cost',
                data: res.data.data.billinglist[0].cost,
              });
              wx.removeStorage({
                key: 'remark',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'remark',
                data: res.data.data.billinglist[0].remark,
              });
              wx.removeStorage({
                key: 'getontime',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'getontime',
                data: res.data.data.billinglist[0].getontime.slice(0, 16),
              });
              wx.removeStorage({
                key: 'name',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'name',
                data: res.data.data.billinglist[0].name,
              });
              // end 把数据放到缓存
              wx.redirectTo({
                url: '../end/end',
              });
            } else if (res.data.code == '401') {
              wx.reLaunch({
                url: '../welcome/welcome',
              })
            }
            else {
              //登录超时跳转欢迎页面
              wx.reLaunch({
                url: '../welcome/welcome'
              });
              //end登录超时跳转欢迎页面
            };
 
          },
 
        });
      }, 3000);
  //end 第二次绘制*/

    }  
                  
                   
                 
  });

  //end第一次绘制二维码
              
            
  },
  //end mainContent
  //加载
  onLoad:function(options){
   
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
  onShow: function () {
    var that = this;
    //判断用户是否授权
    wx.authorize({
      scope: 'scope.userLocation',
      success: function (res) {
        console.log(res);
        console.log('判断用户是否授权');
        //判断是否能获取位置
        wx.getLocation({
          type: 'gcj02',
          success: function(res) {
            console.log('精度'+res.longitude);
            console.log('纬度'+res.latitude);
            that.setData({ canvas: true });
            that.setData({ text: true, });
            that.setData({ imgChange: false, });
            that.setData({ textChange: false, });
          },
          fail: function () {
            wx.hideLoading();
            wx.showModal({
              title: '信息',
              content: '获取不到位置信息，请确认您的gps已经打开',
              success:function(res){
                if (res.cancel){
                  wx.redirectTo({
                    url: '../welcome/welcome',
                  });
                }
                else{
                  wx.redirectTo({
                    url: '../welcome/welcome',
                  });
                }
              }
            });
            that.setData({ canvas: false });
            that.setData({ text: false, });
            that.setData({ imgChange: true, });
            that.setData({ textChange: true, });
            
          },
        });
        //判断是否能获取位置

      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '没有授权获取地理位置，不能正常使用，是否允许打开地理位置？',
          confirmText: '允许',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting();
              that.setData({ canvas: true });
              that.setData({ text: true, });
              that.setData({ imgChange: false, });
              that.setData({ textChange: false, });
              //判断是否能获取位置
              wx.getLocation({
                type: 'gcj02',
                success: function (res) {
                  that.setData({ canvas: true });
                  that.setData({ text: true, });
                  that.setData({ imgChange: false, });
                  that.setData({ textChange: false, });
                },
                fail: function () {
                  wx.hideLoading();
                  wx.showModal({
                    title: '信息',
                    content: '获取不到位置信息，请确认您的gps已经打开',
                    success: function (res) {
                      if (res.cancel) {
                        wx.redirectTo({
                          url: '../welcome/welcome',
                        });
                      }
                      else {
                        wx.redirectTo({
                          url: '../welcome/welcome',
                        });
                      }
                    }
                  });
                  that.setData({ canvas: false });
                  that.setData({ text: false, });
                  that.setData({ imgChange: true, });
                  that.setData({ textChange: true, });
                  
                },
              });
              //判断是否能获取位置
            } else if (res.cancel) {
              that.setData({ canvas: false });
              that.setData({ text: false, });
              that.setData({ imgChange: true, });
              that.setData({ textChange: true, });
              wx.redirectTo({
                url: '../welcome/welcome',
              });
            }
          }
        })
      }
    });

  //end判断用户是否授权*/
    //判断用哪张图片
    //获取用户信息，头像，昵称
    wx.getUserInfo({
      success: function (res) {
        that.setData({ nickName: res.userInfo.nickName });
        that.setData({ avatarUrl: res.userInfo.avatarUrl });

        that.setData({ boxImage: false });
        that.setData({ userImage: true });

        //判断用哪张图片
      }
    })
    // end 获取用户信息，头像，昵称
    console.log('app.globalData.authorization');
    console.log(app.globalData.authorization);
    console.log('app.globalData.authorization');
    this.mainContent();
    
   

  },

  //
  onReady:function(){
    //获取用户手机操作系统版本
    wx.getSystemInfo({
      success: function (res) {

        var SDKVersion = res.SDKVersion.slice(0, 3);
        console.log('main 客户端版本号');
        console.log(SDKVersion);
        console.log(SDKVersion < 1.3);
        console.log('main 客户端版本号');
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
  
  onHide:function(){
    // 页面隐藏 
    clearInterval(timer);
    
  },

  onUnload:function(){
    // 页面关闭
    clearInterval(timer);

  },
  onShareAppMessage: function (option) {
    console.log(option);
    return {
      path: '/pages/welcome/welcome',
      title: '微信乘车快捷支付',
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