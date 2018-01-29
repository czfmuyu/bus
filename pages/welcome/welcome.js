// welcome.js
var app = getApp();
var sum = 0;
var system;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  
  },
  
  content:function(){
    //调用登录接口，获取openid
    var that = this;

    console.log('是否执行login1');
    wx.login({
      fail: function (res) {
        console.log('login用户code');
        wx.showModal({
          title: '提示',
          content: '无法获取登录凭证，请稍候重试',
        });
        console.log(res);
        console.log('login用户code');
        //setTimeout(function () { that.onShow();},8000);

      },
      success: function (res) {
        console.log('welcome  login');
        console.log(res);
        console.log('welcome  login');
        wx.request({
          url: 'https://www.wetripay.com/xcxApp/api/weixinlogin/xcxlogin',
          data: {
            'code': res.code
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          fail: function () {
            console.log('请求失败');
            //that.content();
          },
          success: function (res) {
            //判断状态
            console.log('200有用户信息');
            console.log(res);
            console.log('200有用户信息');

            if (res.data.data.tcode == "200") {
              console.log('进入200');
              console.log(res.data.data.loginResult.user.id);
              app.globalData.authorization = res.data.data.loginResult.authorizationId;
              //将用户id，和 用户电话 放到缓存
              wx.removeStorage({
                key: 'userId',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'userId',
                data: res.data.data.loginResult.user.id,
              });
              wx.removeStorage({
                key: 'phone',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'phone',
                data: res.data.data.loginResult.user.phone,
              });
              //end 将用户id放到缓存
              //判断是否签约
              wx.request({
                url: 'https://www.wetripay.com/xcxApp/api/wxnopass/query',
                method: 'POST',
                data: {
                  'uid': res.data.data.loginResult.user.id
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'authorization': app.globalData.authorization,
                  'version': '5000',
                  'platform': 'xcx'
                },
                fail: function (res) {
                  console.log(res);
                  console.log('签约请求失败');
                  //that.content();
                },
                success: function (res) {
                  //200用户已签约，201用户解除
                  console.log('200用户已签约，201用户解除');
                  console.log(res);
                  console.log('200用户已签约，201用户解除');
                  if (res.data.data == '200') {
                    //判断是否有未支付信息
                    console.log('res.data.data.loginResult.authorizationId');
                    console.log(app.globalData.authorization);
                    console.log('res.data.data.loginResult.authorizationId');
                    wx.request({
                      url: 'https://www.wetripay.com/xcxApp/api/credential?flag=1',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'authorization': app.globalData.authorization,
                        'version': '5000',
                        'platform': 'xcx'
                      },
                      fail: function (res) {
                        console.log(res);
                        console.log('支付请求失败');
                        //that.content();
                      },
                      success: function (res) {
                        console.log('welcome是否有乘车信息');
                        console.log(res);
                        console.log('welcome是否有乘车信息');
                        if (res.data.data.stcode == '100') {
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
                        else if (res.data.data.stcode == '300') {
                          console.log('获取bid和cost');
                          console.log(res);
                          console.log('获取bid和cost');
                          //把数据放到缓存
                          wx.removeStorage({
                            key: 'bid',
                            success: function (res) { },
                          });
                          wx.setStorage({
                            key: 'bid',
                            data: res.data.data.billinglist[0].id,
                          });
                          wx.removeStorage({
                            key: 'cost',
                            success: function (res) { },
                          });
                          wx.setStorage({
                            key: 'cost',
                            data: res.data.data.billinglist[0].cost,
                          });
                          wx.removeStorage({
                            key: 'remart',
                            success: function (res) { },
                          });
                          wx.setStorage({
                            key: 'remark',
                            data: res.data.data.billinglist[0].remark,
                          });
                          console.log(res.data.data.billinglist[0].getontime.slice(0, 16));
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
                        }
                        //
                        else if (res.data.code == '401') {
                          
                          that.content();
                          
                        }
                        else if (res.data.data.stcode == '200') {
                          //跳转页面**************************
                          console.log('99999999999999999999999999');
                          wx.reLaunch({
                            url: '../main/main',
                            fail:function(res){
                              console.log('跳转失败');
                              console.log(res);
                              console.log('跳转失败');
                            },
                            success:function(res){
                              console.log('跳转成功');
                              console.log(res);
                              console.log('跳转成功');
                            }
                          });
                          //跳转页面**************************
                          
                        }
                      }
                    });
                    //end判断是否有未支付信息

                  }
                  else if (res.data.data == '201') {
                    //end 判断签约
                    wx.showModal({
                      title: '提示',
                      content: '正常使用需要开通微信免密支付',
                      confirmText: '马上跳转',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          //开通签约
                          //请求的参数
                          console.log(app.globalData.authorization);
                          wx.request({
                            url: 'https://www.wetripay.com/xcxApp/api/wxnopass/sign',
                            method: 'POST',
                            data: {
                              'type': system
                            },
                            header: {
                              'content-type': 'application/x-www-form-urlencoded',
                              'authorization': app.globalData.authorization,
                              'version': '5000',
                              'platform': 'xcx',
                            },
                            success: function (res) {
                              console.log('签约参数信息');
                              console.log(res);
                              var extraData = {
                                appid: res.data.data.appid,
                                contract_code: res.data.data.contract_code,
                                contract_display_account: res.data.data.contract_display_account,
                                mch_id: res.data.data.mch_id,
                                notify_url: res.data.data.newNotify_url,
                                plan_id: res.data.data.plan_id,
                                request_serial: res.data.data.request_serial,
                                timestamp: res.data.data.timestamp,
                                sign: res.data.data.sign,
                              };
                              console.log(extraData);
                              //跳转到签约小程序
                              wx.navigateToMiniProgram({
                                appId: 'wxbd687630cd02ce1d',
                                path: 'pages/index/index',
                                extraData: {
                                  appid: res.data.data.appid,
                                  contract_code: res.data.data.contract_code,
                                  contract_display_account: res.data.data.contract_display_account,
                                  mch_id: res.data.data.mch_id,
                                  notify_url: res.data.data.newNotify_url,
                                  plan_id: res.data.data.plan_id,
                                  request_serial: res.data.data.request_serial,
                                  timestamp: res.data.data.timestamp,
                                  sign: res.data.data.sign


                                },
                                success(res) {
                                  console.log('签名成功');
                                  console.log(res);
                                  console.log('签名成功');
                                  //添加到卡包
                                  wx.login({
                                    success: function (res) {
                                      console.log('code码');
                                      console.log(res.code);
                                      wx.request({
                                        url: 'http://192.168.0.111/ebusApp/api/weixincard/addCard',
                                        data: {
                                          'code': res.code,
                                          'contractId': 'contractId',
                                    

                                        },
                                        method: 'POST',
                                        header: {
                                          'content-type': 'application/x-www-form-urlencoded'
                                        },
                                        success: function (data) {
                                          console.log('卡卷参数');
                                          console.log(data);
                                          //添加交通卡

                                        }
                                      });


                                    }
                                  })
                                  //

                                },
                                fail(res) {
                                  console.log('签名失败');
                                  console.log(res);
                                  wx.showModal({
                                    title: '提示',
                                    content: '跳转签约小程序失败，请重试',
                                    success: function (res) {
                                      if (res.confirm) {
                                        that.content();
                                      }

                                    }
                                  })
                                },
                                complete(res) {
                                  console.log(res);
                                }

                              });
                              //end 跳转到签约
                            },
                          });
                          //
                          //end 开通签约
                        } else if (res.cancel) {
                          console.log('用户点击取消');
                          //that.content();
                        }
                      }
                    })
                    //end 判断签约

                  }
                  //200用户已签约，201用户解除
                }
              });
              //end 判断是否签约

            } else if (res.data.data.tcode == "300") {
              //获取openid
              wx.removeStorage({
                key: 'openid',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'openid',
                data: res.data.data.openid,
              });
              //end 获取openid
              //获取session_key
              wx.removeStorage({
                key: 'sessionkey',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'sessionkey',
                data: res.data.data.sessionkey,
              });
              //end session_key
              //跳转到index
              wx.reLaunch({
                url: '../index/index',
              });
            };
            //end 判断状态
          },
        });
        // end 判断是否能够登录
      }
    });
    //调用登录接口，获取openid
    console.log('是否执行login2');
  },
  //end接口内容

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取用户手机操作系统版本
    
    wx.getSystemInfo({
      success: function (res) {
        system = res.system;
        var SDKVersion = res.SDKVersion.slice(0, 3);
        console.log('welcome 客户端版本号');
        console.log(SDKVersion);
        console.log(SDKVersion <= 1.3);
        console.log('welcome客户端版本号');
        if (SDKVersion <= 1.3) {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法正常使用小程序，请升级到最新微信版本后重试。'
          })
        }
      }
    });
    //end获取用户手机操作系统版本
    
    sum+=1;
    console.log('sum'+sum);
    if(sum == 1){
      this.content();
    }
    
    
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    sum = 0;
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    sum = 0;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   
  onPullDownRefresh: function () {
  
  },*/

  /**
   * 页面上拉触底事件的处理函数
   
  onReachBottom: function () {
  
  },*/

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})