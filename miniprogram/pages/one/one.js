 var app =getApp();

Page({
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/component/pages/swiper/swiper'
    }
  },

  data: {
    imgurl:'https://7869-xiaopu-kxzgf-1302800822.tcb.qcloud.la',
    background: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1597209099854&di=23a66dbeb09849079f3f46a32196010b&imgtype=0&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D3744246908%2C3528765301%26fm%3D214%26gp%3D0.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1597207748609&di=36b85cdce998754ae2426924e4e11b06&imgtype=0&src=http%3A%2F%2Fimage.biaobaiju.com%2Fuploads%2F20180830%2F22%2F1535637788-yPpZcnIXbh.jpg', 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1427619798,3243000733&fm=26&gp=0.jpg'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,

    // van-tabbar
    active: 0,
    list: [
      {
        "pagePath":"pages/conversations/conversations",
        "iconPath":"chat-o",
         "text":"消息"
    
      },
      {
        "pagePath":"pages/one/one",
        "iconPath":"like-o",
         "text":"寻爱"
      },
      {
       "pagePath":"pages/map/map",
       "iconPath":"search",
        "text":"发现"
      },
      {
       "pagePath":"pages/my/my",
       "iconPath":"manager-o",
        "text":"我"
      }
         ],

    array: [],
   
  },
  methods:{
  switchTab(e){
const  data = e.currentTarget.dataset
const  url = data.path
   wx.switchTab({
     url: 'url',
   })
  this.setData({

   selecred:data.index
      
  })


  }


},
  // 跳转详细
  aabb(e){
   console.log(e.currentTarget.id);
   const  tid = e.currentTarget.id;
    console.log(tid)
   wx.navigateTo({
     url: '../index/index?id='+tid+''
     })

  },
  onShow :function(){
    const db = wx.cloud.database();
    var    name = app.globalData.withlovename;
    var sex = app.globalData.Sex;
    console.log(name);
    console.log(sex);
    const _ =db.command;
   
    db.collection('register').where({
       userName:_.neq(name)
    }).get({
     success: res=> {
       // res.data 包含该记录的数据
       console.log(res.data)
       var  abb =[]
       for(var i in res.data){
         console.log(res.data[i].userImg)
         if(res.data[i].userImg!="/1599706501199.png"  && res.data[i].userImg!="/1599706318894.png"){
          if(res.data[i].userSex!=sex){
            abb.push(res.data[i]);
            this.setData({array  : abb })

          }
              
         }
       }
   
   
         // console.log(this.data.array)
     },
     error:function(e){
       console.log(e);
     }
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 const db = wx.cloud.database();
 var    name = app.globalData.withlovename;
 const _ =db.command;

 db.collection('register').where({
    userName:_.neq(name)
 }).get({
  success: res=> {
    // res.data 包含该记录的数据
    console.log(res.data)
    var  abb =[]
    for(var i in res.data){
      console.log(res.data[i].userImg)
      if(res.data[i].userImg!="/1599706501199.png"  && res.data[i].userImg!="/1599706318894.png"){
       
            abb.push(res.data[i]);
            this.setData({array  : abb })
      }
    }


      // console.log(this.data.array)
  },
  error:function(e){
    console.log(e);
  }
})


  },
  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },

  changeAutoplay() {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },

  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },

  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  }
})