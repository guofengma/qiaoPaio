// pages/address/address.js
import getData from "../../utils/getData.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataVal1: '',
    dataVal2: '',
    dataVal3: '',
    myId:'',
    seqId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      myId: options.myId,
      seqId: options.seqId
    })
  },

  dataVal(e){
    let dataVal = 'dataVal' + e.currentTarget.dataset.index
    let data = {}
    data[dataVal] = e.detail.value
    this.setData(data)
  },
  exchange(){
    if (this.data.dataVal1.trim() == "" || this.data.dataVal1 == undefined ||
      this.data.dataVal2.trim() == "" || this.data.dataVal2 == undefined ||
      this.data.dataVal3.trim() == "" || this.data.dataVal3 == undefined
    ){
      wx.showToast({
        image:"/images/hint.png",
        title: '请输入完整信息',
      })
      return
    }else{
      getData.getaxios(this, {                     //this 一定要写
        url: 'integralGoods',      //请求的URL      //类型字符串    //必填
        data: {
          mbId: wx.getStorageSync("mbId"),
          goodsId: this.data.seqId,
          linker: this.data.dataVal1,
          linkerPhone: this.data.dataVal2,
          linkerAddr: this.data.dataVal3
        },                      //前后台传的参数       //类型对象
        sourceData: [], //需要的数据源里面渲染请求回来的数据名称 //类型数组里面字符串
        updateData: [],  //需要在请求回来的数据里面提取的数据名称    //类型数组里面字符串
        callback: this.toser,   //成功的回调                 //类型函数
        // requestType: "GET"    //请求类型（默认GET）        //类型字符串
      })
    }
  },
  toser() {
    wx.showToast({
      title: '兑换成功',
    })
    setTimeout(()=>{
      wx.navigateBack({
        delta: 2
      })
    },1200)
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