// first.js
var app = getApp();
var userId;
var system;
var pageLeft;
var pageTop;
var boxTop;
var mtHeight;
var mtBox;
var mtContent;

var dbSum = 0;
var firstClick;
var arrMin;
var timer2;
var timer3;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    busline:'',
    price:'',
    start:'',
    end:'',
    phone:'',
    nickName:'',
    avatarUrl:'',
    boxImage: true,
    userImage: false, 
    disabled:false,
    height:0,
    stindex:'',
    
    
  },
  //两次点击，提醒到站
  dbTap:function(e){

    dbSum+=1;
    if(dbSum>2){
      dbSum=1
    }
    if(dbSum==1){
      firstClick = e.target.id;
      console.log(firstClick);
    }
    else if (dbSum == 2){
      var secondClick = e.target.id;
      console.log(secondClick);
      if (firstClick == secondClick && secondClick > arrMin){
        //得出第几个盒子被双击
        var dbClick = e.target.id;
        this.setData({ dbClick: dbClick});
        console.log(dbClick);
        console.log(e.target.id);
        clearInterval(timer3);
        timer3 = setInterval(function(){
          //判断何时响铃
          if (firstClick == secondClick && secondClick == arrMin) {
            clearInterval(timer3);
            wx.vibrateLong();

          }
        },5000);
        
      }
      
    }  
    
    

    

  },
  //获取经纬度距离
  distanceByLnglat: function (lng1, lat1, lng2, lat2){
      var radLat1 = Rad(lat1);
      var radLat2 = Rad(lat2);
      var a = radLat1 - radLat2;
      var b = Rad(lng1) - Rad(lng2);
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378137.0;// 取WGS84标准参考椭球中的地球长半径(单位:m)
      s = Math.round(s * 10000) / 10000;
      return s;
      // //下面为两点间空间距离（非球面体）
      // var value= Math.pow(Math.pow(lng1-lng2,2)+Math.pow(lat1-lat2,2),1/2);
      // alert(value);
      function Rad(d) {
        return d * Math.PI / 180.0;
      }

    
  },
  //end 获取经纬度距离

  //查看线路
  route:function(){
    var that=this;
    this.setData({height:100});
    //获取节点信息
    var query = wx.createSelectorQuery();
    console.log('motai-top节点信息');

    query.select('.motai-top').boundingClientRect();
    query.selectViewport('.motai').boundingClientRect();
    query.select('.motai-content-all').boundingClientRect();
    query.exec(function (res) {
      console.log(res)
      mtHeight = res[0].height;
      that.setData({ mtHeight: mtHeight+20});
      mtBox = res[1].top;
      mtContent = res[2].height;
      //console.log(res[1]);
    })

    console.log('motai-top节点信息');
    
  },
  //关闭查看
  cancle:function(){
    this.setData({ height: 0 });
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
  
  //点击出现账单
  bindLeft: function () {
    wx.navigateTo({
      url: '../userinfo/userinfo',
    })

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  //点击结束行程
  bindEnd:function(){
    var that = this;
    this.setData({ disabled: true }); 
    //判断是否允许定位
    //判断用户是否授权
    wx.authorize({
      scope: 'scope.userLocation',
      success: function () {
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '没有授权获取地理位置，不能正常使用，是否允许打开地理位置？',
          confirmText: '允许',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              wx.openSetting();

            } else if (res.cancel) {
              wx.showModal({
                title: '提示',
                content: '没有授权获取地理位置，不能正常使用',
              });

            }
          }
        })

      }
    });
    //end判断用户是否授权
    //判断是否允许
    //提示信息
    wx.showLoading({
      title: '正在获取位置...',
    });
    //end提示
    console.log('userId');
    console.log(userId);
    console.log('userId');
    //获取经纬度
    wx.getLocation({
      type: 'gcj02',
      fail:function(){
        wx.hideLoading();
        that.setData({ disabled: false }); 
        wx.showModal({
          title: '信息',
          content: '获取不到位置信息，请确认您的gps已经打开',
        }); 
      },
      success: function (res) {
        //下车请求
        wx.request({
          url: 'https://www.wetripay.com/xcxApp/api/xcx/xcxgetoff',
          method:'POST',
          data:{
            'uid': userId,
            'lon':res.longitude,
            'lat':res.latitude
          },
          header:{
            'content-type': 'application/x-www-form-urlencoded',
            'authorization': app.globalData.authorization,
            'version': '5000',
            'platform': 'xcx'
          },
          fail:function(res){
            wx.hideLoading();
            wx.redirectTo({
              url: '../welcome/welcome',
            });
          },
          success:function(res){
            //隐藏
            wx.hideLoading();
            that.setData({ disabled: false });
            //返回的数据
            //100下车成功
            console.log('下车返回参数');
            console.log(res);
            console.log('下车返回参数');
            if (res.data && res.data.data && res.data.data.tcode && res.data.data.tcode == '100'){
              console.log('下车成功');
              console.log(res);
              console.log('下车成功');
              //获取数据并跳转到end页面
              wx.removeStorage({
                key: 'getontime',
                success: function(res) {},
              });
              wx.setStorage({
                key: 'getontime',
                data: res.data.data.getontime.slice(0, 16),
              });
              wx.removeStorage({
                key: 'remark',
                success: function(res) {},
              });
              wx.setStorage({
                key: 'remark',
                data: res.data.data.remark,
              });
              wx.removeStorage({
                key: 'cost',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'cost',
                data: res.data.data.cost,
              });
              wx.removeStorage({
                key: 'name',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'name',
                data: res.data.data.stop,
              });
              wx.removeStorage({
                key: 'bid',
                success: function (res) { },
              });
              wx.setStorage({
                key: 'bid',
                data: res.data.data.bid,
              });
              wx.redirectTo({
                url: '../end/end',
              });
               
              
              
         
            }//end100下车成功
            //300
            else if (res.data && res.data.data && res.data.data.tcode && res.data.data.tcode == '300'){
              //获取数据并跳转到end页面
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
              wx.redirectTo({
                url: '../end/end',
              });
            // end 把数据放到缓存
            }//end300账单信息
            //其他状态
            else{
              wx.showModal({
                title: '信息',
                content: res.data.message,
              })
            }
            //end其他状态

            //end 返回的数据

          },
        })

        //end 下车请求    
      }
    })
    //end 获取经纬度
  },
  onLoad: function (options) {
    var that = this;
    //获取手机号,用户id
    wx.getStorage({
      key: 'phone',
      success: function(res) {
        that.setData({phone:res.data});
      },
    });
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        userId = res.data;
      },
    })

    //end 获取手机号,用户id

    //判断用户是否授权
    wx.authorize({
      scope: 'scope.userInfo',
      success: function (res) {
        console.log(res);
        console.log('判断用户是否授权');
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '没有授权获取昵称头像信息,是否允许获取昵称头像信息？',
          confirmText: '允许',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting();
            } else if (res.cancel) {

            }
          }
        })
      }
    });
    //end判断用户是否授权
    //获取用户信息，头像，昵称
    wx.getUserInfo({
      success: function (res) {
        that.setData({nickName: res.userInfo.nickName});
        that.setData({avatarUrl: res.userInfo.avatarUrl})
      }
    });
    // end 获取用户信息，头像，昵称
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
      success:function(res){
        if (res.data && res.data.data && res.data.data.stcode && res.data.data.stcode == '200'){
          wx.redirectTo({
            url: '../main/main',
          })
        }
        else if (res.data && res.data.data && res.data.data.stcode && res.data.data.stcode == '300'){
          wx.redirectTo({
            url: '../end/end',
          })
        }
      }
    })
    //end 判断该页面的状态
    
    console.log('重新刷新的页面');
    var that = this;
    //判断用哪张图片
    //获取用户信息，头像，昵称
    wx.getUserInfo({
      success: function (res) {
        that.setData({ nickName: res.userInfo.nickName });
        that.setData({ avatarUrl: res.userInfo.avatarUrl });
        that.setData({ boxImage: false });
        that.setData({ userImage: true }); 
      }
    })
    // end 获取用户信息，头像，昵称
    //判断用哪张图片
    
    //得到缓存乘车信息
    wx.getStorage({
      key: 'busline',
      success: function (res) {
        that.setData({ busline:res.data});
        console.log(res.data)
      },
    })
    //
    wx.getStorage({
      key: 'price',
      success: function (res) {
        that.setData({ price: res.data })
      },
    })
    //
    wx.getStorage({
      key: 'start',
      success: function (res) {
        that.setData({ start: res.data });
      },
    })
    //
    //
    wx.getStorage({
      key: 'end',
      success: function (res) {
        that.setData({ end: res.data });
      },
    })
    //
    //end得到缓存乘车信息
    //获取用户手机操作系统版本
    wx.getSystemInfo({
      success: function (res) {
        system = res.system;
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
    //获取线路详情参数lineid和dir
    wx.getStorage({
      key: 'dir',
      success: function (res) {
        var dir = res.data;
        wx.getStorage({
          key: 'lineid',
          success: function (res) {
            //获取线路详情
            console.log(res.data);
            console.log(dir);
            console.log(app.globalData.authorization);
            wx.request({
              url: 'https://www.wetripay.com/xcxApp/api/bus/busstop',
              method: 'GET',
              data: {
                'bid': res.data,
                'dir': dir,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'authorization': app.globalData.authorization,
                'version': '5000',
                'platform': 'xcx'
              },
              fail: function (res) {
                console.log(res);
              },
              success: function (res) {
                console.log('线路详情');
                //console.log(res.data.data.list);
                console.log(res.data.data.list);
                that.setData({ list: res.data.data.list });
                var arrList = res.data.data.list;
                console.log(arrList);
                that.setData({ leftBottom: arrList.length });
                console.log(arrList[0].lng);
                console.log('线路详情' + res.data.data.list);
                var sum;
                //获取最短距离
                wx.getLocation({
                  type: "gcj02",
                  success: function (res2) {
                    var disArr = [];
                    var disArr1 = [];
                    for (var i = 0; i < arrList.length; i++) {
                      console.log('i的值：' + i);
                      var lng1 = res2.longitude;
                      var lat1 = res2.latitude;
                      var lng2 = arrList[i].lng;
                      var lat2 = arrList[i].lat;
                      console.log('lng1:' + lng1);
                      var distance = that.distanceByLnglat(lng1, lat1, lng2, lat2);
                      
                      disArr.push(distance);
                      disArr1.push(distance);
                      console.log('没改变之前的数组');
                      console.log(disArr);
                      console.log('没改变之前的数组');

                    }

                    disArr.sort(sortNumber);
                    function sortNumber(a, b) {
                      return a - b
                    }
                    console.log('改变后数组');
                    console.log(disArr);
                    console.log(disArr1);
                    console.log('改变后的数组');
                    //获取数组最小值的下标
                    for (var j = 0; j < disArr.length; j++) {
                      console.log('最小数组的小标：' + j);
                      if (disArr1[j] == disArr[0]) {
                        var index = j;
                        arrMin = index;
                        console.log('得到最小数组的下标：' + index);
                        console.log(typeof (index));


                      }
                    }


                    that.setData({ arrMin: index });

                    //end 获取数组最小值的下标

                  },
                })
                //end 获取最短距离     
              },
            })
            //end获取线路详情


          },
        })
      },
    })
    //busline和dir
    /*//发送下车请求
    var timestamp = (new Date()).valueOf();
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        console.log(tmUserid);
        console.log(res.longitude);
        console.log(res.latitude);
        console.log(timestamp);
        //下车请求
        wx.request({
          url: 'https://www.wetripay.com/ebusApp/api/userTracking?xcxReportTracking',
          method: 'POST',
          data: {
            'userid': tmUserid,
            'lon': res.longitude,
            'lat': res.latitude,
            'ts': timestamp
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'authorization': app.globalData.authorization,
            'version': '5000',
            'platform': 'xcx'
          },
          success: function (res) {
            console.log(res);
            console.log('发送定时位置成功');
            if (res.data.data.tcode == '220') {
              wx.navigateTo({
                url: '../main/main',
              })
            }
            else if (res.data.data.tcode == '1000') {
              wx.navigateTo({
                url: '../welcome/welcome',
              })
            }
          }
        })

      },
    })
      //end 发送下车请求*/
   
    //stindex
    wx.getStorage({
      key: 'stindex',
      success: function (res) {
        var stindexNum = parseInt(res.data);
        console.log(typeof (stindexNum));
        console.log('开始位置:'+stindexNum);
        that.setData({ stindex: stindexNum});
      },
    })
    // end  stindex
    /*//定时发送定位
    var tmUserid = wx.getStorageSync('userId');
    clearInterval(timer2);
    timer2 = setInterval(function(){
      var timestamp = (new Date()).valueOf();
      console.log('时间戳：' + timestamp);
      console.log('用户id:' + tmUserid);
      //发送下车请求
      wx.getLocation({
        type:"gcj02",
        success: function(res) {
          console.log(tmUserid);
          console.log(res.longitude);
          console.log(res.latitude);
          console.log(timestamp);
          //下车请求
          wx.request({
            url: 'https://www.wetripay.com/ebusApp/api/userTracking?xcxReportTracking',
            method: 'POST',
            data: {
              'userid': tmUserid,
              'lon': res.longitude,
              'lat': res.latitude,
              'ts': timestamp
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'authorization': app.globalData.authorization,
              'version': '5000',
              'platform': 'xcx'
            },
            success:function(res){
              console.log(res);
              console.log('发送定时位置成功');
              if(res.data.data.tcode == '220'){
                wx.navigateTo({
                  url: '../main/main',
                })
              }
              else if(res.data.data.tcode == '1000'){
                wx.navigateTo({
                  url: '../welcome/welcome',
                })
              }
            }
          })

        },
      })
      //end 发送下车请求
    },30000);
    
    // end  定时发送定位*/
    //获取线路详情参数lineid和dir
    timer2 = setInterval(function(){
      wx.getStorage({
        key: 'dir',
        success: function (res) {
          var dir = res.data;
          wx.getStorage({
            key: 'lineid',
            success: function (res) {
              //获取线路详情
              console.log(res.data);
              console.log(dir);
              console.log(app.globalData.authorization);
              wx.request({
                url: 'https://www.wetripay.com/xcxApp/api/bus/busstop',
                method: 'GET',
                data: {
                  'bid': res.data,
                  'dir': dir,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'authorization': app.globalData.authorization,
                  'version': '5000',
                  'platform': 'xcx'
                },
                fail: function (res) {
                  console.log(res);
                },
                success: function (res) {
                  console.log('线路详情');
                  //console.log(res.data.data.list);
                  console.log(res.data.data.list);
                  that.setData({ list: res.data.data.list });
                  var arrList = res.data.data.list;
                  console.log(arrList);
                  that.setData({ leftBottom: arrList.length });
                  console.log(arrList[0].lng);
                  console.log('线路详情' + res.data.data.list);
                  var sum;
                  //获取最短距离
                  wx.getLocation({
                    type: "gcj02",
                    success: function (res2) {
                      var disArr = [];
                      var disArr1 = [];
                      for (var i = 0; i < arrList.length; i++) {
                        console.log('i的值：' + i);
                        var lng1 = res2.longitude;
                        var lat1 = res2.latitude;
                        var lng2 = arrList[i].lng;
                        var lat2 = arrList[i].lat;
                        console.log('lng1:' + lng1);
                        var distance = that.distanceByLnglat(lng1, lat1, lng2, lat2);
                        disArr.push(distance);
                        disArr1.push(distance);
                        console.log('没改变之前的数组');
                        console.log(disArr);
                        console.log('没改变之前的数组');

                      }

                      disArr.sort(sortNumber);
                      function sortNumber(a, b) {
                        return a - b
                      }
                      console.log('改变后数组');
                      console.log(disArr);
                      console.log(disArr1);
                      console.log('改变后的数组');
                      //获取数组最小值的下标
                      for (var j = 0; j < disArr.length; j++) {
                        console.log('最小数组的小标：' + j);
                        if (disArr1[j] == disArr[0]) {
                          var index = j;
                          arrMin = index;
                          console.log('得到最小数组的下标：' + index);
                          console.log(arrMin);
                          console.log(typeof (index));


                        }
                      }


                      that.setData({ arrMin: index });

                      //end 获取数组最小值的下标

                    },
                  })
                  //end 获取最短距离    
                },
              })
              //end获取线路详情


            },
          })
        },
      })
    //busline和dir
    },5000);
    

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timer2);
    clearInterval(timer3);
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer2);
    clearInterval(timer3);
  
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