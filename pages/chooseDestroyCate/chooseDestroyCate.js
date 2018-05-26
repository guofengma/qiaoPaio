// pages/chooseDestroyCate/chooseDestroyCate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  tochangeStorePwd:function(e){
    let that = this;
    wx.navigateTo({
      url: '/pages/changeStorePwd/changeStorePwd',
    })
  },

  //跳转核销页面
  tocouponDestroy:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;  //index: 1 优惠券核销  2 积分兑换核销
    if(index == 1){
      // 允许从相机和相册扫码
      wx.scanCode({
        success: (res) => {
          console.log("扫码 res -->",res)
          let qrcode = res.result;
          that.qrcodeInfo(qrcode);
        },
        fail:(res) => {
          wx.showToast({
            icon:"none",
            title:"扫码失败"
          })
        }
      })
    }


    if(index == 2){
      wx.navigateTo({
        url: '/pages/destroy/destroy?index='+index,
      })
    }
  },

  //解析二维码 并 传递到  二维码核销页面
  qrcodeInfo(qrcode){
    console.log("qrcode",qrcode)
    let codeArr = qrcode.split('?');
    let code = codeArr[1];
    code = code.slice(1, 17)
    wx.navigateTo({
      url: '/pages/smDestroy/smDestroy?code=' + code,
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