//用户数据示例

var app = getApp();
const db = wx.cloud.database();
  var  name   = app.globalData.withlovename;
db.collection('Friends').where({userName:name,friendsState:2}).get({
      success:function(r)
      {
          console.log(r.data)
          r.data.push({friendsName:name})
     for(let g = 0;g <r.data.length; g++)
    {
        friend.push({});
        
    }
    for(let index = 0; index<r.data.length; index++)
    {
        friend[index].friendsName = r.data[index].friendsName;
        
    }

    console.log(r.data.length)
 
    for(let e = 0;e < r.data.length ; e++)
    {    
        users.push({}); 
        console.log(friend)
        console.log(friend[e].friendsName)
        db.collection('register').where({
          userName: friend[e].friendsName
        }).get({
            success:function(res)
            {
                     // 输出 [{ "title": "The Catcher in the Rye", ... }]
                     console.log(res.data)   
                     console.log(users.length)                       
                        
                         console.log(users.length,e)    

                         users[e].uuid = res.data[0]._id;
                         users[e].name = res.data[0].userName;
                         users[e].password = res.data[0].userPassword;
                         users[e].avatar = 'https://7869-xiaopu-kxzgf-1302800822.tcb.qcloud.la'+res.data[0].userImg;
                       
                         console.log(users[e])
                     console.log(e)
                   console.log(users)
            }
        })
           

      }

    },error:function(res)
    {
        console.log(res)
    }
})

var friend = [];
var users = [
  
];

//群数据示例
let groups = [
 
];


function RestApi() {

}

RestApi.prototype.findFriends = function ( user) {
    var friendList = users.filter(v => v.uuid != user.uuid );    
    return friendList;  
}

RestApi.prototype.findGroups = function (user) {
    var groupList = groups.filter(v => v.userList.find(id => id == user.uuid));
    return groupList;
}

RestApi.prototype.findUser = function (username, password) {
    var user = users.find(user => (user.name == username && user.password == password))
    return user;
}

RestApi.prototype.findGroupMembers = function (groupId) {
    let members = [];
    let group = groups.find(v => v.uuid == groupId);
    users.map(user => {
        if (group.userList.find(v => v == user.uuid)) {
            members.push(user)
        }
    });
    return members;
}

export default new RestApi();