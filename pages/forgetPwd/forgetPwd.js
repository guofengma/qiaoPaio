import cyurl from "../../utils/url";
// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    manAccount:"",  //昵称、账号、用户名
    sendHint:"获取验证码",
    phone:"",
    kdj:true, //可点击
    secend:60,
    smsCode:"",
    reProPwd:"",
  },


  //保存输入
  saveInput: function (e) {
    let that = this;
    let value = e.detail.value;
    let name = e.currentTarget.dataset.name;
    let obj = {
      [name]: value
    };
    console.log(name + '的值为：', value);
    console.log("obj", obj);
    that.setData(obj)
  },

  //发送验证码之前验证这个手机号是否存在
  isUser(e){
    let that = this;
    let phone = that.data.phone;
    let pattern = /(^1[3456789][0-9]{9}$)/;

    if (!pattern.test(phone)) {
      wx.showToast({
        icon:"none",
        title: '手机号错误',
      })
      return false
    }

    let kdj = that.data.kdj;
    if(!kdj){
      return
    }

    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: cyurl.isUser,
      header: {
        'content-type': 'application/json'
      },
      data:{
        linkerPhone: phone
      },
      success: function (res) {
        wx.hideLoading()
        console.log("发送验证码之前验证这个手机号是否存在 res -->", res)
        if (res.data.code == 0) {
          that.sendCode()
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        console.log("发送验证码之前验证这个手机号是否存在 Err-->", res)
      }
    })


  },

  //发送验证码按钮 - 控制倒计时
  sendCode:function(){
    let that = this;
    let kdj = that.data.kdj;
    if(!kdj){
      return
    }
    kdj = false;
    that.setData({
      kdj:kdj
    });
    let phone = that.data.phone;
    let pattern = /(^1[3456789][0-9]{9}$)/;
    let secend = that.data.secend;
    let sendHint = that.data.sendHint;
    if (pattern.test(phone)) {
      console.log("发送验证码的请求")
      that.getCode()
      let timmer = setInterval(function(){
        if(secend > 1){
          secend -=1;
          sendHint = "重新发送"+secend
        }else{
          secend = 60;
          kdj = true;
          sendHint = "获取验证码"
          clearInterval(timmer);
        }
        that.setData({
          secend: secend,
          kdj: kdj,
          sendHint: sendHint
        })
      },1000)
    } else {
      that.setData({
        kdj: true
      });
      wx.showToast({
        image:"/images/hint.png",
        title: '手机号错误',
      })
    }

  },

  //请求验证码
  getCode:function(){
    let that = this;
    let phone = that.data.phone;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: cyurl.senCode,
      header: {
        'content-type': 'application/json'
      },
      data:{
        phone: phone
      },
      success: function (res) {
        console.log("请求验证码 res -->", res)
        if (res.data.code == 0) {
          wx.showToast({
            title: "发送成功",
          })
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        console.log("请求验证码 Err-->", res)
      },
      complete: function (res) {
        setTimeout(function(){          
          wx.hideLoading()
        },2000)
      }
    })
  },

  //密码重置
  reSetPwd: function (e) {
    let that = this;
    let linkerPhone = that.data.phone;
    let proPwd = that.data.proPwd;
    let reProPwd = that.data.reProPwd;
    let smsCode = that.data.smsCode;
    let openId = wx.getStorageSync("openId");
    let shareMbId = wx.getStorageSync("shareMbId");//从缓存中获取 0430-Tony
    console.log("邀请者 shareMbId:", shareMbId);
    if (linkerPhone == '' || linkerPhone == undefined ||proPwd.trim() == '' || proPwd == undefined) {
      wx.showToast({
        image: "/images/hint.png",
        title: '必填字段为空',
      })
      return
    }

    if(proPwd !== reProPwd){
      wx.showToast({
        image: "/images/hint.png",
        title: '两次密码不一致',
      })
      return
    }

    wx.showLoading({
      mask:true,
      title: '加载中',
    })
    wx.request({
      url: cyurl.reSetPwd,
      header: {
        'content-type': 'application/json'
      },
      data: {
        linkerPhone:linkerPhone,
        newPsw: proPwd,
        openId: openId,
        smsCode: smsCode
      },
      success: function (res) {
        console.log("密码重置 res -->", res)
        if (res.data.code == 0) {
          wx.showToast({
            title: "设置成功",
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
        wx.showToast({
            image: "/images/hint.png",
            title: "操作失败",
          })
        console.log("密码重置 Err-->", res)
      },
      complete: function (res) {
        setTimeout(function(){          
          wx.hideLoading()
        },2000)
      }
    })
  },

  //跳转登录
  toLogin:function(e){
    let that = this;
    let needback = that.data.needback;
    let backIsMenu = that.data.backIsMenu;
    if(needback){
      wx.navigateTo({
        url: '/pages/login/login?needback=true&backIsMenu=' + backIsMenu,
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let needback = options.needback;
    let backIsMenu = options.backIsMenu;
    if(needback){
      this.setData({
        needback:needback,
        backIsMenu:backIsMenu
      })
    }
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