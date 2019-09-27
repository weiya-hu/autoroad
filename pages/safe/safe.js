// pages/safe/safe.js
var wxCharts = require('../../utils/wxcharts.js');
const app = getApp();
//每个chart的初始定义
var lineChart = null, lineChart1 = null, lineChart2 = null, lineChart3 = null, lineChart4 = null, lineChart5 = null, lineChart6 = null, lineChart7 = null, lineChart8 = null, lineChart9 = null, lineChart10 = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectlist: [],
    currentTab: 0,
    navScrollLeft: 0,
    // navScrollLeftarr1: [],
    height: '',//屏幕高度
    windowWidth: '',//屏幕宽度
    // indexarr: [],
    title: '',//页面标题
    idarr: [],//图表idarr
    date: [],//date初始值
    dat: {},
    name: '',//图表标题
    chartshow: true,
    item: {},//当前小标题
    time:[
      { name: '本日',value:'1'},
      { name: '近一周', value:'6' },
      { name: '近半月', value:'15' },
      { name: '近一月', value:'30' }],
    datearr:['6','6'],//安全步距初始时间数组
    projectlistshow: true,//页面是否有数据
    ispad:null,//判断是否为
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.initchart()
    this.start()
  },
  //日期更改图表曲线变化函数
  bindDateChange(e) {
    console.log(e)
    let token = wx.getStorageSync('token'), that = this;
    let idxvalue = e.currentTarget.dataset.idx;
    let datearr=this.data.datearr;
    datearr[this.data.currentTab]=idxvalue
    let dat = {}
    this.setData({
      // date: e.detail.value,
      datearr: datearr
    })
    console.log(this.data.datearr)
    
    if (this.data.dat) {
      dat = {
        equipmentId: this.data.dat.equipmentId,
        typeId: this.data.dat.typeId,
        date: idxvalue
      }
    }

    app.questUrl("jeecg-boot/infrastructure/building/SafeSpacingLine", 'post', token, dat).then(function (res) {
      console.log(res)
      let valuelist = [],xlist=[];
      for (let i = 0; i < res.data.result.valueList.length; i++) {
        valuelist.push(res.data.result.valueList[i].value);
        xlist.push(res.data.result.valueList[i].hour)
      }
      // that.updateData(valuelist, that.data.currentTab, that.data.name, that.data.item.unit, res.data.result.max, res.data.result.min)
      that.updateData(valuelist, that.data.currentTab, that.data.name, xlist) 
      console.log(valuelist)
      let flg = valuelist.find(m => m != null)
      console.log(flg)
      if (flg) {
        that.setData({
          chartshow:true
        })
      } else {
        that.setData({
          chartshow: false
        })
      }
      console.log(that.data.chartshow)

    })
  },
  start: function () {
    let pages = getCurrentPages(), token = wx.getStorageSync('token'), that = this;//获取上一个页面传过来的参数
    let id = pages[pages.length - 1].options.id;
    let name = pages[pages.length - 1].options.name;
    wx.setNavigationBarTitle({
      title: name//页面标题为路由参数
    })
    let data = {
      engineeringId: id
    }
    app.questUrl("jeecg-boot/infrastructure/building/SafeSpacing", 'post', token, data).then(function (res) {
      console.log(res)
      if (res.data.result.length > 0) {
        let arr = [], arr1 = [], idarr = [], valuelist = [], xlist = [], rest = res.data.result;
        for (let i = 0; i < res.data.result.length; i++) { arr.push(0); arr1.push(0); idarr.push('lineCanvas' + i) }
        console.log(arr)
        let dat = {
          equipmentId: res.data.result[0].ssInfo[0].equipmentId,
          typeId: res.data.result[0].ssInfo[0].typeId,
          date: '6'//初始为近一周
        }
        that.setData({
          projectlist: res.data.result,
          windowWidth: app.globalData.width,
          height: app.globalData.heightall,
          title: name,
          indexarr: arr,
          navScrollLeftarr1: arr1,
          idarr: idarr,
          date: that.getNowFormatDate(),
          dat: dat,
          name: rest[0].ssInfo[0].equipmentName + "(" + rest[0].ssInfo[0].unit + ")",
          item: rest[0].ssInfo[0],
          projectlistshow: res.data.result.length > 0 ? true : false
        })     
        console.log(that.data.projectlistshow)   
        app.questUrl("jeecg-boot/infrastructure/building/SafeSpacingLine", 'post', token, dat).then(function (res) {
          console.log(res)
          for (let i = 0; i < res.data.result.valueList.length; i++) {
            valuelist.push(res.data.result.valueList[i].value)
            xlist.push(res.data.result.valueList[i].hour)
          }
          that.updateData(valuelist, that.data.currentTab, that.data.name, xlist)
          let flg = valuelist.find(m => m != null)
          console.log(flg)
          if (flg) {
            that.setData({
              chartshow: true
            })
          } else {
            that.setData({
              chartshow: false
            })
          }
          console.log(that.data.chartshow)
        })
      }else{
        that.setData({
          projectlistshow: false
        })
      }
    });
    
  },
  switchNav(event) {
    var cur = event.currentTarget.dataset.current, projectlist = this.data.projectlist, that = this;
    let token = wx.getStorageSync('token'), index = this.data.indexarr[cur];
    //每个tab选项宽度占1/5
    console.log(cur)
    var singleNavWidth = this.data.windowWidth / 3;
    //tab选项居中                            
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 1) * singleNavWidth
    })
    if (projectlist[cur].ssInfo[index]) {
      let dat = {
        equipmentId: projectlist[cur].ssInfo[index].equipmentId,
        typeId: projectlist[cur].ssInfo[index].typeId,
        date: this.data.datearr[cur]
      }
      if (this.data.currentTab == cur) {
        return false;
      } else {
        this.setData({
          dat: dat,
          name: projectlist[cur].ssInfo[index].equipmentName + "(" + projectlist[cur].ssInfo[index].unit + ")",
          item: projectlist[cur].ssInfo[index]
        })
      }

      app.questUrl("jeecg-boot/infrastructure/building/SafeSpacingLine", 'post', token, dat).then(function (res) {
        let valuelist = [],xlist=[];
        for (let i = 0; i < res.data.result.valueList.length; i++) {
            valuelist.push(res.data.result.valueList[i].value),
            xlist.push(res.data.result.valueList[i].hour)
        }
        that.updateData(valuelist, that.data.currentTab, that.data.name,xlist)
        let flg = valuelist.find(m => m != null)
        console.log(flg)
        if (flg) {
          that.setData({
            chartshow: true
          })
        } else {
          that.setData({
            chartshow: false
          })
        }
        console.log(that.data.datearr)

      })
    }
  },
  switchTab(event) {
    console.log('switchTab')
    var cur = event.detail.current, projectlist = this.data.projectlist, that = this;
    let token = wx.getStorageSync('token'), index = this.data.indexarr[cur];
    var singleNavWidth = this.data.windowWidth / 3;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 1) * singleNavWidth
    })
    if (projectlist[cur].ssInfo[index]) {
      let dat = {
        equipmentId: projectlist[cur].ssInfo[index].equipmentId,
        typeId: projectlist[cur].ssInfo[index].typeId,
        date: this.data.datearr[cur]
      }
      this.setData({
        dat: dat,
        name: projectlist[cur].ssInfo[index].equipmentName + "(" + projectlist[cur].ssInfo[index].unit+")",
        item: projectlist[cur].ssInfo[index]
      });
      app.questUrl("jeecg-boot/infrastructure/building/SafeSpacingLine", 'post', token, dat).then(function (res) {
        let valuelist = [], xlist = [];
        for (let i = 0; i < res.data.result.valueList.length; i++) {
            valuelist.push(res.data.result.valueList[i].value),
            xlist.push(res.data.result.valueList[i].hour)
        }
        that.updateData(valuelist, that.data.currentTab, that.data.name, xlist)
        let flg = valuelist.find(m => m != null)
        console.log(flg)
        if (flg) {
          that.setData({
            chartshow: true
          })
        } else {
          that.setData({
            chartshow: false
          })
        }
        console.log(that.data.datearr)
      })
    }

  },
   //获取当前时间规定格式
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  updateData: function (data, idx, name,xlist) {
    var series = [{
      name: '安全步距(M)',
      data: data,
      format: function (val, name) {
        return val;
      }
    }];
    console.log(data)

    switch (idx) {
      case 0:
        lineChart.updateData({
          series: series,
          categories:xlist
        });
        break;
      case 1:
        lineChart1.updateData({
          series: series,
          categories: xlist
        });
        break;
      case 2:
        lineChart2.updateData({
          series: series,
          categories: xlist
        });
        break;
      case 3:
        lineChart3.updateData({
          series: series,
          categories: xlist
        });
        break;
      case 4:
        lineChart4.updateData({
          series: series,
          categories: xlist
        });
        break;
      case 5:
        lineChart5.updateData({
          series: series,
          categories: xlist
        });
        break;
      case 6:
        lineChart6.updateData({
          series: series,
          categories: xlist
        });
        break;
      case 7:
        lineChart7.updateData({
          series: series,
          categories: xlist
        });
        break;
      case 8:
        lineChart8.updateData({
          series: series,
          categories: xlist
        });
        break;
      case 9:
        lineChart9.updateData({
          series: series,
          categories: xlist
        });
        break;
      case 10:
        lineChart10.updateData({
          series: series,
          categories: xlist
        });
        break;
    }

  },
  //chart点击时显示的图表值
  touchHandler: function (e) {
    let idx = e.target.dataset.indx;
    switch (idx) {
      case 0: console.log(111)
        lineChart.showToolTip(e, {
          format: function (item, category) {
            console.log(item)
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 1:
        lineChart1.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 2:
        lineChart2.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 3:
        lineChart3.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 4:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 5:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 6:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 7:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 8:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 9:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 10:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
    }
    console.log(lineChart.getCurrentDataIndex(e));
  },
  //每个chart初始
  initchart() {
    //设置canvas宽度
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    // var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas' + this.data.currentTab,
      type: 'line',
      categories: [],
      animation: true,
      background: '#f1f3f5',
      series: [{
        name: '安全步距(M)',
        data: [0,0.1,0.1],
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: false,
        type:'calibration'
      },
      yAxis: {
        title: 'M',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        max: 200
      },
      width: windowWidth,
      height: 300,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    lineChart1 = new wxCharts({
      canvasId: 'lineCanvas1',
      type: 'line',
      categories: [],
      animation: true,
      background: '#f1f3f5',
      series: [{
        name: '安全步距(M)',
        data: [],
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      yAxis: {
        title: 'M',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        max: 200
      },
      width: windowWidth,
      height: 260,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    lineChart2 = new wxCharts({
      canvasId: 'lineCanvas2',
      type: 'line',
      categories: [],
      animation: true,
      background: '#f1f3f5',
      series: [{
        name: '安全步距(M)',
        data: [],
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      yAxis: {
        title: 'M',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        max: 200
      },
      width: windowWidth,
      height: 260,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    lineChart3 = new wxCharts({
      canvasId: 'lineCanvas3',
      type: 'line',
      categories: [],
      animation: true,
      background: '#f1f3f5',
      series: [{
        name: '安全步距(M)',
        data: [],
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      yAxis: {
        title: 'M',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        max: 200
      },
      width: windowWidth,
      height: 260,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    lineChart4 = new wxCharts({
      canvasId: 'lineCanvas4',
      type: 'line',
      categories: [],
      animation: true,
      background: '#f1f3f5',
      series: [{
        name: '安全步距(M)',
        data: [],
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      yAxis: {
        title: 'M',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        max: 200
      },
      width: windowWidth,
      height: 260,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    setTimeout(function(){
      lineChart5 = new wxCharts({
        canvasId: 'lineCanvas5',
        type: 'line',
        categories: [],
        animation: true,
        background: '#f1f3f5',
        series: [{
          name: '安全步距(M)',
          data: [],
          format: function (val, name) {
            return val;
          }
        }],
        xAxis: {
          disableGrid: false,
          type: 'calibration'
        },
        yAxis: {
          title: 'M',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0,
          max: 200
        },
        width: windowWidth,
        height: 260,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      lineChart6 = new wxCharts({
        canvasId: 'lineCanvas6',
        type: 'line',
        categories: [],
        animation: true,
        background: '#f1f3f5',
        series: [{
          name: '安全步距(M)',
          data: [],
          format: function (val, name) {
            return val;
          }
        }],
        xAxis: {
          disableGrid: false,
          type: 'calibration'
        },
        yAxis: {
          title: 'M',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0,
          max: 200
        },
        width: windowWidth,
        height: 260,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      lineChart7 = new wxCharts({
        canvasId: 'lineCanvas7',
        type: 'line',
        categories: [],
        animation: true,
        background: '#f1f3f5',
        series: [{
          name: '安全步距(M)',
          data: [],
          format: function (val, name) {
            return val;
          }
        }],
        xAxis: {
          disableGrid: false,
          type: 'calibration'
        },
        yAxis: {
          title: 'M',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0,
          max: 200
        },
        width: windowWidth,
        height: 260,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      lineChart8 = new wxCharts({
        canvasId: 'lineCanvas8',
        type: 'line',
        categories: [],
        animation: true,
        background: '#f1f3f5',
        series: [{
          name: '安全步距(M)',
          data: [],
          format: function (val, name) {
            return val;
          }
        }],
        xAxis: {
          disableGrid: false,
          type: 'calibration'
        },
        yAxis: {
          title: 'M',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0,
          max: 200
        },
        width: windowWidth,
        height: 260,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      lineChart9 = new wxCharts({
        canvasId: 'lineCanvas9',
        type: 'line',
        categories: [],
        animation: true,
        background: '#f1f3f5',
        series: [{
          name: '安全步距(M)',
          data: [],
          format: function (val, name) {
            return val;
          }
        }],
        xAxis: {
          disableGrid: false,
          type: 'calibration'
        },
        yAxis: {
          title: 'M',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0,
          max: 200
        },
        width: windowWidth,
        height: 260,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      lineChart10 = new wxCharts({
        canvasId: 'lineCanvas10',
        type: 'line',
        categories: [],
        animation: true,
        background: '#f1f3f5',
        series: [{
          name: '安全步距(M)',
          data: [],
          format: function (val, name) {
            return val;
          }
        }],
        xAxis: {
          disableGrid: false,
          type: 'calibration'
        },
        yAxis: {
          title: 'M',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0,
          max: 2000
        },
        width: windowWidth,
        height: 260,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
    },2000)
    
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