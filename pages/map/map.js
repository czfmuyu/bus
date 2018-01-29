// map.js
var amapFile = require('../../libs/amap-wx.js');
var startlatitude;
var startlongitude;
var myAmapFun;
var timer ;
var recordarr = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startlocation:'我的位置',
    endlocation:'输入终点',
    motaishow:false
  },
  //打开清空历史记录模态框
  bindopen:function(){
    this.setData({ motaishow: true });
    
  },
  //关闭模态框
  catchout:function(){
    this.setData({ motaishow: false });
    
  },
  //删除历史记录
  catchfinish:function(){
    wx.setStorageSync('record', []);

    this.onShow();
    this.setData({ motaishow: false });
    
  },
  //点击跳转到历史记录
  bindrecord:function(e){
    clearInterval(timer);
    var that = this;
    console.log('历史记录');
    console.log(e);
    //公交路线规划
    myAmapFun.getTransitRoute({
      origin: e.currentTarget.dataset.record.origin,
      destination: e.currentTarget.dataset.record.destination,
      city: '广州',
      success: function (data) {
        console.log('公交路线规划');
        console.log(that.data.startlocation);
        var data = JSON.stringify(data);
        console.log(typeof (data));
        console.log(data);
        var start = e.currentTarget.dataset.record.startname;
        var end = e.currentTarget.dataset.record.endname;

        //跳转公交列表
        var url = '../buslist/buslist?buslist=' + data + "&startlocation=" + start + "&endlocation=" + end;
        wx.navigateTo({
          url: url,
        })
      }
    })
        //end*/
    

  },
  
  //开始位置
  bindstart:function(){
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log('当前位置');
        console.log(res);
        startlatitude = res.latitude;
        startlongitude = res.longitude;
        that.setData({ startlocation:res.name});
      },
    })
  },
  //终点位置
  bindend:function(){
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log('终点位置');
        console.log(res);
        that.setData({ endlocation:res.name});
        var endlongitude = res.longitude;
        var endlatitude = res.latitude;
        var origin = startlongitude+','+startlatitude;
        var destination = endlongitude + ',' + endlatitude;
        console.log('开始位置坐标');
        console.log(origin);
        //记录搜索信息
        var recordobj = {};
        recordobj.origin = origin;
        recordobj.destination = destination;
        recordobj.startname = that.data.startlocation;
        recordobj.endname = res.name;
        recordarr.unshift(recordobj);
        wx.setStorage({
          key: 'record',
          data: recordarr,
        })
        //end 记录搜索信息
        //公交路线规划
        myAmapFun.getTransitRoute({
          origin: origin,
          destination: destination,
          city:'广州',
          success: function(data){
            console.log('公交路线规划');
            console.log(that.data.startlocation);
            var data = JSON.stringify(data); 
            console.log(typeof(data));
            console.log(data);
            
            //跳转公交列表
            var url = '../buslist/buslist?buslist=' + data + "&startlocation=" + that.data.startlocation +"&endlocation="+that.data.endlocation;
            wx.navigateTo({
              url: url,
            })
          }
        })
        //end*/
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //高德地图
    //myAmapFun = new amapFile.AMapWX({ key: 'e45f5cd55eb0bbf64c2ef693ace4437f'});
    myAmapFun = new amapFile.AMapWX({ key: 'c3a5d23c3fa48164f00a20485b9bea0d' });
    //我的位置
    wx.getLocation({
      success: function (res) {
        startlatitude = res.latitude;
        startlongitude = res.longitude;

      },
    });
    //
    //wx.setStorageSync('record', [])
  
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
    var that = this;
    //得到搜索缓存信息
    wx.getStorage({
      key: 'record',
      success: function(res) {
        console.log('得到缓存信息');
        console.log(res.data);
        
        recordarr = res.data;
        that.setData({record:res.data});
        that.setData({norecord:res.data.length});

      },
      fail:function(res){
        console.log('错误的信息');
        console.log(res);
      }
    })
    //文字闪烁
    var color = 'gray';
    clearInterval(timer);
      timer= setInterval(function () {
      if (color == '#ccc') {
        color = 'white';
        that.setData({ color: color });
        console.log('得到的颜色');
        console.log(color);
      }
      else {
        color = '#ccc';
        console.log(color);
        that.setData({ color: color });
      }


    }, 500);

    
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timer);
  
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