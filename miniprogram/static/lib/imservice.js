/*
 * @Author: jack.lu
 * @Date: 2020-4-21 10:10:20
 * @Last Modified by: jack.lu
 * @Last Modified time: 2020-4-21 15:01:41
 */

import GoEasyIM from './goeasy-im-1.1.1';
import restApi from './restapi';

function Friend(uuid, name, avatar) {
    this.uuid = uuid;
    this.name = name;
    this.avatar = avatar;
}

function Group(uuid, name, avatar) {
    this.uuid = uuid;
    this.name = name;
    this.avatar = avatar;
}

function CurrentUser(uuid, name, avatar) {
    this.uuid = uuid;
    this.name = name;
    this.avatar = avatar;
}

function IMService() {
    this.im = GoEasyIM.getInstance({
        host:'hangzhou.goeasy.io',
        appkey:'BC-d90a055d32af4ee283a509c52921bf1e'
    });
    //当前“我”
    this.currentUser = null;

    //会话列表
    this.conversations = {};

    //我的好友
    this.friends = {};
    //我的群
    this.groups = {};
    //私聊消息记录，map格式，每个好友对应一个数组
    this.privateMessages = {};

    //群聊消息记录，map格式，每个群对应一个数组
    this.groupMessages = {};

    /*
     * 监听器们
     *
     * 可以在页面里，根据需求，重写以下监听器，
     * 便于当各种事件触发时，页面能够执行对应的响应
     *
     */
    //收到一条私聊消息
    this.onNewPrivateMessageReceive = function (friendId, message) {};
    this.onConversationsUpdate = function (conversations) {};
    //完成一次私聊历史加载
    this.onPrivateHistoryLoad = function (friendId, messages) {};
    //收到一条群聊消息
    this.onNewGroupMessageReceive = function (groupId, message) {};
    //完成一次群聊历史加载
    this.onGroupHistoryLoad = function (groupId, messages) {};

    this.onFriendListChange = function(friends){}

}

//登录
IMService.prototype.login = function (username, password) {
    var user = restApi.findUser(username, password);
    if (user) {
        //初始化当前用户
        this.currentUser = new CurrentUser(user.uuid, user.name, user.avatar);
        //初始化联系人信息，包括群
        this.initialContacts();
        return true;
    } else {
        return false;
    }
};

//初始化联系人信息
IMService.prototype.initialContacts = function () {
    //查询并初始化好友信息
    let friendList = restApi.findFriends(this.currentUser);

    //将用户列表初始化为一个map，便于后续根据friendId得到friend
    friendList.map(friend => {
        this.friends[friend.uuid] = new Friend(friend.uuid, friend.name, friend.avatar);
    });

    //查询并初始化与自己相关的群信息
    let groupList = restApi.findGroups(this.currentUser);

    //将群列表初始化为一个map，方便后续根据groupId索引
    groupList.map(group => {
        this.groups[group.uuid] = new Group(group.uuid, group.name, group.avatar);
    });
};

//获取群成员
IMService.prototype.getGroupMembers = function (groupId) {
    let members = restApi.findGroupMembers(groupId);
    let membersMap = {};
    members.map(item => {
        membersMap[item.uuid] = item
    });
    return membersMap;
};

IMService.prototype.getGroupMessages = function (groupId) {
    if (!this.groupMessages[groupId]) {
        this.groupMessages[groupId] = {
            sentMessages:[],
            pendingMessages:[]
        };
    }
    return this.groupMessages[groupId]
};


IMService.prototype.getPrivateMessages = function (friendId) {
    if (!this.privateMessages[friendId]) {
        this.privateMessages[friendId] = {
            sentMessages:[],
            pendingMessages:[]
        };
    }
    return this.privateMessages[friendId]
};



//连接GoEasy
IMService.prototype.connectIM = function () {
    //初始化IM相关的监听器
    this.initialIMListeners();
    this.im.connect({
        id: this.currentUser.uuid,
        data: {
            avatar: this.currentUser.avatar,
            name: this.currentUser.name
        }
    }).then(() => {
        console.log('连接成功')
        this.initialConversations();
        this.initialFriendOnlineStatus();
        //订阅我的好友们的上下线信息
        this.subscribeFriendsPresence();
        //订阅与自己相关的群信息
        this.subscribeGroupMessage();
    }).catch(error => {
        console.log('连接失败,请确保网络正常，appkey和host正确，code:' + error.code + " content:" + error.content);
    });
};

