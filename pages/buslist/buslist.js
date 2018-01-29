// buslist.js
var busline;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  //跳转到公交线路详情
  bindbus:function(e){
    var busurl = '../busline/busline?start=' + e.currentTarget.dataset.start + '&end=' + e.currentTarget.dataset.end + '&km=' + e.currentTarget.dataset.km+ '&bus='+e.currentTarget.dataset.bus + '&busline=' + busline;
    wx.redirectTo({
      url: busurl,
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('map页面传递的参数');
    console.log(options);
    busline = options.buslist;
    var buslist = options.buslist;
    var buslist = JSON.parse(buslist);
    console.log(buslist);
    //公交数据放入数组
    var transits = buslist.transits;
    var busarray = [];
    for (var i = 0; i < transits.length; i++) {
      var busobj = {};
      var arr = [];
      busobj.cost = transits[i].cost;
      busobj.distance = (transits[i].distance / 1000).toFixed(2);
      busobj.duration = (transits[i].duration / 60).toFixed(0);
      busobj.work = (transits[i].walking_distance / 1000).toFixed(2);
      for(var j=0;j<transits[i].segments.length;j++){
        var a = {};
        var b = [];
        if (transits[i].segments[j].bus.buslines && transits[i].segments[j].bus.buslines[0]){
          //var a = transits[i].segments[j].bus.buslines[0].name;
          arr.push(a);
          for (var z = 0; z < transits[i].segments[j].bus.buslines.length;z++){
            var c = transits[i].segments[j].bus.buslines[z].name;
            var d = '';
            //去除括号
            var carr = c.split('');
            console.log('字符串转化数组');
            console.log(carr);
            for(var s = 0;s<carr.length;s++){
              if (carr[s] != '('){
                d += carr[s];
              }
              else if(carr[s] == '('){
                
                break;
              }
            }
            //end 去除括号
          
            b.push(d);
          }
          arr[j].apartbus = b;
          arr[j].apartbus_length = b.length;
        }
    
      }
      busobj.bus = arr;
      console.log('公交线路详情');
      console.log(busobj);
      busarray.push(busobj);
      
    }
    console.log('公交线路数组');
    console.log(busarray);
    
     
    //end 公交数据放入数组
    this.setData({ busarray: buslist.transits});
    this.setData({start:options.startlocation});
    this.setData({end:options.endlocation});
    var alldistance = (buslist.distance / 1000).toFixed(2);
    var taxiprice = (buslist.taxi_cost/1).toFixed(1);
    this.setData({ km: alldistance});
    this.setData({ taxiprice:taxiprice});
    this.setData({ busarray: busarray});

  
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