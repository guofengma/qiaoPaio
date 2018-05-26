import cyurl from "../../utils/url";
import SHA1 from "../../utils/SHA1";
// pages/couponDestroy/couponDestroy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticketCode:"",
    index:"", //根据index来判断 index: 1 优惠券核销  2 积分兑换核销, 设置title
    Mobile:"",  //用户手机号
  },

  //保存输入 手机号
  saveInput:function(e){
    let that = this;
    let value = e.detail.value;
    that.setData({
      Mobile:value
    })
  },

  //加密 签名
  jiaMi(e){
    let that = this;
    let code = that.data.code;
    let Token = "8DFE1CD1D50F47CCB754D604E91569BB";
    let sign = SHA1.SHA1(code + Token)
    that.setData({
      sign: sign
    })
  },

  //核销优惠券
  destory:function(e){
    let that = this;
    let acCode = that.data.code;
    let sign = that.data.sign;
    let Mobile = that.data.Mobile;
    let StoreManagerMobile = wx.getStorageSync("storePhone");

    //手机号验证
    let pattern = /(^1[3456789][0-9]{9}$)/;
    if (!pattern.test(Mobile)) {
      wx.showToast({
        icon: "none",
        title: "手机号错误"
      })
      return
    }

    if (acCode.trim() == '' || acCode == undefined) {
      wx.showToast({
        icon: "none",
        title: '核销码为空',
      })
      return
    }

    let reqData = {
      acCode: acCode,
      language: "zh-cn",
      channel: "21",
      sign:sign,
      Data:{
        Mobile: Mobile,
        StoreManagerMobile: StoreManagerMobile,
      }
    };

    wx.showLoading({
      title: '加载中',
      mask:true,
    });

    wx.request({
      url: "http://digitapi.yesno.com.cn/CCN.FWAPI.WEB/CCN_NEW/Get_AcCodeInterface",
      header: {
        'content-type': 'application/json'
      },
      method:"POST",
      data: reqData,
      success: function (res) {
        wx.hideLoading()        
        console.log("核销 res -->", res)
        wx.showToast({
          icon:"none",
          title: res.data.errMsg || res.data.Message,
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },3000)
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

  ticketCode(code){
    console.log(code)
    console.log(typeof code)
    let that = this;
    let ticketCode = "";
    code = String(code)
    code = code.split("");
    for(var i in code){
      if(i <4 || i > 11){
        ticketCode += code[i]
      }else{
        ticketCode += "*"
      }
    }
    that.setData({
      ticketCode: ticketCode
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("smDestroy options -->",options);
    let that = this;
    let code = options.code;
    that.setData({
      code: code
    })
    //加 * 显示
    that.ticketCode(code);
    //加密
    that.jiaMi()
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