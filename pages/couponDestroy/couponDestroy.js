// pages/couponDestroy/couponDestroy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticketCode:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  //保存输入 核销码
  saveInput:function(e){
    let that = this;
    let value = e.detail.value;
    that.setData({
      ticketCode:value
    })
  },

  //核销优惠券
  destory:function(e){
    let that = this;
    let ticketCode = that.data.ticketCode;
    if(ticketCode.trim() == '' || ticketCode == undefined){
      wx.showToast({
        image:"/images/hint.png",
        title: '核销码为空',
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.ticketDestroy,
      header: {
        'content-type': 'application/json'
      },
      data:{
        ticketCode: ticketCode
      },
      success: function (res) {
        console.log("核销优惠券 res -->", res)
        if (res.data.code == 0) {
          wx.showToast({
            title: '核销成功',
          })
          setTimeout(function(){
            wx.navigateTo({
              url: '/pages/couponDestroyTrue/couponDestroyTrue',
            })
          },1500)
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: '核销失败',
          })
        }
      },
      fail: function (res) {
        console.log("核销优惠券 Err-->", res)
      },
      complete:function(res){
        wx.hideLoading()
      }
    })
  },

  // 门店退出登录
  storeSignOut:function(e){
    let that = this;
    wx.setStorageSync("storeIsLogin", 0);
    wx.switchTab({
      url: '/pages/my/my',
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