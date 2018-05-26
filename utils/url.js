// var zsLedUrl = "https://smarthome.yancloud.cn/cymall/m";
// var zsLedUrl = "https://wechat.hyfedu.com/cymall/m";

//var zsLedUrl = "http://wechatmp.bingosale.net:4905/cymall/m";
var zsLedUrl = "https://smarthome.yancloud.cn/cymall/m";
var codeUrl = "https://smarthome.yancloud.cn/cymall";

// http://wechatmp.bingosale.net:4905/cymall/login.jsp

//  var zsLedUrl = "http://wechatmp.bingosale.net:4904/cymall/m";

//  var codeUrl =  "http://wechatmp.bingosale.net:4904/cymall";


var oid = '1803190001';


export default {
  //获取openId
  getOpenId: zsLedUrl + "/member/getOpenId.do?oid=" + oid,
  //保存会员
  saveMember: zsLedUrl + "/member/updateWxInfo.do?oid=" + oid,

  // 2.1 获取轮播图
  imgUrl: zsLedUrl + "/mall/getSlideImgs.do?oid=" + oid,
  
  //2.33  佣金列表 /gamedistricommi/list.do
  gameDistriCommiListUrl: zsLedUrl + "/gamedistricommi/list.do?oid=" + oid,

  //2.34 可提现佣金 /memberwithdraw/getCash.do
  getCashUrl: zsLedUrl + "/memberwithdraw/getCash.do?oid=" + oid,

  //2.35 申请提现  /memberwithdraw/save.do
  saveMemberWithDrawUrl: zsLedUrl + "/memberwithdraw/save.do?oid=" + oid,

  //2.36 提现列表  /memberwithdraw/list.do
  memberDrawListUrl: zsLedUrl + "/memberwithdraw/list.do?oid=" + oid,

  //2.6保存提现/结算账户
  saveWithDrawAccount:zsLedUrl+"/member/saveSettleAccount.do?oid="+oid,
	
	// 获取提现/结算账户
	getWithDrawAccount: zsLedUrl + "/member/getSettleAccount.do?oid=" + oid,

  // 校验用户登录状态
  mbIsLogin: zsLedUrl + '/member/isLogin.do?oid=' + oid,

  //2.2销售人员注册
  salesReg:zsLedUrl+"/mall/store/storesalesman/reg.do?oid="+oid,

  //发送验证码
  senCode:codeUrl+"/smsApi/sendVerifyCode.do?oid="+oid,

  //销售人员登入
  salesLogin:zsLedUrl+"/mall/store/storesalesman/login.do?oid="+oid,

  // 获取推荐的信息分类列表   -- 首页用
  infoRecList:zsLedUrl+"/info/listRecommand.do?oid="+oid,

  //搜索
  search: zsLedUrl +"/info/listSimple.do?oid="+oid,

  //根据分类获取信息列表
  getInfoList:zsLedUrl+"/info/listSimple.do?oid="+oid,

  //2.8获取文章详情
  infoDeatil:zsLedUrl+"/info/getByIdSimple.do?oid="+oid,

  //2.9文本资料下载
  download:zsLedUrl+"/infodetail/download.do?oid="+oid,

  //2.10点赞
  zan:zsLedUrl+"/info/saveLikeNum.do?oid="+oid,

  //2.11收藏
  like:zsLedUrl+"/info/saveCollect.do?oid="+oid,

  //2.12回复
  reply:zsLedUrl+"/inforeply/saveReplySimple.do?oid="+oid,

  //3.1获取会员个人信息（积分）
  getUserInfo:zsLedUrl+"/member/getByOpenId.do?oid="+oid,

  //3.2签到
  sign:zsLedUrl+"/membsign/signIn.do?oid="+oid,

  //3.3签到列表
  signList:zsLedUrl+"/member/signInList.do?oid="+oid,

  // 3.4签到明细
  signMX:zsLedUrl+"/member/memberIntegralByMbId.do?oid="+oid,

  // 3.5积分商城列表
  jiFenGoods:zsLedUrl+"/integralGoods/list.do?oid="+oid,

  // 3.6兑换商品
  integralGoods:zsLedUrl+"/integralGoods/apply.do?oid="+oid,

  // 3.7我的兑换
  myIntegral:zsLedUrl+"/integralGoods/applyList.do?oid="+oid,

  // 3.8扫码积分
  qrcodeInfo:zsLedUrl+"/qrcodeinfo/scanSave.do?oid="+oid,

  // 3.9邀请注册
  requestReg:zsLedUrl+"/member/requestReg.do?oid="+oid,

  // 3.10话题列表
  topicList:zsLedUrl+"/info/listSimple.do?oid="+oid,

  // 3.11话题详情
  topicDetail:zsLedUrl+"/cyinfo/m/info/getById.do?oid="+oid,

  // 3.12话题回复
  topicReply:zsLedUrl+"/inforeply/saveReplySimple.do?oid="+oid,

  // 3.13优惠券列表
  ticketList:zsLedUrl+"/mallticket/list.do?oid="+oid,

  // 优惠券详情
  ticketDetail:zsLedUrl+"/mallticket/getById.do?oid="+oid,

  // 3.15领取优惠券
  getTicket:zsLedUrl+"/mallticket/generateTicket.do?oid="+oid,

  // 3.16分享优惠券
  shareTicket:zsLedUrl+"/mallticket/generateTicket.do?oid"+oid,

  // 3.17我的优惠券
  myTicket:zsLedUrl+"/mallticket/minelist.do?oid="+oid,

  // 3.18门店登入
  storeLogin:zsLedUrl+"/mall/store/storeMng/login.do?oid="+oid,

  // 优惠券核销
  ticketDestroy:zsLedUrl+"/mallticket/verify.do?oid="+oid,

  //兑换商品核销
  goodDestroyUrl:zsLedUrl+"/integralgoodsapply/verify.do?oid="+oid,


  // 3.20我的收藏
  myLike:zsLedUrl+"/member/getMyCollectList.do?oid="+oid,

  // 3.21我的下载
  myDown:zsLedUrl+"/member/getMyDownloadList.do?oid="+oid,

  //3.2签到
  signIn: zsLedUrl + "/membsign/signIn.do?oid=" + oid,

  //3.3签到列表
  membsignList: zsLedUrl + "/membsign/list.do?oid=" + oid,

  //积分明细
  integrallog: zsLedUrl + "/integrallog/list.do?oid=" + oid,

  //积分排行榜
  jiFenRanking:zsLedUrl+"/member/getRankingList.do?oid="+oid,

  //建立上下级分销关系
  shareSales:zsLedUrl+"/member/share.do?oid="+oid,


  //修改门店密码
  changeStorePwd:zsLedUrl+"/storemng/updatePsw.do?oid="+oid,

}