//IM监听
IMService.prototype.initialIMListeners = function () {
    this.im.on(GoEasyIM.EVENT.CONNECTED, () => {
        console.log('连接成功.')
    });

    this.im.on(GoEasyIM.EVENT.DISCONNECTED, () => {
        console.log('连接断开.')
    });

    //监听会话列表
    this.im.on(GoEasyIM.EVENT.CONVERSATIONS_UPDATED, (conversations) => {        
        this.conversations = conversations;
        this.onConversationsUpdate(this.conversations)
    });

    //监听私聊消息
    this.im.on(GoEasyIM.EVENT.PRIVATE_MESSAGE_RECEIVED, (message) => {
        //更新私聊消息记录
        let friendId;

        if (this.currentUser.uuid == message.senderId) {
            friendId = message.receiverId;
        } else {
            friendId = message.senderId;
        }
        removePrivatePendingMessage(this, friendId, message);

        let friendMessages = this.getPrivateMessages(friendId);
        friendMessages.sentMessages.push(message);

        //如果页面传入了相应的listener，执行listener
        this.onNewPrivateMessageReceive(friendId, message);
    });

    //监听群聊消息
    this.im.on(GoEasyIM.EVENT.GROUP_MESSAGE_RECEIVED, (message) => {
        let groupId = message.groupId;

        removeGroupPendingMessage(this, groupId, message);

        //更新群聊消息记录
        let groupMessages = this.getGroupMessages(groupId);
        let sentMessages = groupMessages.sentMessages;
        sentMessages.push(message);
        //如果页面传入了相应的listener，执行listener
        this.onNewGroupMessageReceive(groupId, message);
    })

    //监听好友上下线
    this.im.on(GoEasyIM.EVENT.USER_PRESENCE, (user) => {
        console.log(user);
        
        //更新好友在线状态
        let onlineStatus = user.action == 'online' ? true : false;
        let friend = this.friends[user.userId];
        friend.online = onlineStatus;

        //如果页面传入了相应的listener，执行listener
        this.onFriendListChange(this.friends);
    });
};

//初始化好友在线状态
IMService.prototype.initialFriendOnlineStatus = function () {
    let friendIds = Object.keys(this.friends);
    this.im.hereNow({
        userIds: friendIds
    }).then(result => {
        let onlineFriends = result.content;
        onlineFriends.map(user => {
            let friend = this.friends[user.userId];
            friend.online = true;
        });
        this.onFriendListChange(this.friends);
    }).catch(error => {
        console.log(error)
        if (error.code == 401) {
            console.log("获取在线用户失败，您尚未开通用户在线状态，请登录GoEasy，查看应用详情里自助启用.");
        }
    })
};

//监听所有好友上下线
IMService.prototype.subscribeFriendsPresence = function () {
    let friendIds = Object.keys(this.friends);
    this.im.subscribeUserPresence(friendIds)
        .then(() => {
            console.log('监听好友上下线成功')
        })
        .catch(error => {
            console.log(error);
            if (error.code == 401) {
                console.log("监听好友上下线失败，您尚未开通用户状态提醒，请登录GoEasy，查看应用详情里自助启用.");
            }
        });
};

//获取会话列表
IMService.prototype.initialConversations = function () {
    let promise = this.im.latestConversations()
        promise.then(res => {
            this.conversations = res.content || {};
            this.onConversationsUpdate(res.content)
        }).catch(e => {
            console.log(e)
        });
        return promise
};


//订阅群消息
IMService.prototype.subscribeGroupMessage = function () {
    let groupIds = Object.keys(this.groups);
    this.im.subscribeGroup(groupIds)
        .then(() => {
            console.log('订阅群消息成功')
        })
        .catch(error => {
            console.log('订阅群消息失败')
            console.log(error)
        })
};

//加载单聊历史消息
IMService.prototype.loadPrivateHistoryMessage = function (friendId, timeStamp) {
    this.im.history({
        friendId: friendId,
        lastTimestamp: timeStamp
    }).then(result => {
        let history = result.content;
        let privateMessages = this.getPrivateMessages(friendId);
        let friendMessages = privateMessages.sentMessages;
        for (let i = history.length - 1; i >=0; i--) {
            friendMessages.unshift(history[i])
        }
        //如果页面传入了相应的listener，执行listener
        this.onPrivateHistoryLoad(friendId, history);
    }).catch(error => {
        console.log(error);
        if (error.code == 401) {
            console.log("您尚未开通历史消息，请登录GoEasy，查看应用详情里自助启用.");
        }
    })
};

//发送私聊消息
IMService.prototype.sendPrivateTextMessage = function (friendId, text) {
    let textMessage = this.im.createTextMessage({
        text: text
    });
    this.sendPrivateMessage(friendId, textMessage);
};

//私聊图片消息
IMService.prototype.sendPrivateImageMessage = function (friendId, imageFile) {
    let imageMessage = this.im.createImageMessage({
        file: imageFile,
        onProgress :function (progress) {
            console.log(progress)
        }
    });
    this.sendPrivateMessage(friendId, imageMessage);
};

//私聊视频消息
IMService.prototype.sendPrivateVideoMessage = function (friendId, videoFile) {
    let videoMessage = this.im.createVideoMessage({
        file: videoFile,
        onProgress :function (progress) {
            console.log(progress)
        }
    });
    this.sendPrivateMessage(friendId, videoMessage);
};

