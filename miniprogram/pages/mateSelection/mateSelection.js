// miniprogram/pages/mateSelection/mateSelection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    showuser: false,
    i:0,
    id:'',
      // user:"用户名",
      // name:"张三",

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
      //  ,{
      //   class:"身份证",
      //   par:"请选择",
      //   columns: ['保密','公开'],
      //  },
  
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
      //  ,{
      //   class:"身份证",
      //   par:"请选择",
      //   columns: ['保密','公开'],
      //  },
  
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
// 点击切换
  updata: function(event){

    // console.log(event);
  //  console.log(e.currentTarget.id);
    const  index = event.currentTarget.id;

    // const i  = event.d;
    // console.log(value);
     console.log(index);
    this.setData({ show: true , stat: this.data.tt[index].columns ,i:index});
  },

// 修改
  save:function(){
  console.log("保存成功")
  // const  username = this.data.name;
  const height = this.data.tt[0].par;
  const weight = this.data.tt[1].par;
  const posture = this.data.tt[2].par;
  const hobby = this.data.tt[3].par; 
  //  const userIdCard = this.data.tt[4].par;
  const work = this.data.tt[4].par;
  const character = this.data.tt[5].par;
  // console.log(weight)

 const db = wx.cloud.database();
  db.collection('zeou').doc("8a6c3bf65f47206b0059e7775b08ccee").update({
    data:{
      // userName : username,
      height:height,
      weight:weight,
      posture:posture,
      hobby:hobby,
      // userIdCard:userIdCard,
      work:work,
      character:character

    }, success: function(res) {
      console.log(res.data)
    }
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
      // console.log(  picker.getColumnValues);      
      // picker.setColumnValues(1, citys[value[index]]);
    // console.log(value);
 
    //  console.log(index);
    //  console.log(stat[index]);
    //关闭窗口
   
  //  const  aa = TT[ii].par;
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
  //  查询
   huoqu:function(){
    const db = wx.cloud.database();
    db.collection('zeou').where({
      // _id:'3adec2825f2fde45005fa63b7d44a36f'
      // userName:"zzf"
    }).get().then(res=>{
      
      console.log(res);
      // console.log(this.data.tt[7]);

      // console.log(res.data[0].character );
       this.data.id = res.data[0]._id;
        this.data.datapar[0].par =  res.data[0].height ;//身高
        this.data.datapar[1].par =  res.data[0].weight ;//体重
        this.data.datapar[2].par =  res.data[0].posture;//体型
        this.data.datapar[3].par =  res.data[0].hobby ;//爱好
        // this.data.datapar[4].par = res.data[0].speciality ;//特长
        // this.data.datapar[5].par =  res.data[0].userIdCard ;//身份证
        this.data.datapar[4].par =  res.data[0].work ;//职业
        this.data.datapar[5].par =  res.data[0].character ;//性格

     this.setData({ tt :  this.data.datapar})
      console.log(this.data.id);

    }).catch(res=>{
      console.log(res);
    })
  

   },
// 添加择偶
    add:function(){
   // 获取地址后上传操作
   const db = wx.cloud.database();
   db.collection('zeou').add({
     // data 字段表示需新增的 JSON 数据
     data: {
       userName:'zzf',
       character:'性格',
       height:"170",
       hobby:"爱好",
       posture:"身形",
       userAge:"20",
       weight:"体重",
       work:"工作"
     }
   }).then(res=>{
     console.log(res);

   }).catch(res=>{
     console.log(res);
   })


 },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
// 增加一条假数据
  //  this.add();
  // 查询
  this.huoqu();
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