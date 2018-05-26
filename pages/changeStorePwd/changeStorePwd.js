import cyurl from "../../utils/url";
// pages/storeLogin/storeLogin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proPwd:"",
    newPwd:"",
  },

  //保存输入
  saveInput:function(e){
    let that = this;
    let value = e.detail.value;
    let name = e.currentTarget.dataset.name;
    let obj = {
      [name]:value
    };
    console.log(name+'的值为：',value);
    console.log("obj",obj);
    that.setData(obj)
  },

  //修改门店密码
  changeStorePwd:function(e){
    let that = this;
    let proPwd = that.data.proPwd;
    let newPwd = that.data.newPwd;
    let mbId = wx.getStorageSync("mbId");
    let StoreId = wx.getStorageSync("StoreId");
    if (proPwd.trim() == '' || proPwd == undefined || newPwd.trim() == '' || newPwd == undefined){
      wx.showToast({
        image: "/images/hint.png",
        title: '密码不能为空',
      })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask:true,
    })
    wx.request({
      url: cyurl.changeStorePwd,
      header: {
        'content-type': 'application/json'
      },
      data:{
        mngPwd: proPwd,
        mngPwdNew: newPwd,
        seqId: StoreId
      },
      success: function (res) {
        wx.hideLoading()
        console.log("修改门店密码 res -->", res)
        if (res.data.code == 0) {
          wx.showToast({
            title:"修改成功",
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1500)
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          image: "/images/hint.png",
          title: "修改失败",
        })  
        console.log("修改门店密码 Err-->", res)
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