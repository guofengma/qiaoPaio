import cyurl from "../../utils/url";
// pages/couponDestroy/couponDestroy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticketCode:"",
    index:"", //根据index来判断 index: 1 优惠券核销  2 积分兑换核销, 设置title
  },

  //保存输入 核销码
  saveInput:function(e){
    let that = this;
    let value = e.detail.value;
    that.setData({
      ticketCode:value
    })
  },

  //核销优惠券 或 积分兑换核销
  destory:function(e){
    let that = this;
    let openId = wx.getStorageSync("openId");
    let mbId= wx.getStorageSync("mbId");
    let index = that.data.index;
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
      mask:true,
    });
    let ticketDestroyUrl = cyurl.ticketDestroy;
    let goodDestroyUrl = cyurl.goodDestroyUrl;
    let finalUrl = index == 1?ticketDestroyUrl:goodDestroyUrl;
    let ticketDestroyReq = {
      openId:openId,
      ticketCode:ticketCode
    };
    let goodDestroyReq = {
      mbId:mbId,
      applyCode:ticketCode
    };
    let finalReq = index == 1?ticketDestroyReq:goodDestroyReq;
    wx.request({
      url: finalUrl,
      header: {
        'content-type': 'application/json'
      },
      data:finalReq,
      success: function (res) {
        wx.hideLoading()        
        console.log("核销优惠券 或 积分兑换核销 res -->", res)
        if (res.data.code == 0) {
          wx.navigateTo({
            url: '/pages/couponDestroyTrue/couponDestroyTrue',
          })
          // wx.showToast({
          //   title: '核销成功',
          // })
          // setTimeout(function(){
          //   wx.navigateTo({
          //     url: '/pages/couponDestroyTrue/couponDestroyTrue',
          //   })
          // },1500)
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        console.log("核销优惠券 或 积分兑换核销 Err-->", res)
      },
      complete:function(res){
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

  // 根据index来判断 index: 1 优惠券核销  2 积分兑换核销, 设置title
  setTitle:function(e){
    let that = this;
    let index = that.data.index;
    if(index == 1){
      wx.setNavigationBarTitle({
        title: '优惠券核销'
      })
    }else if(index == 2){
      wx.setNavigationBarTitle({
        title: '积分兑换核销'
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let index = options.index;
    that.setData({
      index:index
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
    let that = this;
    that.setTitle();
    that.setData({
      ticketCode: ""
    })
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