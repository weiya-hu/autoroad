// pages/statis/stsdetail/stsdetail.js
var wxCharts = require('../../../utils/wxcharts.js');
const app=getApp()
var ringChart0 = null, ringChart1 = null, ringChart2 = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      { name: '当前', value: 0 },
      { name: '近一周', value: 7 },
      { name: '近半月', value: 15 },
      { name: '近一月', value: 30 }],
    statisobj:[],
    navactive:7,//激活状态的nav的值
    canvasidarr: ['ringcanvas0','ringcanvas1','ringcanvas2'],//图表id
    title:'',//页面title
    id:'',//标段id
    sensorname:[],//传感器名arr
    nameidarrs:[],
    imagePath:[],//canvas转换成图片的图片url列表
    isshow:null,//在线率是否有数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start();
    this.initchart()
  },
  start(){
    var page = getCurrentPages(), id = page[page.length - 1].options.id, sdname = page[page.length - 1].options.sdname, token=wx.getStorageSync('token');
    var data = { bidsectionId: id, dayTime: this.data.navactive},that=this;
    wx.setNavigationBarTitle({
      title: sdname
    })
    app.questUrl('jeecg-boot/statistics/getOnlineByDateAndBidsection','post',token,data).then(function(res){
      console.log(res);
      that.setData({
        statisobj:res.data.result,
        title: sdname,
        id:id
      })
      that.updateData(res.data.result);//更新图表
      that.sensorname(res.data.result);//获取设备名
    })
  },
  //每个canvas生成图片统一函数
  canvas(){
    var canvasidarr = this.data.canvasidarr
    var ctx0 = wx.createCanvasContext(canvasidarr[0], this);
    var ctx1 = wx.createCanvasContext(canvasidarr[1], this);
    var ctx2 = wx.createCanvasContext(canvasidarr[2], this);
    ctx0.draw(true, () => {
      // 延迟保存图片，解决生成图片错位bug。     
      setTimeout(() => {
        this.canvasToTempImage(canvasidarr[0], 0);
      }, 1200);
    });
    ctx1.draw(true, () => {
      // 延迟保存图片，解决生成图片错位bug。     
      setTimeout(() => {
        this.canvasToTempImage(canvasidarr[1], 1);
      }, 1200);
    });
    ctx2.draw(true, () => {
      // 延迟保存图片，解决生成图片错位bug。     
      setTimeout(() => {
        this.canvasToTempImage(canvasidarr[2], 2);
      }, 1200);
    });
  },
  //canvas生成图片
  canvasToTempImage(canvasId,i) {
    var that=this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 260,
      height: 200,
      canvasId: canvasId,
      success: function (res) {
        var imagePath = that.data.imagePath;
        console.log(i)
        imagePath[i] = res.tempFilePath 
        that.setData({ imagePath: imagePath});
      },
      fail(res){
        console.log(res)
      }
    });
  },
  //跳转查看详情
  todirect(e){
    console.log(e)
    var type = e.currentTarget.dataset.type, idx = e.currentTarget.dataset.idx,value=e.detail.value,that=this;
    //将被选中的设备名列表存进内存，方便下次使用，不用再次请求，节省时间
    wx.setStorageSync('sensorname', this.data.sensorname[idx])
    wx.setStorageSync('sensoridarr', this.data.nameidarrs[idx])
    wx.navigateTo({
      url: '../direct/direct?type=' + type + '&title=' + that.data.title + '&id=' + that.data.nameidarrs[idx][value] + '&sensor=' + that.data.sensorname[idx][value]+ '&sensoridx='+idx +'&bidsid='+that.data.id
    }) 
  }, 
  //获取各个设备名
  sensorname(types){
    var types = this.data.statisobj.map((val) => { return val.title })
    console.log(types)
    var that = this, token = wx.getStorageSync('token');
    types.forEach((value, index) => { 
      var data={
        bidsectionId: this.data.id, typeName: value
      }
      var idx = index, sensorname = this.data.sensorname, nameidarrs = this.data.nameidarrs;
      app.questUrl('jeecg-boot/statistics/findByTypeAndBidsectionId', 'post', token, data).then(function (res) {
        console.log(res);

        var namearr = res.data.result.map(val => val.remark)
        var nameidarr = res.data.result.map(val => val.id)
        sensorname[idx] = namearr;
        nameidarrs[idx] = nameidarr
        that.setData({
          sensorname: sensorname,
          nameidarrs: nameidarrs
        })
        console.log(that.data.sensorname)
        console.log(that.data.nameidarrs)
      })
     
    })
  },
  //更新图表
  updateData(list) {
    console.log(list)
    var data={},isshow;
    for(var i=0;i<list.length;i++){
      //传过来的数据小数点太多，做一个处理避免显示有错
      var onlines= list[i].online.toString().slice(0,5)
      var online = Math.round(onlines * 100) + '%';
      console.log(online)
      data = {
        title: {
          name: online
        },
        series:list[i].detail
      }
      //图表更新
      if (i===0){
        ringChart0.updateData(data)
      }else if(i===1){
        ringChart1.updateData(data)
      } else if (i === 2) {
        ringChart2.updateData(data)
      }
      //检查在线率是否有数据
      if (list[i].detail[0].data > 0 || list[i].detail[1].data > 0){
        isshow=true
      }else{
        isshow = false
      }
      this.setData({
        isshow: isshow 
      })
    }
    console.log(data)
    this.canvas()//canvas生成图片
  },
  //切换nav
  navcheck(e){
    var val = e.currentTarget.dataset.val, that = this, token = wx.getStorageSync('token');
    this.setData({
      navactive:val,
      imagePath:[]//每次切换时canvas模拟图片清空显示canvas，初始为[]，不用清空
    })
    var data = { bidsectionId: this.data.id, dayTime: val}, that = this;
    app.questUrl('jeecg-boot/statistics/getOnlineByDateAndBidsection', 'post', token, data).then(function (res) {
      console.log(res);
      that.setData({
        statisobj: res.data.result
      })
      that.updateData(res.data.result)
    })
  },
  //每个chart初始
  initchart() {
    //设置canvas宽度
    var windowWidth = 320,height=200;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth-120 ;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    ringChart0 = new wxCharts({
      animation: true,
      canvasId: 'ringcanvas0',
      type: 'ring',
      extra: {
        ringWidth:10,//圆环的宽度
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
        ringWidth:10,//圆环的宽度
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