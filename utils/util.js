const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// module.exports = {
//   formatTime: formatTime
// }
import cyurl from "url.js"

var app = getApp()


function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

// var oid = '1708240001'; 
var openId = ''
//获取微信信息
function getOpenId() {

  //先从缓存里面获取数据
  let _openId = wx.getStorageSync('openId');
  let shareMbId = wx.getStorageSync('shareMbId');//0430-Tony，增加父级编号
  console.log('getOpenId: ', _openId);
  console.log("邀请者，shareMbId:",shareMbId);

  // if (_openId != null && _openId != undefined){
  //   return _openId;
  // }else{
  console.log('to getOpenId');
  //请求openId
  wx.login({
    success: function (res) {
      console.log("getOpenId code   ++++++", res.code)
      if (res.code) {
        //发起网络请求
        wx.request({
          url: cyurl.getOpenId,
          data: {
            code: res.code,
            parentId: shareMbId
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log("getOpenId from Server: ", res.data);
            if (res.data.code == 0) {
              let wxOpenId = res.data.openId
              console.log("getOpenId: ", wxOpenId)
              //保存到缓存
              try {
                wx.setStorageSync('openId', wxOpenId)
              } catch (e) {
                console.log(e)
              }
              openId = wxOpenId
              //保存到服务器
              saveMember(wxOpenId);
              getUserInfo(wxOpenId)
            } else {
              console.log('getOpenId失败')
            }
            console.log("getOpenId from  sdsadasd++++ Server: ", openId);
          },
          fail: function (res) {
            console.log(res)
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  })
  // }  
}
//获取微信用户信息
function getUserInfo(wxOpenId) {
  wx.request({
    url: cyurl.getUserInfo,
    data: {
      openId: wxOpenId
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log("getUserInfo ", res.data);
      if (res.data.code == 0) {
        let mbId = res.data.bean.seqId;
        // console.log("getmbId: ", mbId)
        // //保存到缓存
        // try {
          wx.setStorageSync('mbId', mbId)
        // } catch (e) {
        //   console.log(e)
        // }
        // openId = wxOpenId
        // //保存到服务器
        // saveMember(wxOpenId);
        // getUserInfo(wxOpenId)
      } else {
        console.log('getOpenId失败')
      }
      console.log("getOpenId from  sdsadasd++++ Server: ", openId);
    },
    fail: function (res) {
      console.log(res)
    }
  })
}

//提交用户信息
function saveMember(openId) {
  var that = this;
  console.log("saveMember, openId:", openId);

  //调用登录接口，获取微信信息
  wx.getUserInfo({
    //成功
    success: function (res) {
      console.log(res)
      sf(res.userInfo)
      //保存到缓存
      try {
        wx.setStorageSync('information', res)
      } catch (e) {
        console.log(e)
      }
    }
  });
}
//保存用户信息
function sf(data) {
  wx.request({
    url: cyurl.saveMember,
    method: 'POST',
    data: {
      openId: wx.getStorageSync('openId'),
      wxImg: data.avatarUrl,
      mbName: data.nickName,
      mbSex: data.gender
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log('saveMember success,', res)
    },
    fail: function (rej) {
      console.log('saveMember fail ', rej)
    },
    complete: function (com) {
    }
  })
}
module.exports = {
  formatDate: formatDate,
  formatTime: formatTime,
  formatLocation: formatLocation,
  getOpenId: getOpenId,
  getUserInfo: getUserInfo
}
