// miniprogram/pages/gz/gz.js
  var app = getApp();
  import  tool from  "../../app"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // GZstateid:'已关注',
    // GZstate:'2',
    gz:"已关注",
     // 图片路径前缀
    imgurl:'https://7869-xiaopu-kxzgf-1302800822.tcb.qcloud.la',
  // //   关注列表状态
  //   GZfriendsState:[],
  //   // 显示
  //   friendsState:[],
   

  //查看粉丝表 ，自己的关注粉丝对象
     FSmy:[],

    // 粉丝表查询
     FStabber:[],
    //  粉丝表显示
     tabber:[],
  //   粉丝
     FSuser:[],
     userfs:[],


    // 关注列表
   GZfriendsName:[],
  //  关注显示
   friendsName:[],



  //  关注用户数据
     GZuser:[],
  // 关注用户数据显示
  gzUSERs:[],

  // 修改关注
  gzid:'',
  // 查询
  value:'',
// 查询
  inputValue:''
  },
  // 添加关注列表 
   addGZ(username,friendsname){
    const db = wx.cloud.database()
   db.collection('Friends').add({
   data:{
    userName:username,
    // 关注
    friendsState:'2',
    friendsName:friendsname,
   },
    })
   },
  //  查询自己
     seemy(username){
        const db = wx.cloud.database();
       db.collection('Friends').where({
        userName:username,
       }).get().then(res =>{
        
          var  arr=[];
          for(var x in res.data)
          arr.push(res.data[0]);
          
          this.setData({FSmy:arr});
          console.log(this.data.FSmy);
       })


     },

  //  查询粉丝表
    seeFS(name){
      const db = wx.cloud.database();
      db.collection('Friends').where({
        friendsName:name
      }).get().then(res =>{
        // console.log(res.data);
        for( var i in res.data){  
          if(res.data[i].friendsState==2){
        //   this.data.GZfriendsState.push(res.data[i].friendsState)
            this.data.FStabber.push(res.data[i]);
          }
         }
        //  查询自己
         this.seemy(res.data.friendsName);
         this.setData({tabber: this.data.FStabber})
        //  粉丝表
           console.log(this.data.tabber)
       
           this.seeuserFS();
      })
    },



 // 粉丝表用户查询
 seeuserFS(){
  const db = wx.cloud.database();
for(var i  in this.data.tabber){
 db.collection('register').where({
  userName:this.data.tabber[i].userName,
 }).get().then(res =>{
   console.log(res.data)
   for(var x in  this.data.FSmy){
    //  console.log(x);
    console.log(this.data.FSmy[x].friendsName);
    console.log( res.data[0].userName);
    if(this.data.FSmy[x].friendsName == res.data[0].userName || this.data.FSmy[x].friendsState==  res.data[0].friendsState){
      console.log("进来一次");
      this.data.tabber[i].friendsState=3;

    }else{
      console.log("失败")
      this.data.tabber[i].friendsState=2;
    
    }
   }
   res.data[0].strt=this.data.tabber[i].friendsState;
   this.data.FSuser.push(res.data[0])
   // this.data.GZuser.push(this.data.friendsState[i])
   this.setData({  userfs:this.data.FSuser}); 
  //  console.log(this.data.userfs)
})
  }
},
//  判断是否有相同的关注表
decideGZFS(username,FrState,idx){
  const db = wx.cloud.database();
 db.collection('Friends').where({
  userName:username,
 }).get().then(res =>{
  //  console.log(res.data);
  //  console.log(this.data.FStabber)
   for(var x in this.data.FStabber){

    if(res.data[0].friendsName==  this.data.FStabber[x].userName || res.data[0].friendsState== this.data.FStabber[x].friendsState){
     FrState[idx].strt = 3;
    this.data.FSuser[idx].strt =   FrState[idx].strt ;
     this.setData({  userfs:this.data.FSuser}); 
    //  console.log(this.data.userfs);
    }

   }

 
 })
},
  // 判断  关注表中是否有   username  关注  friendsName
  decideGZ(username,friendsName){
    const db = wx.cloud.database();
    db.collection('Friends').where({
      userName:username,
     }).get().then(res=>{
      // console.log(res.data);
       return  res.data;
     })
  },

  //  查询关注表
    seeGZ(username){
      const db = wx.cloud.database();
     db.collection('Friends').where({
      userName:username,
     }).get().then(res =>{
       console.log(res.data);
       for( var i in res.data){  
        if(res.data[i].friendsState==2){
      //  this.data.GZfriendsState.push(res.data[i].friendsState)
          this.data.GZfriendsName.push(res.data[i]);
        }
       }
      //  ,friendsState:this.data.GZfriendsState
      this.setData({friendsName:this.data.GZfriendsName})
      // 根据关注 查询用户表表
      this.seeuser();
     })
    },
    // 查询根据关注用户表
    seeuser(){
      const db = wx.cloud.database();
      for(var i  in this.data.friendsName){
     db.collection('register').where({
      userName:this.data.friendsName[i].friendsName,
     }).get().then(res =>{
      //  console.log(this.data.FrState[i]);
  
      res.data[0].strt=this.data.friendsName[i].friendsState;
      this.data.GZuser.push(res.data[0])
      // this.data.GZuser.push(this.data.friendsState[i])
      this.setData({  gzUSERs:this.data.GZuser}); 
      console.log(this.data.gzUSERs)
    })
      }
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
         var    withlovename = app.globalData.withlovename;
    // 查询关注表
    this.seeGZ(withlovename);
    // 查询粉丝表
      this.seeFS(withlovename);
    // 添加
    // this.addGZ();
    // text
    // this.decideGZFS('李艾');
  },

  // 清空集合函数
   arrDelet : function(){
    this.data.friendsName=[];
    this.data.GZfriendsName=[];
    this.data.GZuser=[];
    this.data.gzUSERs=[];

   },

