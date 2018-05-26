import cyurl from "../../utils/url";
// pages/jiFenMingXi/jiFenMingXi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
  },

  //积分明细
  getSwiper: function () {
    let that = this;
    let openId = wx.getStorageSync("openId");
    let mbId = wx.getStorageSync("mbId");
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.integrallog,
      header: {
        'content-type': 'application/json'
      },
      data:{
        mbId: mbId
      },
      success: function (res) {
        console.log("积分明细 res -->", res)
        if (res.data.code == 0) {
          var list = res.data.list;
          that.setData({
            list: list
          })
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          image: "/images/hint.png",
          title: "获取失败",
        })
        console.log("积分明细 Err-->", res)
      },
      complete: function (res) {
        setTimeout(function(){          
          wx.hideLoading()
        },2000)
      }
    })
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
    that.getSwiper();
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