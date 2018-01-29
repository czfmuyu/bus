// qqmap.js
var qqmapsdk;
var myAmapFun;
var mapCtx;

var distancearr;
var latvalue;
var lngvalue;
var fjbus;
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var amapFile = require('../../libs/amap-wx.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 0,
    bollen:true

  },
  //点击控件时触发
  bindcontroltap: function (e) {
    console.log('点击控件');
    console.log(e);
    mapCtx.moveToLocation();
  },
  
  //关闭模态框
  bindclose:function(){
    this.setData({width:0});
    this.setData({ bollen: true });
  },
  //跳转地图
  bindnext: function (e) {
    var that = this;
    var markersArr = [];
    console.log('first array');
    console.log(markersArr);
    this.setData({ width: 100 });
    this.setData({ bollen:false});
    console.log(e);
    var index = e.currentTarget.dataset.click;
    //得到前后数组
    var firstobj = distancearr[index].from;
    var secondobj = distancearr[index].to;
    var firststring = firstobj.lng + ',' + firstobj.lat;
    var secondstring = secondobj.lng + ',' + secondobj.lat;

    console.log(typeof (firststring));
    console.log('开始位置222');
    console.log(firststring);
    console.log(typeof (secondstring));
    console.log(secondstring);
    //得到当前点击数据
    this.setData({ title: fjbus[index].name });
    this.setData({ address: fjbus[index].address });
    //this.setData({ distance2: "距您" + distancearr[index].distance + "米" });

    /*this.setData({
      markers2: [{
        iconPath: '../images/point.png',
        latitude: markerlat2,
        longitude: markerlng2,
        width: 50,
        height: 50
      }]
    });*/
    //线路规划
    myAmapFun.getWalkingRoute({
      origin: firststring,
      destination: secondstring,
      success: function (data) {
        console.log('线路规划');
        console.log(data);
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var polen = steps[i].polyline.split(';');
            for (var j = 0; j < polen.length; j++) {
              points.push({
                longitude: parseFloat(polen[j].split(',')[0]),
                latitude: parseFloat(polen[j].split(',')[1])
              });
            }
          }
          //
          console.log('points数组');
          console.log(points);
          var polyline = [{
            points: points,
            color: "#0091ffAA",
            width: 5,
            arrowLine:true,
          }]
          that.setData({ polyline: polyline });
          console.log('路线规划数组');
          console.log(points);
          console.log('路线规划数组');
          //传输markers数组
          console.log('传输markers数组');
          var markerlat = firstobj.lat;
          var markerlng = firstobj.lng;
          var markerlat2 = secondobj.lat;
          var markerlng2 = secondobj.lng;
          console.log('得到前后数组');
          console.log(markerlat);
          console.log(markerlng);
          console.log(typeof (markerlat));
          
          var markersObj1 = {
            iconPath: '../images/origin@3x.png',
            latitude: points[0].latitude,
            longitude: points[0].longitude,
            //latitude: markerlat,
            //longitude: markerlng,
            width: 30,
            height: 30,
            id: 1,
            alpha: 0.5,
          }
          
          var arrindex = points.length-1
          var markersObj2 = {
            iconPath: '../images/point.png',
            //latitude: points[arrindex].latitude,
            //longitude: points[arrindex].longitude,
            latitude: markerlat2,
            longitude: markerlng2,
            width: 26,
            height: 26,
            id: 2,
            alpha: 0.8,
          };
          markersArr.push(markersObj1);
          markersArr.push(markersObj2);
          
          
          /*for (var i = 1; i < points.length; i++) {
            var markersObj = {
              iconPath: '../images/point.png',
              latitude: points[0].latitude,
              longitude: points[0].longitude,
              width: 30,
              height: 30,
              id: 1,
              alpha: 0.5,
              anchor: { x: 0.5, y: 0.5 }
            }
            markersObj.latitude = points[i].latitude,
              markersObj.longitude = points[i].longitude,
              console.log(1111111111);
            console.log(markersObj);
            markersArr.push(markersObj);
          }*/
          
          that.setData({
            markers1: markersArr
          });
          console.log('markers1的数组');
          console.log(markersArr);
          //end

          //获取地图中心经纬度
          that.setData({ latitude: points[0].latitude });
          that.setData({ longitude: points[0].longitude });
          //end
        }
      }
    });
    //end 线路规划
    /*var firstarr = {};
   var secondarr = {};
   firstarr.latitude = firstobj.lat;
   firstarr.longitude = firstobj.lng;
   secondarr.latitude = secondobj.lat;
   secondarr.longitude = secondobj.lng;
   this.setData({ latitude: firstobj.lat});
   this.setData({ longitude: firstobj.lng });
  
   points.push(firstarr);
   points.push(secondarr);
   console.log('开头数组');
   console.log(points);
   */

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'DJXBZ-E74RG-OY6QR-I6YL3-HHVKS-EQBH3'
    });
    myAmapFun = new amapFile.AMapWX({ key: 'c3a5d23c3fa48164f00a20485b9bea0d' });
    //控制地图组件
    mapCtx = wx.createMapContext('mymap');

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
    wx.showToast({
      title: '正在加载',
      icon:'loading',
      mask:true
    })
    //地图controls
    var res = wx.getSystemInfoSync();
    var controlswidth = res.screenWidth - 70;
    this.setData({
      controls: [
        {

          position: {
            left: 30,
            top: 20,
            width: 40,
            height: 40
          },
          iconPath: '../images/compass@3x.png'
        },
        {
          position: {
            left: controlswidth,
            top: 20,
            width: 40,
            height: 40
          },
          iconPath: '../images/lacation@3x.png',
          id: 1,
          clickable: true
        }
      ]
    });
    //高德附近公交
    myAmapFun.getPoiAround({
      querykeywords:'公交站',
      success:function(res){
        var array2 = [];
        console.log('高德附近公交');
        console.log(res);
        console.log('附近的公交');
        console.log(res);
        fjbus = res.markers;
        that.setData({ array: res.markers });
        var array1 = res.markers;
        //获取到站距离
        for (var i = 0; i < array1.length; i++) {

          (function (i) {

            latvalue = array1[i].latitude;
            lngvalue = array1[i].longitude;

            //console.log(array2);   
          })(i)
          var location2 = {};
          location2.latitude = latvalue;
          location2.longitude = lngvalue;

          console.log(1111111111111);
          console.log(latvalue);
          console.log(location2.latitude)
          console.log(location2);
          console.log(1111111111111);
          array2.push(location2);
          console.log('经纬度数组');
          console.log(array2);
          console.log('经纬度数组');
        }
        //测量距离
        qqmapsdk.calculateDistance({
          to: array2,
          success: function (res) {
            console.log('到站距离');
            console.log(res);
            distancearr = res.result.elements;
            console.log('到站距离');
            that.setData({ distance: res.result.elements });
            wx.hideToast();
          }
        })
      }
    });

    //搜索附近公交
    /*qqmapsdk.search({
      keyword: '公交站',
      success: function (res) {
        console.log('附近的公交');
        console.log(res);
        fjbus = res.data;
        that.setData({ array: res.data });
        var array1 = res.data;
        //获取到站距离
        for (var i = 0; i < array1.length; i++) {

          (function (i) {

            latvalue = array1[i].location.lat;
            lngvalue = array1[i].location.lng;

            //console.log(array2);   
          })(i)
          var location2 = {};
          location2.latitude = latvalue;
          location2.longitude = lngvalue;

          console.log(1111111111111);
          console.log(latvalue);
          console.log(location2.latitude)
          console.log(location2);
          console.log(1111111111111);
          array2.push(location2);
          console.log('经纬度数组');
          console.log(array2);
          console.log('经纬度数组');
        }
        qqmapsdk.calculateDistance({
          to: array2,
          success: function (res) {
            
            console.log('到站距离');
            console.log(res);
            distancearr = res.result.elements;
            console.log('到站距离');
            that.setData({ distance: res.result.elements });
            wx.hideToast();

          }
        })

      }
    });*/
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