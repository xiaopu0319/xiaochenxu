  var app =getApp();
Page({

  data: {

    longitude: 0,  //默认定位经度

    latitude: 0,   //默认定位纬度
    address:'',
    markers: [
    //八教垃圾桶位置
]

  },
  onLoad: function () {
     var name= app.globalData.withlovename;
    var that = this;

    wx.getLocation({

      type: "wgs84",

      success: function (res) {

        var app = getApp();
        const db = wx.cloud.database();
        db.collection('Map').where({userName:name}).get({
          success:function(res)
          {
            console.log(res.data)
            that.data.latitude = res.data[0].latitude;
            that.data.longitude = res.data[0].longitude;
            that.setData({
             longitude:res.data[0].longitude,
             latitude:res.data[0].latitude,
             address:res.data[0].address
            })
            console.log(that.data.latitude)
            
          }
        })

        

      }

    })

  },

  onReady: function () {
    const db = wx.cloud.database();
    const _ = db.command;
    var ma = this;
    db.collection('Map')
    .where({name:_.neq('李艾')})
    .get({
      success: function(res){
   console.log(res.data)
   var data = [];

 
 

   for(var i in res.data)
   {  
     data.push({});
     data[i].id = i;
     data[i].iconPath = 'https://7869-xiaopu-kxzgf-1302800822.tcb.qcloud.la'+res.data[i].userImg;
     data[i].longitude = res.data[i].longitude;
     data[i].latitude = res.data[i].latitude;
     data[i].width = 20,
     data[i].height = 30
   }
   console.log(data.length)
   var dad = data.filter(function(item,index,array){
    //元素值，元素的索引，原数组。
    return (item.address==ma.address);
});
console.log(dad);
     ma.setData({
      markers:dad
     })
   


      }
    })
 

  },
  leftmap(){

  console.log("小明子");

  wx.navigateTo({
    url: '../shopMap/shopMap'
    })

  }

})
