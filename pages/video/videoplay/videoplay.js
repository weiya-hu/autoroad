// pages/video/videoplay/videoplay.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video:'',
    name:'',
    heightdown:'',
    relalist:[],
    num:-1,
    txt:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start()
  },
  start:function(){
    let pages = getCurrentPages(), token = wx.getStorageSync('token'), that = this;
    let val= pages[pages.length - 1].options.val;
    let name = pages[pages.length - 1].options.name;
    let idx = pages[pages.length - 1].options.idx;
    let title = pages[pages.length - 1].options.title;
    let query = wx.createSelectorQuery();
    this.videourl(val)
    wx.setNavigationBarTitle({
      title: title//页面标题为路由参数
    })
    query.select('.vd').boundingClientRect(function (res) {
      that.setData({
        heightdown: app.globalData.heightall - res.height
      })
    }).exec();
    this.setData({
      name:name,
      relalist: app.globalData.relavideo,
      num:idx,
      height:app.globalData.width*0.75
    })
  },
  videourl(val){
    let token= wx.getStorageSync('token'),that=this;
    console.log(val)
    console.log(token)
    let data={
      videoId:val
    };
    app.questUrl('jeecg-boot/infrastructure/video/videoAddress','post',token,data).then(function(res){
      console.log(res)
      that.setData({
        txt: JSON.stringify(res)
      })
      if (res.data.success == true){
        that.setData({
          video: res.data.message,
          
        })
      } else if (res.data.success == false){
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    })
  },
  change(e) {//点击相似列表更改数据
    let item = e.currentTarget.dataset.item;
    let num = e.currentTarget.dataset.num;
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.pause()
    this.setData({
      num: num,
      name: item.videoName
    },
    )
    this.videourl(item.videoId)
    
  },
  // bindwaitvideo(){
  //   wx.showToast({
  //     title: '正在缓冲视频...',
  //     icon:"none",
  //     duration:1500
  //   })
  // },
  binderrorvido(e) {
    console.log(e)
    this.setData({
      ee:JSON.stringify(e)
    })
    wx.showToast({
      title: '播放出错了，请稍后再试',
      icon: "none"
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