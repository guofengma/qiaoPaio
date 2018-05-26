import cyurl from "../../utils/url";
// pages/jiFenRanking/jiFenRanking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      // {
      //   mbName:"",
      //   mbIntegral:"",
      //   mbImg:""
      // }
    ]
  },

  //获取积分排行
  getjiFenRanking: function () {
    let that = this;
    let mbId = wx.getStorageSync("mbId");
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.jiFenRanking,
      header: {
        'content-type': 'application/json'
      },
      data:{
        seqId: mbId
      },
      success: function (res) {
        console.log("获取积分排行 res -->", res)
        if (res.data.code == 0) {
          var list = res.data.list;
          that.setData({
            list: list
          })
          // that.jiFenOrder();
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        console.log("获取积分排行 Err-->", res)
      },
      complete: function (res) {
        setTimeout(function(){          
          wx.hideLoading()
        },2000)
      }
    })
  },

  //现有排序时后台根据现有积分排序的，但是返回数据是历史积分，前端改一下排序逻辑
  //改为根据历史积分排序
  jiFenOrder:function(){
    let that = this;
    let list = that.data.list;
    list.sort(that.sortId);
    console.log("list",list)
    that.setData({
      list: list
    })
  },

  sortId(a, b){  
    return b.mbIntegral - a.mbIntegral
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    let that = this;
    //获取积分排行
    that.getjiFenRanking();
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