//   gzbind: tool.debounce(function(e) {
//     this.gzbindd();
//  },1000),
  //  修改粉丝表  已知内容
    updataFS:function(username,friendsName,num){
      const db = wx.cloud.database();
      db.collection('Friends').where({
        userName:username
      }).get().then(res =>{
         console.log(res.data)
         for(var i in res.data){
           if(res.data[i].friendsName==friendsName){
            var  gzid = res.data[i]._id;
            console.log(gzid);
            // 查出该条数据id
            this.updataST(gzid,num);
           }
         }
      })

    },

    // 修改关注表
    updataGZ:function(name,num){
      // 先进行查询 操作
      const db = wx.cloud.database();
      db.collection('Friends').where({
        userName:name
       }).get().then(res =>{
          console.log(res.data)
        for(var i in res.data){
          if(res.data[i].friendsName==name){
            var  gzid = res.data[i]._id;
          // this.setData({gzid:gzid});
          // console.log(this.data.gzid)
          this.updataST(gzid,2);
          }
        }
      })
    },
    

    // 修改关注表状态值
    updataST:function(id,num){
      const dbd = wx.cloud.database();
      console.log(num)
      dbd.collection('Friends').doc(id).update({
     data:{
      friendsState:num
    }
    }).then(res=>{
      console.log(res)

    }).catch(res=>{

    })
    },
  // 关注  关注
  gzbind:function(){
  //  console.log("进入")
   var idx = e.target.dataset.index;
   console.log(idx);
   var name = this.data.gzUSERs[idx].userName;
   console.log(name);
    var FrState= this.data.gzUSERs;
 
  //  tool.debounce(function() {
    if( FrState[idx].strt == '2'){
      //  点击关注
      // console.log("已关注"+FrState[idx].strt);
        FrState[idx].strt = '1';
        this.data.GZuser[idx].strt =   FrState[idx].strt ;
        this.setData({ gzUSERs: this.data.GZuser});
          // console.log(this.data.gzUSERs);
          this.updataGZ(name,1);
     }else{
      // console.log("关注"+FrState[idx].strt);
      FrState[idx].strt = '2';
      this.data.GZuser[idx].strt =   FrState[idx].strt ;
      this.setData({ gzUSERs: this.data.GZuser});
        // console.log(this.data.gzUSERs);
        this.updataGZ(name,3);

     }
    //  },1000)

  },
  // 粉丝关注操作
  fsbind:function(){
    console.log("进入")
    var idx = e.target.dataset.index;
    // 拿到当前用户的名字
    var withlovename  =app.globalData.withlovename;
    var name = this.data.userfs[idx].userName;
    console.log(name);
    var FrState= this.data.userfs;
    if( FrState[idx].strt == 2){
       console.log("回关操作 添加")
      //  假设列表中没有李艾关注 name  添加一条
       var  FSdata = this.decideGZ(withlovename,name);
       if(FSdata==''){
       console.log('控住')
      //  FrState[idx].strt = 1;
      //  this.data.FSuser[idx].strt =   FrState[idx].strt ;
      //  this.setData({  userfs:this.data.FSuser}); 
      //    this.addGZ(withlovename,name)
       }else{
            //  互相关注
         console.log("有点东西");
        //  有列表就修改
        this.updataFS(withlovename,name,2);
        // 获取该用户的关注列表
          this.decideGZFS(withlovename,FrState,idx);
        
    
       }
     
    }else if( FrState[idx].strt == 3){
    //  互相关注的情况下，
        // 修改name 粉丝    自己列表的粉丝
        for(var x in this.data.FSmy ){
           console.log(this.data.FSmy);
             this.data.FSmy[x]._id;
             this.updataFS(this.data.FSmy[x].userName,this.data.FSmy[x].friendsName,2)
        }
          
      FrState[idx].strt = 2;
       this.data.FSuser[idx].strt =   FrState[idx].strt ;
       this.setData({  userfs:this.data.FSuser}); 
     
    }

  },
  // 搜索取消事件
  onCancel(e){
      this.setData({value:''});
    this.data.friendsName=[];
     this.data.GZfriendsName=[];
     this.data.GZuser=[];
     this.data.gzUSERs=[];
  console.log("取消事件");
  var withlovename= app.globalData.withlovename;
  this.seeGZ(withlovename);
  },
  // onSearch 确认搜索内容
  onSearch(e){
    var withlovename= app.globalData.withlovename;
     this.data.friendsName=[];
     this.data.GZfriendsName=[];
     this.data.GZuser=[];
     this.data.gzUSERs=[];
    const  vlaue =  e.detail;
    console.log("确认"+vlaue);
   this.setData({inputValue:vlaue})
const db = wx.cloud.database(); //初始化数据库
db.collection("Friends").where({
    userName:withlovename,
  friendsName:{
     $regex:'.*'+ this.data.inputValue,
     $options: 'i'
     //这个查询就是查询all表中 字段为name中 like你传的值的所有数据
//后面的$options:'1' 代表这个like的条件不区分大小写
   }
 }).get().then(res =>{
   if(res.data!=null){
    for( var i in res.data){  
      this.data.GZfriendsName.push(res.data[i].friendsName);
     }
    this.setData({friendsName:this.data.GZfriendsName})
    this.seeuser();
   }else{
     console.log("空值")
   }



});


    
  },
  // 点击跳转
  gzindex(e){
    console.log(e.currentTarget.id);
   const  tid = e.currentTarget.id;
    console.log(tid)
   wx.navigateTo({
     url: '../index/index?id='+tid+''
     })

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
    // 跳回
    onClickLeft(){
      wx.navigateBack({
         delta: 1 //跳转的级数
         })
  
    },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})