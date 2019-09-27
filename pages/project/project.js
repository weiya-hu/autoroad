// pages/project/project.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',//屏幕高度
    width: '',//屏幕宽度
    index: -1,//导航active初始值
    title:'',//上一页传来的信息
    activelist: [],//导航active
    projectlist: [],
    projectlistshow:true,//当前项目是否有当前模块
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start()
    this.setData({
      height: app.globalData.heightall,
    })
  },
  start: function () {
    let token = wx.getStorageSync('token'), that = this, activelist = [];
    let pages = getCurrentPages();
    let title = pages[pages.length - 1].options.title;
    this.settitle(title)
    let data = this.getdat(title)
    app.questUrl('jeecg-boot/infrastructure/bidsection/findWithChildrenByUsername', 'GET', token,data).then(function (res) {
      console.log(res)
      if (res.data) {
        for (let i = 0; i < res.data.result.length; i++) {
          activelist: activelist.push(false)
        }
        that.setData({
          projectlist: res.data.result,
          activelist: activelist,
          title:title,
          projectlistshow: res.data.result.length>0?true:false
        })
      }
    })
  },
  settitle:function(val){
    switch (val) {
      case 'video':
        wx.setNavigationBarTitle({
          title: '视频监控'//页面标题为路由参数
        })
        break;
      case 'person':
        wx.setNavigationBarTitle({
          title: '人员管理'//页面标题为路由参数
        })
        break;
      case 'safe':
        wx.setNavigationBarTitle({
          title: '安全步距'//页面标题为路由参数
        })
        break;
      case 'gas':
        wx.setNavigationBarTitle({
          title: '有害气体'//页面标题为路由参数
        })
        break;
      case 'envir':
        wx.setNavigationBarTitle({
          title: '环境监测'//页面标题为路由参数
        })
        break;
      case 'messageto':
        wx.setNavigationBarTitle({
          title: '信息上报'//页面标题为路由参数
        })
        break;
    }
  },
  getdat(val){
    let data={}
    switch(val){
      case 'video': data = { menu:'视频监控'};break;
      case 'person': data = { menu: '人员管理' }; break;
      case 'safe': data = { menu: '安全步距' }; break;
      case 'gas': data = { menu: '有害气体' }; break;
      case 'envir': data = { menu: '环境监测' }; break;
      case 'messageto': data = { menu: '信息上报' }; break;
    }
    return data
  },
  show: function (e) {
    let indx = e.currentTarget.dataset.indx, activelist = this.data.activelist;
    let is = !activelist[indx];
    for (let i = 0; i < activelist.length; i++) {
      activelist[i] = false
    }
    activelist[indx] = is
    this.setData({
      activelist: activelist
    })
    console.log(this.data.activelist)
  },
  toprojectdet: function (e) {
    let item = e.currentTarget.dataset.item,title=this.data.title,url='';
    console.log(item)
    let project = e.currentTarget.dataset.project;
    let name = project + '-' + item.name//传递页面title值
    switch (title) {
      case 'video':url ='../video/videoproject/videoproject?id=';break;
      case 'person': url = '../person/person?id='; break;
      case 'safe': url = '../safe/safe?id='; break;
      case 'gas': url = '../gas/gas?id='; break;
      case 'envir': url = '../envir/envir?id='; break;
      case 'messageto': url = '../messageto/messageto?id='; break;
    }
    wx.navigateTo({
      url: url + item.id + '&name=' + name,
    })
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