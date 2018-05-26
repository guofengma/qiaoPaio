// pages/calendar/calendar.js
import getData from "../../utils/getData.js"
let openId = wx.getStorageSync('openId')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getFullYear:'',
    getMonthData: '',
    getDate: '',
    dateIndex: '',
    timeData:[{
      signDate:'2018-3-26',
      allOrders : 0,
      dayOrder : 1,
      lightOrder : 2,
    }],
    toList: ['jiFenMingXi', 'jiFenShangCheng','jiFenRanking'],
    myId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      getFullYear: new Date().getFullYear(),
      getMonthData: new Date().getMonth()+1,
      getDate: new Date().getDate(),
      dateIndex: new Date().getDate(),
      myId: options.myId
    })
    getData.getaxios(this, {                     //this 一定要写
      url: ['membsignList','getUserInfo'],      //请求的URL      //类型字符串    //必填
      data: [{
        mbId: wx.getStorageSync("mbId"),
        signYear: this.data.getFullYear,
        signMonth: this.data.getMonthData
      },{
        openId: wx.getStorageSync('openId')
      }],                   //前后台传的参数       //类型对象
      sourceData: [['timeData'], ['bean']], //需要的数据源里面渲染请求回来的数据名称 //类型数组里面字符串
      updateData:  [['list'], ['bean']],  //需要在请求回来的数据里面提取的数据名称    //类型数组里面字符串
      callback: this.toser,   //成功的回调                 //类型函数
      // requestType: "GET"    //请求类型（默认GET）        //类型字符串
    })
    
  },
  toser(){
    this.time(this.data.getFullYear, this.data.getMonthData, this.data.getDate)
  },
  //跳转
  goTo(e) {
    let index = parseInt(e.currentTarget.dataset.index)
    console.log(index)
    let toList = this.data.toList
    let url = toList[index] + '/' + toList[index]
    wx.navigateTo({
      url: '../' + url,
    })
  },

  getWeekByDay(dayValue) { // dayValue=“2014-01-01”
    var day = new Date(Date.parse(dayValue.replace(/-/g, '/'))) // 将日期值格式化
    return day.getDay()  // 返一个星期中的某一天，其中0为星期日
  },
  days(year, month) { // year=“2014”，month=“2” 获得当前月多少天
    // console.log(year, month)
    let dayCount
    let now = new Date(year, month, 0)
    dayCount = now.getDate()
    return dayCount
  },
  time(getFullYear, getMonthData, getDate) {
    let NumberOne = this.days(getFullYear, getMonthData - 1) // 上一个月
    if (getMonthData - 1 === 0) {
      NumberOne = this.days(getFullYear - 1, 12)
    }
    let NumberTwo = this.days(getFullYear, getMonthData)  // 当前月
    let initial = getFullYear + '-' + getMonthData + '-' + 1
    // let Date = getDate || this.getDate
    let getWeekByDays = this.getWeekByDay(initial)
    if (getWeekByDays === 0) {
      getWeekByDays = 7
    }
    let timeData = this.data.timeData
    let list = []
    for (var i = 0; i < 42; i++) {
      let obj = {}
      if (getWeekByDays - i <= 0) {
        if (NumberTwo >= i - getWeekByDays + 1) {
          obj.item = i - getWeekByDays + 1
          if (i - getWeekByDays <= NumberTwo) {
            obj.state = 0
            let objs = this.dataListfun(getFullYear, getMonthData, i - getWeekByDays + 1, timeData)
            obj.lightOrder = objs.lightOrder
            if (this.all(getFullYear, getMonthData, i - getWeekByDays + 1)) {
              obj.sameDay = true
            } else {
              obj.sameDay = false
            }
          } else {
            obj.state = 1
            obj.sameDay = false
          }
        } else {
          obj.item = i - getWeekByDays - NumberTwo + 1
          obj.state = 1
          obj.sameDay = false
        }
      } else {
        obj.item = NumberOne - getWeekByDays + i + 1
        obj.state = -1
        obj.sameDay = false
      }
      list.push(obj)
    }
    this.setData({
      timeList: list
    })
    console.log(list)
  },
  all(getFullYear, getMonthData, getDate) {
    let getMonthDate = new Date().getMonth() + 1
    let currentTime = new Date().getFullYear() + '-' + getMonthDate + '-' + new Date().getDate()
    let selectedTime = getFullYear + '-' + getMonthData + '-' + getDate
    let current = currentTime.split('-')
    let selected = selectedTime.split('-')
    if (parseInt(current[0]) === parseInt(selected[0]) &&
      parseInt(current[1]) === parseInt(selected[1]) &&
      parseInt(current[2]) === parseInt(selected[2])) {
      return true
    }
    return false
  },
  getOst(getFullYear, getMonthData, getDate) {
    let getMonthDate = new Date().getMonth() + 1
    let currentTime = new Date().getFullYear() + '-' + getMonthDate + '-' + new Date().getDate()
    let currents = currentTime.split('-')
    let selectedTime = getFullYear + '-' + getMonthData + '-' + getDate
    let selected = selectedTime.split('-')
    console.log(selectedTime)
    if (
      parseInt(currents[2]) > parseInt(selected[2]) ||
      parseInt(currents[1]) >= parseInt(selected[1]) ||
      parseInt(currents[0]) >= parseInt(selected[0])) {
      console.log(currents, selected)
      return 1
    }
    return 0
  },
  dataListfun(getFullYear, getMonthData, getDate,dataList) {
    let selectedTime = getFullYear + '-' + getMonthData + '-' + getDate
    let selected = selectedTime.split('-')
    let allOrders = 0
    let dayOrder = 0
    let lightOrder = 0
    for (var w = 0; w < dataList.length; w++) {
      let current = dataList[w].signDate.split('-')
      if (parseInt(current[0]) === parseInt(selected[0]) &&
        parseInt(current[1]) === parseInt(selected[1]) &&
        parseInt(current[2]) === parseInt(selected[2])) {
        lightOrder =  2
      }
    }
    let obj = {
      lightOrder: lightOrder
    }
    return obj
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

})