IMService.prototype.sendPrivateAudioMessage = function (friendId, audiofile) {
    let audioMessage = this.im.createAudioMessage({
        file: audiofile,
        onProgress :function (progress) {
            console.log(progress)
        }
    });

    this.sendPrivateMessage(friendId, audioMessage);
};

//发送私聊消息
IMService.prototype.sendPrivateMessage = function (friendId, message) {

    //加入pendingMessage列表，成功后将会被挪除
    let privateMessages = this.getPrivateMessages(friendId);
    privateMessages.pendingMessages.push(message);

    //发送
    this.im.sendPrivateMessage(friendId, message)
        .then((res) => {
            console.log(res)
        })
        .catch(e => {
            console.log(e)
        })
};

IMService.prototype.markPrivateMessageAsRead = function (friendId) {
    this.im.markPrivateMessageAsRead(friendId)
        .then(res => {
            console.log(res)
        })
        .catch(e => {
            console.log(e)
        })
};

//发送群聊消息
IMService.prototype.sendGroupTextMessage = function (groupId, message) {
    let textMessage = this.im.createTextMessage({
        text:message
    });
    this.sendGroupMessage(groupId, textMessage);
};

IMService.prototype.markGroupMessageAsRead = function (friendId) {
    this.im.markGroupMessageAsRead(friendId)
        .then(res => {
            console.log(res)
        })
        .catch(e => {
            console.log(e)
        })
};
//私聊图片消息
IMService.prototype.sendGroupImageMessage = function (groupId, imageFile) {
    let imageMessage = this.im.createImageMessage({
        file: imageFile,
        onProgress :function (progress) {
            console.log(progress)
        }
    });
    this.sendGroupMessage(groupId, imageMessage);
};


//私聊视频消息
IMService.prototype.sendGroupVideoMessage = function (groupId, videoFile) {
    let videoMessage = this.im.createVideoMessage({
        file: videoFile,
        onProgress :function (progress) {
            console.log(progress)
        }
    });
    this.sendGroupMessage(groupId, videoMessage);
};

IMService.prototype.sendGroupAudioMessage = function (groupId, audioFile) {
    let audioMessage = this.im.createAudioMessage({
        file: audioFile,
        onProgress :function (progress) {
            console.log(progress)
        }
    });
    this.sendGroupMessage(groupId, audioMessage);
};

IMService.prototype.sendGroupMessage =function(groupId, groupMessage) {
    //先放入Pending列表，待成功后挪除
    let  groupMessages = this.getGroupMessages(groupId);
    let pendingMessages = groupMessages.pendingMessages;
    pendingMessages.push(groupMessage)

    this.im.sendGroupMessage(groupId, groupMessage)
        .then((res) => {
            console.log(res)
        })
        .catch(e => {
            console.log(e)
        })
}

//群聊历史消息
IMService.prototype.loadGroupHistoryMessage = function (groupId, timeStamp) {
    this.im.history({
        groupId: groupId,
        lastTimestamp: timeStamp
    }).then(result => {
        let history = result.content;
        let groupMessages = this.getGroupMessages(groupId);
        let sentGroupMessages = groupMessages.sentMessages;
        for (let i = history.length - 1; i >= 0; i--) {
            sentGroupMessages.unshift(history[i]);
        }
        this.onGroupHistoryLoad(groupId, history);
    }).catch(error => {
        console.log(error)
        if (error.code == 401) {
            console.log("您尚未开通历史消息，请登录GoEasy，查看应用详情里自助启用.");
        }
    })
};

IMService.prototype.disconnect = function () {
    return this.im.disconnect()
};

IMService.prototype.formatDate = function (t) {
    t = t || Date.now();
		let time = new Date(t);
		let str= time.getMonth() < 9 ? ('0' + (time.getMonth() +1)) : (time.getMonth() +1);
		str += '-';
		str += time.getDate() < 10 ? ('0' + time.getDate()) : time.getDate();
		str += ' ';
		str += time.getHours();
		str += ':';
		str += time.getMinutes() < 10 ? ('0' + time.getMinutes()) : time.getMinutes();
		return str;
}


function removePrivatePendingMessage(imService,friendId, message){
    let privateMessages = imService.getPrivateMessages(friendId);
    let pendingMessages = privateMessages.pendingMessages;
    let pendingMessageIndex = pendingMessages.findIndex(item => item.messageId == message.messageId);
    if(pendingMessageIndex > -1) {
        pendingMessages.splice(pendingMessageIndex,1);
    }
}


function removeGroupPendingMessage(imService,groupId, message){
    let groupMessages = imService.getGroupMessages(groupId);
    let pendingMessages = groupMessages.pendingMessages;
    let pendingMessageIndex = pendingMessages.findIndex(item => item.messageId == message.messageId);
    if(pendingMessageIndex > -1) {
        pendingMessages.splice(pendingMessageIndex,1);
    }
}

export default IMService;