// pages/coupon/coupon.js
import getData from "../../utils/getData.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedList:[],
    toList: ['couponDetail']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getData.getaxios(this, {                     //this 一定要写
      url: 'ticketList',      //请求的URL      //类型字符串    //必填
      data: {},                      //前后台传的参数       //类型对象
      sourceData: ['selectedList'], //需要的数据源里面渲染请求回来的数据名称 //类型数组里面字符串
      updateData: ['list'],  //需要在请求回来的数据里面提取的数据名称    //类型数组里面字符串
      // callback: this.bind,   //成功的回调                 //类型函数
      // requestType: "GET"    //请求类型（默认GET）        //类型字符串
    })
  },
  goTo(e) {
    let index = parseInt(e.currentTarget.dataset.index)
    console.log(index)
    let toList = this.data.toList
    let url = toList[index] + '/' + toList[index]
    wx.navigateTo({
      url: '../' + url + "?seqId=" + e.currentTarget.dataset.seqId,
    })
  },
  receive(e) {
    let that = this;
    let openId = wx.getStorageSync('openId')
    let seqId = e.currentTarget.dataset.seqId
    console.log(seqId)

    getData.getaxios(this, {                     //this 一定要写
      url: 'getTicket',      //请求的URL      //类型字符串    //必填
      data: {
        openId: openId,
        seqId: seqId
      },                      //前后台传的参数       //类型对象
      sourceData: [], //需要的数据源里面渲染请求回来的数据名称 //类型数组里面字符串
      updateData: [],  //需要在请求回来的数据里面提取的数据名称    //类型数组里面字符串
      callback: that.hint,   //成功的回调                 //类型函数
      // requestType: "GET"    //请求类型（默认GET）        //类型字符串
    })
  },

  hint:function(){
    wx.showToast({
      title: '领取成功',
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

})