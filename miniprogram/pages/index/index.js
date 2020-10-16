//index.js
var app = getApp()
Page({
  data: {
    imgurl:'https://7869-xiaopu-kxzgf-1302800822.tcb.qcloud.la',
    // background: ['https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg', 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg', 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg'],
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    show: false,
    // 关注列表
    gzshow:true,
    // 关注
    widthHello:45 ,

// 本页面选手name
    usernameid:'',

 //  数组 接受的容器
    img:[],
 // 图片轮播集合
     background: [],

    //  用户数据
    user:[],


     DynamicTT:[],
     // 动态用户表
      Dynamic:[], 
  
  //  循环图片
      Dynamicarr :[],
      Dynamicimg:[],
  
  
  // 循环视频id
      Dynamicvideo:[],
      Dyvideo:[],
   //视频本体
     videoDY:[],
     video:[],
// 指示点
swiperCurrent:'',
   // 传过来显示有多少个
    pages:[],
    // 显示到页面
   page:[],
    bid:0,   

  //  点赞
  dianzan:155,
  dz:155,
  },
  
  methods:{
  
   
   },
   swiperChange:function(e){
    this.setData({
      swiperCurrent:e.detail.current,
      
    })
    // console.log(this.data.swiperCurrent)
  },
  // 指示点点击切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  // 根据name  查询用户数据
   seeuser(name){
    console.log("用户");
    const db = wx.cloud.database();
    db.collection('register').where({
      userName:name
   }).get().then(res=>{
      // console.log(res.data);
      var  arr = [];
      arr = res.data;
      this.setData({user:arr});
  console.log(this.data.user);
   })
   },
// 动态查询数据
       // 根据name  查询用户数据
       seeDynamic(name){
   
        const db = wx.cloud.database();
        db.collection('Dynamic').where({
          userName:name
       }).get().then(res=>{
        console.log("动态");
          console.log(res.data);
          for(var i in res.data){
    
         
          if(res.data[i].dynamicState==1){
            if(res.data[i].imgvideo==1){
              this.data.DynamicTT = res.data;
              //用户数据加载
              console.log("图片动态")
              this.setData({Dynamic:this.data.DynamicTT});
                console.log(this.data.Dynamic);
                this.seeDyimg();
            }else if(res.data[i].imgvideo==2){
                  // res.data[0].imgvideo==2  视频
            this.data.Dynamicvideo=res.data;
            console.log("图片视频")
            this.setData({Dyvideo:this.data.Dynamicvideo});
            console.log(this.data.Dyvideo);
            this.seeDyvieo();
            }
          }
         
          }
     
       })
       },
      //  查询动态图片
       seeDyimg(){
     const  dbdb = wx.cloud.database();
      //  var y  =this.data.Dynamic.length;
      console.log(this.data.Dynamic);
       for(const  x in this.data.Dynamic ){
        dbdb.collection('Img').where({
          dynamicID:this.data.Dynamic[x]._id
        }).get().then(res=>{
          console.log(x)
          console.log(res.data);
                   this.data.Dynamicarr[x]=res.data;
                   this.setData({Dynamicimg:this.data.Dynamicarr});
                   console.log(this.data.Dynamicimg);
        })
       }
       },
      //  查询视频
       seeDyvieo(){
         const  dbdb = wx.cloud.database();
         for(const  x in this.data.Dyvideo ){
          dbdb.collection('Video').where({
            dynamicID:this.data.Dyvideo[x]._id
          }).get().then(res=>{
            console.log(x)
            console.log(res.data);
            if(res.data.videoState==1){
            this.data.videoDY[x]=res.data;
            this.setData({video:this.data.videoDY});
            console.log(this.data.video);
            }
          })
        }
       },

// 根据  传进来的数值查询照片
  photo:function(name){
    console.log("照片");
    const db = wx.cloud.database();
    db.collection('Img').where({
       userName:name
    }).get().then(res=>{
    //  var y =  res.data.legth;
    // console.log(res)
    // console.log(res.data.length)
    for (var x in res.data) {//x = index
      if(res.data[x].imgState==1){
        if(res.data[x].tx==0){
          this.data.img.push(res.data[x].imgName);
          this.data.pages.push(x);
        }
      
      }
  }
      console.log(this.data.img)
      this.setData({background : this.data.img,page: this.data.pages})
     
    })
  },

   onLoad: function (options) {      
    // console.log(options.id);
     //options用于接收上个页面传递过来的参数
      var   usernameid = options.id;
      console.log(usernameid);
   //动态数据  传入用户
   this.seeDynamic(usernameid);

      // var   usernameid="张三";
      //  console.log(usernameid);

      //  可删除，模拟
      //  getApp().globalData.withlovename=usernameid;
      //  数据库中存储的
      var  withlovename =app.globalData.withlovename
         
      //  this.setData({withlovename:usernameid})
      //  查询照片操作

       this.photo(usernameid);
      //  查询用户操作 成功
       this.seeuser(usernameid);
    //  查询是否关注
       this.decideGZButton(withlovename,usernameid)
     },


  refurbish(){
  console.log("模拟刷新");

  }, 
  // 打招呼
  hello:function(){
  console.log('打招呼')
  },
//   加载时查询  关注是否显示
  decideGZButton(username,friendsName){
    const db = wx.cloud.database();
    db.collection('Friends').where({
      userName:username,
     }).get().then(res=>{
       console.log(res.data);
       for(var x in  res.data){
         if(friendsName == res.data[x].friendsName&& res.data[x].friendsState==2){
          this.setData({gzshow : false,widthHello:80});
         }
       }   
     
     })
  },

    // 修改关注表状态值
    updataST:function(id){
      const dbd = wx.cloud.database();
      dbd.collection('Friends').doc(id).update({
     data:{
      friendsState:2
    }
    }).then(res=>{
      console.log(res)

    }).catch(res=>{

    })
    },
 
  // // 判断  关注表中是否有   username  关注  friendsName
  decideGZ(username,friendsName){
    const db = wx.cloud.database();
    db.collection('Friends').where({
      userName:username,
     }).get().then(res=>{
       console.log(res.data);
       for(var x in  res.data){
         if(friendsName == res.data[x].friendsName){
             console.log("有值修改");
             this.updataST(res.data[x]._id);
             this.onClose();
         }
       }   
      //  没有就添加
         this.addGZ(username,friendsName);
        this.onClose();
     })
  },
  // 添加关注表
  addGZ(name,friends){
    const db = wx.cloud.database()
   db.collection('Friends').add({
   data:{
    userName:name,
    // 关注
    friendsState:'2',
    friendsName:friends,
   },
    })
   },

  // 关注 取消
  onClose() {
    this.setData({ show: false });
    

  },
  // 关注成功
  attention:function(){


    this.setData({ show: true });
    console.log("关注成功")

    //关注成功后影藏
    this.setData({gzshow : false,widthHello:80});
//   先要查询是否关注
var withlovename =  app.globalData.withlovename;
// console.log(withlovename);
      //  this.decideGZ(withlovename,this.data.usernameid);
      // this.decideGZ("迪丽热巴","古力娜扎");
        
    
  

  },
  onShow: function () {
    // console.log('个人中心')
    // this.getTabBar().init();
  },
  dz:function(e){
    console.log("点赞");

        
     this.setData({dianzan:this.data.dz++})
  },
  zf:function(e){
    console.log("转发");
  },
  pl:function(e){
    console.log("评论");
  },
  onClick(event) {
    wx.showToast({
      title: `点击标签 ${event.detail + 1}`,
      icon: 'none',
    });
  },
  onClickLeft(){
    wx.navigateBack({
       delta: 1 //跳转的级数
       })

  }


});
