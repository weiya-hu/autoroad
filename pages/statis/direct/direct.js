// pages/statis/direct/direct.js
var wxCharts = require('../../../utils/wxcharts.js');
var ringChart0 = null, ringChart1 = null, ringChart2 = null;
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist:[],//正文数据列表
    sensorname:[],//设备名列表
    sensoridarr:[],//设备id列表
    sensor:'',//当前设备名
    height:'',//底部高度
    pullcontentshow:false,//下拉是否显示
    sensoridx:null,//被选中设备下标
    canvasidarr: ['ringcanvas0', 'ringcanvas1', 'ringcanvas2'],//图表id
    imagePath: [],//canvas转换成图片的图片url列表
  },
  // 现在这个页面隐藏了，要显示去stsdetail释放隐藏，然后这个页面图表显示功能和更新功能完成，用canvasc生成图片显示还没完成，另外后台接口也有问题
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start();
    this.height();
    this.initchart();
  },
  start(){
    var page = getCurrentPages(), options = page[page.length - 1].options, token = wx.getStorageSync('token'),that=this;
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.type + '_' + options.title
    })
    var data = { typeName: options.type, itemId: options.id}
    app.questUrl('jeecg-boot/statistics/getOneDetails', 'post', token, data).then(function (res) {
      console.log(res);
      that.setData({
        datalist:res.data.result,
        sensor: options.sensor,
        sensorname: wx.getStorageSync('sensorname'),
        sensoridarr: wx.getStorageSync('sensoridarr'),
        sensoridx: options.sensoridx,
        typeName: options.type
      })
      that.update(options.sensoridx)
    })
  },
  //获取底部高度
  height() {
    let ht = "";
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        ht = res.windowHeight
      },
    })
    var query = wx.createSelectorQuery();
    var that = this;
    query.select('.nav').boundingClientRect(function (res) {
      console.log(res)
      that.setData({
        height: ht - res.height
      })
    }).exec();
  },
  //下拉显示与否
  pulldown(){
    this.setData({
      pullcontentshow: !this.data.pullcontentshow
    })
  },
  //选择设备
  selectsensor(e){
    var idx = e.currentTarget.dataset.idex, sensorname = e.currentTarget.sensorname
    this.pulldown()//下拉显示与否
    this.update(idx)//更新数据
  },
  //更新数据
  update(idx){
    var token = wx.getStorageSync('token'), that = this;
    var data = { typeName: this.data.typeName, itemId:this.data.sensoridarr[idx]}
    app.questUrl('jeecg-boot/statistics/getOneDetails', 'post', token, data).then(function (res) {
      console.log(res);
      that.setData({
        datalist: res.data.result,
        sensoridx: idx,//切换被选中的设备
        imagePath: []
      })
      that.updateData(res.data.result.history)
    })
  },
  //更新图表
  updateData(list) {
    console.log(list)
    var data = {}, isshow;
    for (var i = 0; i < list.length; i++) {
      //传过来的数据小数点太多，做一个处理避免显示有错
      var onlines = list[i].online.toString().slice(0, 5)
      var online = Math.round(onlines * 100) + '%';
      console.log(online)
      data = {
        title: {
          name: online
        },
        series: list[i].detail
      }
      //图表更新
      if (i === 0) {
        ringChart0.updateData(data)
      } else if (i === 1) {
        ringChart1.updateData(data)
      } else if (i === 2) {
        ringChart2.updateData(data)
      }
      //检查在线率是否有数据
      if (list[i].detail[0].data > 0 || list[i].detail[1].data > 0) {
        isshow = true
      } else {
        isshow = false
      }
      this.setData({
        isshow: isshow
      })
    }
    console.log(data)
    // this.canvas()//canvas生成图片
  },

  //每个chart初始
  initchart() {
    //设置canvas宽度
    var windowWidth = 320, height = 200;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth ;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    ringChart0 = new wxCharts({
      animation: true,
      canvasId: 'ringcanvas0',
      type: 'ring',
      extra: {
        ringWidth: 10,//圆环的宽度
        pie: {
          offsetAngle: 180//圆环的角度
        }
      },
      title: {
        name: '70%',
        color: '#7cb5ec',
        fontSize: 15
      },
      subtitle: {
        name: '在线率',
        color: '#666666',
        fontSize: 15
      },
      series: [{
        name: '在线',
        data: 15,
        stroke: true
      }, {
        name: '不在线',
        data: 35,
        stroke: true
      }],
      disablePieStroke: true,
      width: windowWidth,
      height: height,
      dataLabel: false,
      legend: true,
      padding: 0,
    });
    ringChart1 = new wxCharts({
      animation: true,
      canvasId: 'ringcanvas1',
      type: 'ring',
      extra: {
        ringWidth: 10,//圆环的宽度
        pie: {
          offsetAngle: 180//圆环的角度
        }
      },
      title: {
        name: '70%',
        color: '#7cb5ec',
        fontSize: 15
      },
      subtitle: {
        name: '在线率',
        color: '#666666',
        fontSize: 15
      },
      series: [{
        name: '在线',
        data: 15,
        stroke: false
      }, {
        name: '不在线',
        data: 35,
        stroke: false
      }],
      disablePieStroke: true,
      width: windowWidth,
      height: height,
      dataLabel: false,
      legend: true,
      padding: 0
    });
    ringChart2 = new wxCharts({
      animation: true,
      canvasId: 'ringcanvas2',
      type: 'ring',
      extra: {
        ringWidth: 10,//圆环的宽度
        pie: {
          offsetAngle: 180//圆环的角度
        }
      },
      title: {
        name: '70%',
        color: '#7cb5ec',
        fontSize: 15
      },
      subtitle: {
        name: '在线率',
        color: '#666666',
        fontSize: 15
      },
      series: [{
        name: '在线',
        data: 15,
        stroke: false
      }, {
        name: '不在线',
        data: 35,
        stroke: false
      }],
      disablePieStroke: true,
      width: windowWidth,
      height: height,
      dataLabel: false,
      legend: true,
      padding: 0
    });
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