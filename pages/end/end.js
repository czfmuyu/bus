// end.js
var app = getApp();
var code;
var sum = 0;
var billingid;
var userId;
var system;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    cost:'',
  },
  //点击联系客服
  bindPhone: function () {
    wx.showModal({
      title: '提示',
      content: '是否联系客服?',
      confirmText: '联系',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '020-85200349',
            success: function () {
              console.log('成功');
            },
            fail: function () {
              console.log('失败');
            }
          })
        }
      },
    })
  },
  //支付方法pay
  pay:function(){
    //判断是否签约
    var that = this;
    wx.request({
      url: 'https://www.wetripay.com/xcxApp/api/wxnopass/query',
      method: 'POST',
      data: {
        'uid': userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': app.globalData.authorization,
        'version': '5000',
        'platform': 'xcx'
      },
      success: function (res) {
        console.log('用户是否签约');
        console.log(res);
        console.log('用户是否签约');
        if (res.data.data == '200') {
          //进行免密支付
          wx.request({
            url: 'https://www.wetripay.com/xcxApp/api/wxnopass/Pay',
            data: {
              'value': that.data.cost,
              'billingid': billingid,
              'uid': userId
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'authorization': app.globalData.authorization,
              'version': '5000',
              'platform': 'xcx'
            },
            success: function (res) {
              console.log('免密支付成功');
              console.log(res);
              console.log('免密支付成功');
              //进行免密支付
              if (res.data.data == '200') {

                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2500,
                  success: function () {
                    setTimeout(function () {
                      wx.redirectTo({
                        url: '../main/main',
                      });
                    }, 2000);
                  }

                })

              }
              else if (res.data.data == '203') {
                wx.navigateTo({
                  url: '../welcome/welcome',
                })
              }
              //end 进行免密支付

              else if (res.data.data == '202') {
                wx.showModal({
                  title: '提示',
                  content: '账单已支付',
                });
                wx.navigateTo({
                  url: '../main/main',
                })
              }

              //进行密码支付
              else if (res.data.data == '201') {
                if (sum > 1) {
                  //第二次点击重新下单
                  //重新获取code
                  wx.login({
                    fail: function (res) {
                      console.log('用户code');
                      console.log(res);
                      console.log('用户code');
                      wx.showModal({
                        title: '提示',
                        content: '无法获取登录凭证，请稍候重试',
                      })
                    },
                    success: function (res) {
                      var secondCode = res.code;
                      //发起请求获取账单id
                      console.log('authorization');
                      console.log(app.globalData.authorization);
                      console.log('authorization');
                      wx.request({
                        url: 'https://www.wetripay.com/xcxApp/api/credential?flag=1',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded',
                          'authorization': app.globalData.authorization,
                          'version': '5000',
                          'platform': 'xcx'
                        },
                        success: function (res) {
                          console.log('100乘车信息 200二维码');
                          console.log(res);
                          console.log('100乘车信息 200二维码');
                          if (res.data.code == '401') {
                            wx.reLaunch({
                              url: '../welcome/welcome',
                            })
                          }
                          else if (res.data.data.stcode == '300') {
                            console.log('第二次下单参数');
                            console.log(secondCode);

                            console.log(res.data.data.billinglist[0].id);
                            console.log(res.data.data.billinglist[0].cost);
                            console.log('第二次下单参数');
                            //第二次下单
                            wx.request({
                              url: 'https://www.wetripay.com/xcxApp/api/order/xcxpay',
                              method: 'POST',
                              data: {
                                code: secondCode,
                                billingid: res.data.data.billinglist[0].id,
                                value: res.data.data.billinglist[0].cost,
                              },
                              header: {
                                'content-type': 'application/x-www-form-urlencoded',
                                'authorization': app.globalData.authorization,
                                'version': '5000',
                                'platform': 'xcx'
                              },
                              fail: function (res) {
                                console.log('支付请求错误');
                                console.log(res);
                                wx.showModal({
                                  title: '提示',
                                  content: res,
                                });
                                console.log('支付请求错误');
                                wx.redirectTo({
                                  url: '../welcome/welcome',
                                })
                              },
                              success: function (res) {
                                console.log('第二次预下单202账单已支付200');
                                console.log(res);
                                console.log('第二次预下单202账单已支付200');
                                if (res.data.data == '202') {
                                  wx.showModal({
                                    title: '提示',
                                    content: '账单已支付',
                                  });
                                  wx.redirectTo({
                                    url: '../main/main',
                                  });
                                }
                                else if (res.data.data.tcode = '200') {
                                  var signType = res.data.data.weixinPayDetail.signType;
                                  var nonceStr = res.data.data.weixinPayDetail
                                    .nonceStr;
                                  var timeStamp = res.data.data.weixinPayDetail
                                    .timeStamp;
                                  var package2 = res.data.data.weixinPayDetail
                                    .package;
                                  var paySign = res.data.data.weixinPayDetail
                                    .paySign;
                                  //调用微信支付
                                  wx.requestPayment({
                                    'timeStamp': timeStamp,
                                    'nonceStr': nonceStr,
                                    'package': package2,
                                    'signType': signType,
                                    'paySign': paySign,
                                    'success': function (res) {

                                      console.log(res)
                                      setTimeout(function () {
                                        wx.redirectTo({
                                          url: '../main/main',
                                        })
                                      }, 2000);
                                    },
                                    'fail': function (res) {
                                      that.setData({ disabled: false });
                                      wx.showModal({
                                        title: '提示',
                                        content: '支付失败，请重新发起支付',
                                      });

                                    },
                                  });
                                  //调用微信支付
                                }
                              }
                            });
                            //end 第二次下单


                          }
                        },
                      })
                      //发起请求获取账单id

                    }
                  });
                  //end重新获取code
                  //end 第二次
                }
                //当不大于0时，第一次发送订单
                else {

                  //第一次点击重新下单
                  //重新获取code
                  wx.login({
                    fail: function (res) {
                      console.log('用户code报错');
                      console.log(res);
                      wx.showModal({
                        title: '提示',
                        content: '无法获取登录凭证，请稍候重试',
                      })
                      console.log('用户code报错');
                    },
                    success: function (res) {
                      var secondCode = res.code;
                      //发起请求获取账单id
                      console.log('authorization');
                      console.log(app.globalData.authorization);
                      console.log('authorization');
                      wx.request({
                        url: 'https://www.wetripay.com/xcxApp/api/credential?flag=1',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded',
                          'authorization': app.globalData.authorization,
                          'version': '5000',
                          'platform': 'xcx'
                        },
                        success: function (res) {
                          console.log('100乘车信息 200二维码');
                          console.log(res);
                          console.log('100乘车信息 200二维码');
                          if (res.data.code == '401') {
                            wx.reLaunch({
                              url: '../welcome/welcome',
                            });
                          }
                          else if (res.data.data.stcode == '300') {
                            console.log('第次下单参数');
                            console.log(secondCode);
                            console.log(res.data.data.billinglist[0].id);
                            console.log(res.data.data.billinglist[0].cost);
                            console.log('第次下单参数');
                            //第次下单
                            wx.request({
                              url: 'https://www.wetripay.com/xcxApp/api/order/xcxpay',
                              method: 'POST',
                              data: {
                                code: secondCode,
                                billingid: res.data.data.billinglist[0].id,
                                value: res.data.data.billinglist[0].cost,
                              },
                              header: {
                                'content-type': 'application/x-www-form-urlencoded',
                                'authorization': app.globalData.authorization,
                                'version': '5000',
                                'platform': 'xcx'
                              },
                              fail: function (res) {
                                console.log('支付请求错误');
                                console.log(res);
                                wx.showModal({
                                  title: '提示',
                                  content: res,
                                })
                                console.log('支付请求错误');
                                wx.navigateTo({
                                  url: '../welcome/welcome',
                                })
                              },
                              success: function (res) {
                                console.log('第次预下单成功');
                                console.log(res);
                                console.log('第次预下单成功');
                                wx.showModal({
                                  title: '提示',
                                  content: '账单已支付',
                                });
                                if (res.data.data == '202') {
                                  wx.redirectTo({
                                    url: '../main/main',
                                  });
                                }
                                else if (res.data.data.tcode = '200') {
                                  var signType = res.data.data.weixinPayDetail.signType;
                                  var nonceStr = res.data.data.weixinPayDetail
                                    .nonceStr;
                                  var timeStamp = res.data.data.weixinPayDetail
                                    .timeStamp;
                                  var package2 = res.data.data.weixinPayDetail
                                    .package;
                                  var paySign = res.data.data.weixinPayDetail
                                    .paySign;
                                  //调用微信支付
                                  wx.requestPayment({
                                    'timeStamp': timeStamp,
                                    'nonceStr': nonceStr,
                                    'package': package2,
                                    'signType': signType,
                                    'paySign': paySign,
                                    'success': function (res) {

                                      console.log('密码支付成功');
                                      console.log(res);
                                      console.log('密码支付成功');
                                      setTimeout(function () {
                                        wx.redirectTo({
                                          url: '../main/main',
                                        })
                                      }, 2000);
                                    },
                                    'fail': function (res) {
                                      console.log(res);
                                      that.setData({ disabled: false });
                                      wx.showModal({
                                        title: '提示',
                                        content: '支付失败，请重新发起支付',
                                      });

                                    },
                                  });
                                  //调用微信支付
                                }
                              }
                            });
                            //end 第次下单


                          }
                        },
                      })
                      //发起请求获取账单id

                    }
                  });
                  //end重新获取code
                  //end 第次

                };
              }
              //end进行密码支付


            },
            fail: function (res) {
              wx.showModal({
                title: '提示',
                content: res,
              })
            }
          })
          //end进行免密支付
        } else if (res.data.data == '201') {
          wx.showModal({
            title: '提示',
            content: '您未签约，请签约免密代扣',
            confirmText: '允许签约',
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
                      },
                      fail(res) {
                        console.log('签名失败');
                        console.log(res);
                        wx.showModal({
                          title: '提示',
                          content: '跳转签约小程序失败，请重试',
                        })
                      },
                      complete(res) {
                        console.log(res);
                      }

                    });
                    //end 跳转到签约
                  },
                  fail:function(res){
                    console.log('失败原因');
                    console.log(res);
                  }
                });
                //
                //end 开通签约
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: res,
        });
        wx.redirectTo({
          url: '../welcome/welcome',
        })
      }
    })
    //end 判断是否签约

  },
  // end 支付方法pay
  
  //调用支付
  bindTo:function(){
    
    var that = this;
    this.setData({ disabled: true });
    setTimeout(function(){
      that.setData({disabled: false});
    },5000);
    //
    sum+=1;
    //进行免密支付  
    console.log('获取cost和bid');
    console.log(this.data.cost);
    console.log(billingid);
    console.log(userId);
    console.log(app.globalData.authorization);
    console.log(system);
    console.log('获取cost和bid');
    //判断账单
    if(this.data.cost == "0"){
      wx.request({
        url: 'https://www.wetripay.com/xcxApp/api/bussiness/billingstate',
        method: 'POST',
        data: {
          'bid': billingid,
          'uid': userId,
          'couponid':'0',
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'authorization': app.globalData.authorization,
          'version': '5000',
          'platform': 'xcx'
        },
        success:function(res){
          console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
          console.log(res);
          console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
          //200成功 202订单已支付 500参数非法
          if(res.data.code == '200'){
            wx.redirectTo({
              url: '../main/main',
            })
          }
          else if (res.data.code == '202'){
            wx.redirectTo({
              url: '../main/main',
            })
          }
          else if (res.data.code == '500') {
            wx.redirectTo({
              url: '../welcome/welcome',
            })
          }
        }
      })

    }
    else{
      this.pay();
    }
    //end //判断账单
    //end进行免密支付
  
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        userId = res.data;
      },
    })
    //获得缓存数据
    wx.getStorage({
      key: 'cost',
      success: function(res) {
        that.setData({cost:res.data});
      },
    });
    wx.getStorage({
      key: 'getontime',
      success: function (res) {
        that.setData({ getontime: res.data });
      },
    });
    wx.getStorage({
      key: 'name',
      success: function (res) {
        that.setData({ name: res.data });
      },
    });
    wx.getStorage({
      key: 'remark',
      success: function (res) {
        that.setData({ remark: res.data });
      },
    })
    //end 获得缓存数据
    
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
    //判断该页面的状态
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
        console.log('页面状态');
        console.log(res);
        console.log(res.data&&res.data.data);
        console.log(res.data&&res.dat&&res.data.data);
        if (res.data && res.data.data && res.data.data.stcode &&res.data.data.stcode == '200') {
          wx.redirectTo({
            url: '../main/main',
          })
        }
        else if (res.data && res.data.data && res.data.data.stcode && res.data.data.stcode == '100') {
          wx.redirectTo({
            url: '../first/first',
          })
        }
      },
      fail:function(res){
        console.log('onshow请求失败原因');
        console.log(res);
        wx.redirectTo({
          url: '../welcome/welcome',
        })
      }
    })
    //end 判断该页面的状态
    //获取code
    wx.getStorage({
      key: 'code',
      success: function (res) {
        code = res.data;
      },
    });
    //获取账单id
    wx.getStorage({
      key: 'bid',
      success: function (res) {
        billingid = res.data;
        console.log('billingid');
        console.log(billingid);
        console.log('billingid');
      },
    });
    //获取用户手机操作系统版本
    wx.getSystemInfo({
      success: function (res) {
        system = res.system;
        var SDKVersion = res.SDKVersion.slice(0, 3);
        console.log('客户端版本号');
        console.log(SDKVersion);
        console.log(SDKVersion <= 1.3);
        console.log('客户端版本号');
        if (SDKVersion <= 1.3) {
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