const app = getApp()

Page({
  data: {
    name:'',
    idCard:'',
    show:false
  },
  bindName(e) {
    // console.log("进来了")
    // console.log(e.detail)
    this.setData({
      name: e.detail
    })
  },
  bindidCard(e) {
    this.setData({
      idCard: e.detail
    })
  },


  approve(){
    console.log("进入");
    var ts = this;
    var name = ts.data.name
    var reg = /^[a-zA-Z\u4E00-\u9FA5\uF900-\uFA2D\u00B7\u2022\u0095\u0387]+$/;
var strRe = /[\u4E00-\u9FA5]/g;
var str = name.match(strRe);
var strlength;
if(str == null){
strlength = name.length;
} else {
strlength = name.length + str.length * 2; // 汉字按三个字节
}
if (strlength <= 3 || strlength > 48) {
return false;
}
if (!name.match(reg)) {
return false;
} 
else {
var headExp = /^[\u00B7\u2022\u0095\u0387]+/;
var tailExp = /[\u00B7\u2022\u0095\u0387]+$/;
var zhExp = /[\u4E00-\u9FA5\uF900-\uFA2D]+[\s]+/;
var zhcharExp = /[\u4E00-\u9FA5\uF900-\uFA2D]+[u00B7\u2022\u0095\u0387]?[a-zA-Z]+/;
var charzhExp = /[a-zA-Z]+[u00B7\u2022\u0095\u0387]?[\u4E00-\u9FA5\uF900-\uFA2D]+/;
var emptyExp = /\s/g;
if (headExp.test(name)) {
return false;
console.log('姓名格式不合法')
}
if (tailExp.test(name)) {
return false;
console.log('姓名格式不合法')
}
if (zhExp.test(name)) {
return false;
console.log('姓名格式不合法')
}
if (zhcharExp.test(name)) {
return false;
console.log('姓名格式不合法')
}
if (charzhExp.test(name)) {
return false;
console.log('姓名格式不合法')
}
//unicode 常用汉字编码范围：[\u4e00-\u9fa5] = [19968-40907] 
//包含少数民族的姓名，（阿莱个·阿斯蒂芬·阿斯蒂芬·阿斯蒂芬）中间最多三个点
var reg3 = /^[\u4e00-\u9fa5]{1,}((·[\u4e00-\u9fa5]{1,}){0,3})$/;
if(reg3.test(name))
{
  var code = ts.data.idCard
  console.log(code)
  
  //身份证号合法性验证 
  //支持15位和18位身份证号
  //支持地址编码、出生日期、校验位验证
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    var tip = "";
    var pass = true;
  var reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/;
  if (!code || !code.match(reg)) {
      tip = "身份证号格式错误";
      pass = false;
    }else if (!city[code.substr(0, 2)]) {
      tip = "地址编码错误";
      pass = false;
    }else {
      //18位身份证需要验证最后一位校验位
      if (code.length == 18) {
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        var last = parity[sum % 11];
        if (parity[sum % 11] != code[17]) {
          tip = "校验位错误";
          pass = false;
        }
      }
    }
  console.log(pass)
  if (pass) { 
  //   console.log('跳页面')
     //  console.log(e.detail)
  var idcard = this.data.idCard;
  console.log(idcard);
  //   //  360426200002015016   18    360426200012015016      360426200012315016   360426200002015026
    var  birthday = idcard.substr(6,8);
    console.log(birthday+'生日')
    var year = birthday.substr(0,4);
    console.log(year+'年')
    var  month =birthday.substr(4,2);
    console.log(month+'月')
    var  day =birthday.substr(6,2); 
    console.log(day+'日')
    // 密码身份证后六位
   var  password = idcard.substr(12,6);

    // 判断 月 日 去除0
   if(parseInt(month)<10){
     month = month.substr(1,1);
     console.log(month+'月')
     if(parseInt(day)<10){
      day = day.substr(1,1);
       console.log(day+'日')
// if结尾
        }
// if结尾
     }
     var timestamp = Date.parse(new Date());
     var date = new Date(timestamp);
     //获取年份  
     var Y =date.getFullYear();
     console.log(Y)
       var age = Y-year
       console.log(age)

    var  sex =   idcard.substr(16,1);
    console.log(sex);
       if(parseInt(sex)%2==0){
          sex =2;
        console.log('女')
        var  userImg ='/1599706501199.png'
        console.log(userImg)
       }else{
        sex =1;
        console.log('男')
        var  userImg ='/1599706318894.png'
        console.log(userImg)
       }    
      
    const db = wx.cloud.database();
     db.collection('register').add({
      data:{
        userName:name,
        userPassword:password,
        userBirthday:birthday,
        userSex:sex,
        userAge:age,
      character:'性格',
     height:'身高',
      hobby:'爱好',
      posture:'身形',
      userIdCard:idcard,
      userImg:userImg,
      userPhone:'电话',
      userSign:'个性签名',
      userVideo:'视频',
      weight:'保密',
      work:'工作'
      },
      success: res => {
        console.log(res+'返回的数据');
        const  userID =   res._id;
      console.log(res._id);

      // //关闭当前选择页面
      wx.redirectTo({
        url: '../loginx/login'　　// 页面 A
      })
   
    // wx.navigateTo({360923200008242832
    //   url: 'pages/loginx/login',pages/one/one_id=userID
    // })


      
      },
      fail: res => {
        console.log(err)
      }
    })
   


    } 
    if (!pass){
      console.log("tip"+tip);
      console.log("失败")
    } 
    // return pass;
    
}


}
   


   
   
  },

  id:function(e){
  
  },
  name:function(e){
   
  },
   // 跳回
   onClickLeft(){
    wx.navigateBack({
       delta: 1 //跳转的级数
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})