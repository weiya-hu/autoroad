// pages/messageto/messageto.js
let util = require('../../utils/util.js')
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: '',//屏幕高度
    width: '',//屏幕宽度
    title: '',//页面标题
    type: ['消息上报','通知公告'],
    typevalue:'请选择消息类型',
    target:['全部用户','指定用户'],
    targetvalue:'请选择通告对象',
    targetuservalue:'请选择通告对象',
    tempFilePathss:[],//页面显示的添加图片的预览
    productInfo:[],//上报的图片名列表
    imgstyle:[],//图片预览宽高以谁为100%
    count:5,//图片能上传的数量
    enddate: '2019-01-01 00:00',//结束时间
    startdate: '2019-01-01 00:00',//开始时间
    checkitems:[],//指定用户获取的列表
    selectusershow: false,//指定用户是否显示
    pageNo: 1,//指定用户加载更多初始页
    jumploadmore:false,//指定用户加载更多是否到底
    userIds:[],//上传的指定用户的名称
    datetipend:false,//结束时间不规范提示是否显示
    datetipstart: false,//开始时间不规范提示是否显示
    disabled: false,//设置是否能点击 false可以 true不能点击
    startDate: 2019,
    endDate: 2019,
    placeholderend: '请选择结束时间',
    placeholderstart: '请选择开始时间',
    titlevalue:'',
    contentvalue: '',//内容值
    checkboxval: [],//指定用户加载更多被选值的id集合
    checkedarr:[],//指定用户加载更多的checkbox是否被选boolean值
    id:'',//地址id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.start()
  },
  start: function () {
    let pages = getCurrentPages();
    let name = pages[pages.length - 1].options.name;
    console.log(pages[pages.length - 1].options)
    wx.setNavigationBarTitle({
      title: name//页面标题为路由参数
      
    })
    this.setData({
      title: name,
      enddate: util.formatTime(new Date()),//结束时间
      startdate: util.formatTime(new Date()),//开始时间
      id: pages[pages.length - 1].options.id
    })
    console.log(this.data.title.split('-')[1])
  },
  //类型选择函数
  bindtypeChange:function(e){
    console.log(e.detail.value)
    let type=''
    e.detail.value == 0 ? type = '消息上报' : type = '通知公告'
    this.setData({
      typevalue:type
    })
  },
  //内容输入函数
  contentinp(e){
    console.log(e)
    this.setData({
      contentvalue: e.detail.value
    })
  },
  //通告对象选择函数
  bindtargetChange: function(e) {
    console.log(e.detail.value)
    let target = '',token=wx.getStorageSync('token'),that=this;
    e.detail.value == 0 ? target = '全部用户' : target = '指定用户'
    this.setData({
      targetvalue: target,
      targetuservalue:''
    })

    if (e.detail.value == 1){
      let data={
        column:'createTime',
        order:'desc',
        pageNo:that.data.pageNo,
        pageSize:15,
        id:that.data.id
      }
      app.questUrl('jeecg-boot/sys/user/findByEngineeringId', 'get', token, data).then(function(res){
        console.log(res)
        if(res.data.code==0){
          if (res.data.result.records.length<15){
            that.setData({
              jumploadmore:true,
              checkitems: res.data.result.records,
            })
          }else{
            that.setData({
              checkitems: res.data.result.records,
              pageNo: that.data.pageNo + 1
            })
          }
          
        }
      })
    }
  },
  //指定用户加载更多
  loadmore() {
    if (this.data.jumploadmore){
      console.log(this.data.jumploadmore)
      return
    }else{
      let token = wx.getStorageSync('token'), that = this;
      let data = {
        column: 'createTime',
        order: 'desc',
        pageNo: this.data.pageNo,
        pageSize: 15,
        id:this.data.id
      }
      app.questUrl('jeecg-boot/sys/user/findByEngineeringId', 'get', token, data).then(function (res) {
        console.log(res)
        if (res.data.code == 0) {
          if (res.data.result.records.length < 15) {
            that.setData({
              jumploadmore: true,
              checkitems: that.data.checkitems.concat(res.data.result.records)
            })
          } else {
            that.setData({
              checkitems: that.data.checkitems.concat(res.data.result.records),
              pageNo: that.data.pageNo + 1
            })
          }
          
        }
      })
    }
    
  },
  //获取加载更多checkbox被选值列表
  checked(checkitems, checkboxval){
    console.log(checkitems)
    console.log(checkboxval)
    let arr=[]
    for (let i = 0, l = checkitems.length;i<l;i++){
      let flg = checkboxval.find(m => m == checkitems[i].id)
      if(flg){
        arr.push(true)
      }else{
        arr.push(false)
      }
    }
    console.log(arr)
    this.setData({
      checkedarr:arr
    })
  },
  //添加图片
  addimg(){
    var that = this, token = wx.getStorageSync('token'), tempFilePathss = this.data.tempFilePathss;
    wx.chooseImage({
      count: this.data.count,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          let m = tempFilePaths[i]
          wx.uploadFile({
            url: app.globalData.url + 'jeecg-boot/sys/common/upload',
            filePath: tempFilePaths[i],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data",
              "X-Access-Token": token,
              "X-Requested-With":"XMLHttpRequest"
            },
            success: function (res) {
              tempFilePathss.push(m)
              that.setData({
                tempFilePathss: tempFilePathss,
                count: that.data.count - 1
              })
              console.log(res)
              uploadImgCount++;
              var data = JSON.parse(res.data);
              //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }  
              var productInfo = that.data.productInfo;
              productInfo.push(data.message);
              that.setData({
                productInfo: productInfo
              });
              console.log(that.data.productInfo)
              console.log(that.data.tempFilePathss);
              //如果是最后一张,则隐藏等待中  
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }
            },
            fail: function (res) {
              console.log(res)
              
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
    });  
  },
  //图片加载回调
  imageLoad(e){
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    let idx = e.currentTarget.dataset.idx,imgarr=[];
    if (originalWidth <= originalHeight){
      imgarr[idx] = true 
    }else{
      imgarr[idx] = false
    }
    this.setData({
      imgstyle: imgarr
    })
  },
  //图片删除
  deletee(e){
    let item = e.currentTarget.dataset.item, tempFilePathss = this.data.tempFilePathss, productInfo = this.data.productInfo;
    for (let i = 0, length = tempFilePathss.length;i<length;i++){
      if (tempFilePathss[i]==item){
        tempFilePathss.splice(i,1);
        productInfo.splice(i, 1);
      }
    }
    this.setData({
      tempFilePathss: tempFilePathss,
      count:this.data.count+1,
      productInfo: productInfo
    })
    console.log(this.data.productInfo);
    console.log(this.data.tempFilePathss);
  },
  //点击预览图片
  previewimg(e){
    let item = e.currentTarget.dataset.item, tempFilePaths = this.data.tempFilePathss;
    let indx = e.currentTarget.dataset.indx
    console.log(indx)
    wx.previewImage({
      pageNo: item, // 当前显示图片的http链接
      urls: tempFilePaths, // 需要预览的图片http链接列表
      current: item
    })
  },
  //开始时间函数
  onPickerChangestart(e){
    let enddate = parseInt(this.data.enddate.split("-").join('').split(" ").join('').split(":").join(''));
    let startdate = parseInt(e.detail.dateString.split("-").join('').split(" ").join('').split(":").join(''));
    console.log(enddate)
    console.log(startdate)
    if (enddate > 201901010000) {
      console.log(222)
      if (startdate <enddate) {
        this.setData({
          startdate: e.detail.dateString,
          datetipstart: false,
          datetipend: false,
        })
      } else {
        this.setData({
          datetipstart: true,
        })
      }
    } else {
      this.setData({
        enddate: e.detail.dateString,
        datetipend: false,
        datetipstart: false,
      })
    }
  },
  //结束时间函数
  onPickerChangeend(e) {
    let startdate = parseInt(this.data.startdate.split("-").join('').split(" ").join('').split(":").join(''));
    let enddate = parseInt(e.detail.dateString.split("-").join('').split(" ").join('').split(":").join(''));
    console.log(enddate)
    console.log(startdate)
    
      if (enddate >startdate) {
        this.setData({
          enddate: e.detail.dateString,
          datetipend: false,
          datetipstart: false,
        })
      } else {
        this.setData({
          datetipend: true,
        })
      }
  },
  //选择指定用户显示
  selectusershow(event){
    if (event.currentTarget.dataset.sure=='sure'){
      this.setData({
        selectusershow: false,
        contentvalue: this.data.contentvalue
      })
    }else{
      this.setData({
        selectusershow: true
      })
      this.checked(this.data.checkitems, this.data.checkboxval)
    }
    console.log(this.data.userIds)
  },
  //选择指定用户显示隐藏，并且userids为空
  checkshow(){
    this.setData({
      selectusershow: false,
      userIds: []
    })
  },
  //指定用户函数
  checkboxChange(e){
    let val=e.detail.value;
    console.log(val)
    let targetuservalue = val.map(m=>m.split(',')[1])
    let userIds = val.map(m => m.split(',')[0])
    console.log(targetuservalue)
    this.setData({
      userIds: userIds,
      targetuservalue: targetuservalue,
      checkboxval: userIds
    })
  },
  //上报函数
  formSubmit(e){
    console.log(e)
    let token=wx.getStorageSync('token'),that=this;
    let data={
      titile:e.detail.value.title,
      msgCategory: e.detail.value.type =='0' ? '3' : e.detail.value.type=='1'?'1':null,
      startTime: this.data.startdate+':00',
      endTime: this.data.enddate != '2019-01-01 00:00'? this.data.enddate + ':00':null,
      image: this.data.productInfo.length>0?this.data.productInfo.join(','):null,
      msgContent: e.detail.value.content,
      msgType: e.detail.value.target == '0' ? 'ALL' : e.detail.value.target == '1' ?'USER':null,
      userIds: this.data.userIds.length>0? this.data.userIds.join(','):',',
      address: this.data.title.split('-')[1]
    }
    if (e.detail.value.title== '') {
      wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      })
    } else if (e.detail.value.type != '0' && e.detail.value.type != '1') {
      wx.showToast({
        title: '请选择消息类型',
        icon: 'none'
      })
    } else if (e.detail.value.content == '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
    } else if (e.detail.value.target != '0' && e.detail.value.target != '1') {
      wx.showToast({
        title: '请选择通告对象',
        icon: 'none'
      })
    } else if (e.detail.value.target == '1' && this.data.userIds.length<=0) {
      wx.showToast({
        title: '请选择用户',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '正在上报...',
        icon: 'loading',
        mask: true,
        duration: 10000
      })
      app.questUrl('jeecg-boot/sys/annountCement/wechatAdd','post',token,data).then(function(res){
        console.log(res)
        wx.hideToast();
        if(res.data.code==200){
          wx.showToast({
            title: '上报成功',
            icon: 'none'
          })
          that.setData({
            typevalue: '请选择消息类型',
            targetvalue: '请选择通告对象',
            targetuservalue: '请选择通告对象',
            tempFilePathss: [],//页面显示的添加图片的预览
            productInfo: [],
            userIds: [],
            titlevalue:'',
            contentvalue:'',
            count: 5
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../index/index',
            })
          }, 2000)
        }else {
          wx.showModal({
            title: '错误提示',
            content: '上报失败',
            showCancel: false,
            success: function (res) { }
          })
        }
      })
    }
  },
  formReset(e){
    this.setData({
      typevalue: '请选择消息类型',
      targetvalue: '请选择通告对象',
      targetuservalue: '请选择通告对象',
      tempFilePathss: [],//页面显示的添加图片的预览
      productInfo: [],
      userIds: [],
      titlevalue: '',
      contentvalue: ''
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