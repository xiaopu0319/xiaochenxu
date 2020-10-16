// miniprogram/pages/mateSelection/mateSelection.js\
var  app  = getApp();
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    showuser: false,
    i:0,
     userid:'',
      user:"用户名",
      name:"张三",

      userpassword:"密码",
      Password:"123456",
      typePassword:"password",

      userIdCard:"身份证号",
      IdCard:"",
     tt:[
      {
        class:"身高",
        par:"170",
        columns: ['165-170','171-180','181-191'],
       },{
        class:"体重",
        par:"请选择",
        columns: ['35kg以下','35kg-50kg','50kg-60kg','60kg-70kg','70kg-80kg','80kg以上'],
       },{
        class:"体型",
        par:"请选择",
        columns: ['保密','一般','瘦长','苗条','高挑','丰满'],
       },{
        class:"爱好",
        par:"请选择",
        columns: ['唱歌','跳舞','游泳','极限运动','游戏','书法'],
       },
       {
        class:"职业",
        par:"请选择",
        columns: ['工人', '农民', '商人', '管理', '军人',"学生","其他"],
       }, {
        class:"性格",
        par:"正直",
        columns: ['谦恭', '正直', '怜悯', '英勇', '公正'],
       }
      


     ],
    
  
   

    // 弹出框集合
    stat:[],
    datapar:[  
      {
        class:"身高",
        par:"170",
        columns: ['165-170','171-180','181-191'],
       },{
        class:"体重",
        par:"请选择",
        columns: ['35kg以下','35kg-50kg','50kg-60kg','60kg-70kg','70kg-80kg','80kg以上'],
       },{
        class:"体型",
        par:"请选择",
        columns: ['保密','一般','瘦长','苗条','高挑','丰满'],
       },{
        class:"爱好",
        par:"请选择",
        columns: ['唱歌','跳舞','游泳','极限运动','游戏','书法'],
       },
       {
        class:"职业",
        par:"请选择",
        columns: ['工人', '农民', '商人', '管理', '军人',"学生","其他"],
       }, {
        class:"性格",
        par:"正直",
        columns: ['谦恭', '正直', '怜悯', '英勇', '公正'],
       }
      
    ],
    
   
    
  },

  updata: function(event){
    const  index = event.currentTarget.id;
     console.log(index);
    this.setData({ show: true , stat: this.data.tt[index].columns ,i:index});
  },

// 点击保存
  save:function(){
  console.log("保存成功")
  const  username = this.data.name;
  // const  Password = this.data.Password;
  console.log( this.data.tt);
  const height = this.data.tt[0].par;
  console.log(height);
  const weight = this.data.tt[1].par;
  const posture = this.data.tt[2].par;
  const hobby = this.data.tt[3].par; 
  //  const userIdCard = this.data.tt[4].par;
  const work = this.data.tt[4].par;
  const character = this.data.tt[5].par;
  // console.log(height)

 const db = wx.cloud.database();
  db.collection('register').doc(this.data.userid).update({
    data:{
      userName : username,
      // userPassword:Password,
      height:height,
      weight:weight,
      posture:posture,
      hobby:hobby,
      // userIdCard:userIdCard,
      work:work,
      character:character
    }
  }).then(res=>{
    console.log(res);
  }).catch(res=>{
    console.log(res);
  })




  },
 
  // 取消弹出层
  onClose() {
    this.setData({ show: false });
  },
//取消修改弹出层
onCloseuser(){
  this.setData({ showuser: false });
},

  onChange(event) {
    console.log(picker);
    const ii =this.data.i;
      const { picker, value, index } = event.detail;
    console.log(ii);
    this.data.datapar[ii].par = value;

    this.setData(
      {
         show: false,
       tt :  this.data.datapar
        
       });
    
   
  },
  //用户名 点击弹出 确认修改
  updataUser: function(e){
    console.log(e.detail)
    this.setData({
      name: e.detail
    })

  },
  // hahha
  updataPass:function(e){
    console.log(e.detail)
    this.setData({
      Password: e.detail
    })
  },
  // 密码显示
  Passshow:function(e){
    console.log("点击显示")
   if(this.data.typePassword=="password"){
     this.setData({typePassword:"text"})
   }else{
    this.setData({typePassword:"password"})
   }

  },
  // 与身份证框同步
  updataIdCard:function(e){
    console.log(e.detail)
    this.setData({
      IdCard: e.detail
    })
  },
  // 根据id或name获取数据
    have:function(withlovename){
      const db = wx.cloud.database();
       // 需要用户id
      db.collection('register').where({
       userName:withlovename
      }).get().then(res=>{
        
        console.log(res);
        // console.log(this.data.tt[7]);
  
        // console.log(res.data[0].character );
           
          //  this.data.Password = res.data[0].userPassword//密码
          this.data.datapar[0].par =  res.data[0].height ;//身高
          this.data.datapar[1].par =  res.data[0].weight ;//体重
          this.data.datapar[2].par =  res.data[0].posture;//体型
          this.data.datapar[3].par =  res.data[0].hobby ;//爱好
          // this.data.datapar[4].par = res.data[0].speciality ;//特长
          // this.data.datapar[4].par =  res.data[0].userIdCard ;//身份证
          this.data.datapar[4].par =  res.data[0].work ;//职业
          this.data.datapar[5].par =  res.data[0].character ;//性格
          const userIdCard =res.data[0].userIdCard
          const IdCard =  userIdCard.replace(userIdCard.substr(14,4),"****");
       this.setData({ tt :  this.data.datapar, Password: res.data[0].userPassword, name:res.data[0].userName,IdCard:IdCard,userid:res.data[0]._id});
        // console.log(this.data.userid);
  
      }).catch(res=>{
        console.log(res);
      })
    

    },
   

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var withlovename = app.globalData.withlovename;
    this.have("李艾");
      // const  str="360426200002015016"
      // const strr =  str.replace(str.substr(14,4),"****");
      // console.log(strr);
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

  
  // 跳回
 onClickLeft(){
    wx.navigateBack({
       delta: 1 //跳转的级数
       })

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