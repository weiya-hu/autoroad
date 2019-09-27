// pages/message/messagedet/messsagedet.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{},//信息详情
    height:'',
    image:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start()
  },
  start() {
    console.log(app.globalData.messageitem)
    let item = app.globalData.messageitem;
    if (item.image){
      
    }
    if (item.image){
      let image = item.image.split(',')
      let images = image.map(val => app.globalData.master + val)
      this.setData({
        item: item,
        image: images,
        height: app.globalData.width * 0.3
      })
    }else{
      this.setData({
        item: item,
        height: app.globalData.width * 0.3
      })
    }
    
    console.log(app.globalData.width)
  },
  //图片加载回调
  imageLoad(e){
    console.log(e)
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    let idx = e.currentTarget.dataset.idx, imgarr = [];
    if (originalWidth <= originalHeight) {
      imgarr[idx] = true
    } else {
      imgarr[idx] = false
    }
    this.setData({
      imgstyle: imgarr
    })
  },
  //点击预览图片
  previewimg(e) {
    let item = e.currentTarget.dataset.item, tempFilePaths = this.data.image;
    console.log(item)
    wx.previewImage({
      pageNo: item, // 当前显示图片的http链接
      urls: tempFilePaths, // 需要预览的图片http链接列表
      current: item
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