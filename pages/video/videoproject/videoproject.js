// pages/video/videoproject/videoproject.js

let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectlist:[],
    currentTab: 0,
    navScrollLeft: 0,
    height: '',//屏幕高度
    width: '',//屏幕宽度
    title:'',
    projectlistshow: true,//页面是否有数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start()
  },
  start:function(){
    let pages = getCurrentPages(), token = wx.getStorageSync('token'),that=this;
    let id=pages[pages.length - 1].options.id;
    let name = pages[pages.length - 1].options.name;
    wx.setNavigationBarTitle({
      title: name//页面标题为路由参数
    }) 
    let data={
      engineeringId:id
    }
    app.questUrl("jeecg-boot/infrastructure/video/wechatGetVideoList", 'post', token, data).then(function(res){
      console.log(res)
      if(res.data){
        that.setData({
          projectlist: res.data.result,
          windowWidth: app.globalData.width,
          height: app.globalData.heightall,
          title:name,
          projectlistshow: res.data.result.length>0?true:false
        })
      }
    })
  },
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    console.log(cur)
    var singleNavWidth = this.data.windowWidth / 3;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 1) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  switchTab(event) {
    var cur = event.detail.current;
    console.log(cur)
    var singleNavWidth = this.data.windowWidth / 3;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 1) * singleNavWidth
    });
  },
  tovideoplay:function(e){
    let item = e.currentTarget.dataset.item,that=this;
    let pre = e.currentTarget.dataset.pre;
    let idx = e.currentTarget.dataset.idx;
    app.globalData.relavideo=pre;
    console.log(app.globalData.relavideo)
    wx.navigateTo({
      url: '../videoplay/videoplay?val=' + item.videoId + '&name=' + item.videoName+'&title='+that.data.title+'&idx='+idx,
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