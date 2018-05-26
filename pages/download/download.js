// pages/download/download.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList:[],	//已下载的文件列表
  },

  //打开文件
  openFile:function(e){
    let that = this;
    let fileList = that.data.fileList;
    let index = e.currentTarget.dataset.index;
    let path = e.currentTarget.dataset.path;
    wx.downloadFile({
      url: path,
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function (res) {
            wx.showToast({
              image: "/images/hint.png",
              title: '打开失败',
            })
          }
        })
      },
      fail:function(res){
        wx.showToast({
          image: "/images/hint.png",
          title: '下载失败',
        })
      }
    })
  },

  openFile2: function (e) {
    let that = this;
    let fileList = that.data.fileList;
    let index = e.currentTarget.dataset.index;
    let path = e.currentTarget.dataset.path;
    wx.openDocument({
      filePath: path,
      success: function (res) {
        console.log('打开文档成功')
      },
      fail: function (res) {
        wx.showToast({
          image: "/images/hint.png",
          title: '打开失败',
        })
      }
    })
  },

  //删除文件
  delFile:function(e){
    let that = this;
    let fileList = that.data.fileList;
    let index = e.currentTarget.dataset.index;
    wx.getSavedFileList({
      success: function(res) {
        if (res.fileList.length > 0){
          wx.removeSavedFile({
            filePath: res.fileList[index].filePath,
            complete: function(res) {
              console.log(res);
              //获取已下载的文件
              that.getDownList();
            }
          })
        }
      }
    })
  },

  //获取已下载的文件
  getDownList:function(){
    let that = this;
    wx.getSavedFileList({
      success: function (res) {
        console.log("已下载的文件列表 -->", res.fileList) //文件列表
        let fileList = res.fileList;
        that.setData({
          fileList: fileList
        })
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
    //获取已下载的文件
    that.getDownList();
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