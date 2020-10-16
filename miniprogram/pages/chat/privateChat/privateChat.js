/* privateChat.js */

const app = getApp();

Page({
	data: {
		content: '',
		friend: null,
		currentUser: null,

		messages: [],
		pendingMessages: [],
		
		//默认为false展示输入框, 为true时显示录音按钮
		recordVisible: false,

		//所有历史消息加载完成标识
		allHistoryLoaded: false,
	},
	onPullDownRefresh () {
		this.loadMoreHistoryMessage();
	},
	onLoad: function(options) {
		// 获取初始数据并加载
		var imService = app.globalData.imService;
		
		var friend = JSON.parse(options.friend);
		console.log(friend)
		var currentUser = imService.currentUser;
		var privateMessages = imService.getPrivateMessages(friend.uuid);
		console.log(privateMessages);
		var sentMessages = privateMessages.sentMessages;
	 //	console.log(sentMessages[0].payload.text);
		var pendingMessages = privateMessages.pendingMessages;
		console.log(pendingMessages);
		this.setData({
			friend: friend,
			messages: sentMessages,
			currentUser: currentUser,
			pendingMessages: pendingMessages
		});
		this.scrollToBottom();
		//收到的消息设置为已读
		if(sentMessages.length !=0){
			imService.markPrivateMessageAsRead(friend.uuid);
		}
		
		//传入监听器，收到一条私聊消息总是滚到到页面底部
		imService.onNewPrivateMessageReceive = (friendId, message) => {
			var messages = this.data.messages;
			var pendingMessages = this.data.pendingMessages;
			this.setData({
				messages: messages,
				pendingMessages: pendingMessages,
			});
			if (friendId == this.data.friend.uuid) {
				imService.markPrivateMessageAsRead(friendId);
				//收到新消息，是滚动到最底部
				this.scrollToBottom();
			};
		};

		//传入监听器，完成一次私聊历史加载时，如果加载结果为空，显示没有更多消息
		var self = this;
		imService.onPrivateHistoryLoad = (friendId, messages) => {
			wx.stopPullDownRefresh()
			if (messages.length == 0) {
				// 历史消息全部加载完成，开启提示
				self.setData({
					allHistoryLoaded: true
				});
			};
			// 渲染消息列表
			var lastMessages = this.data.messages;
			self.setData({
				messages: lastMessages
			});
		};
	},
	onUnload () {
		app.globalData.imService.onNewPrivateMessageReceive = function(){};
		app.globalData.imService.onPrivateHistoryLoad = function(){}
	},
	setContent(e) {
		// 监听输入的消息
		var content = e.detail.value;
		this.setData({
			content: content
		});
	},
	loadMoreHistoryMessage() {
		//历史消息
		var friendId = this.data.friend.uuid;
		
		var lastMessageTimeStamp = Date.now();
		var lastMessage = this.data.messages[0];
		if (lastMessage) {
			lastMessageTimeStamp = lastMessage.timestamp;
		}
		app.globalData.imService.loadPrivateHistoryMessage(friendId, lastMessageTimeStamp);
	},
	switchAudioKeyboard() {
		// 语音录制按钮和键盘输入的切换
		this.setData({
			recordVisible: !this.data.recordVisible
		});
		if(this.data.recordVisible){
				// 录音授权
			wx.authorize({
				scope: 'scope.record',
				success() {}
			});
		}
	},
	//更新pendingMessage，并且滚动到底部
	loadPendingMsg() {
		var pendingMessages = this.data.pendingMessages;
		this.setData({
			pendingMessages: pendingMessages
		});
		this.scrollToBottom();
	},
	onRecordStop(res) {
		app.globalData.imService.sendPrivateAudioMessage(this.data.friend.uuid, res.detail);
		this.loadPendingMsg();
	},
	sendTextMessage() { //发送消息
		if (this.data.content.trim() != '') {
			app.globalData.imService.sendPrivateTextMessage(this.data.friend.uuid, this.data.content);
			this.setData({
				content: ""
			});
			this.loadPendingMsg();
		};
	},
	sendImageAndVideo() {
		// 上传图片和视频
		let self = this;
		wx.chooseMedia({
			count: 1,
			mediaType: ['image', 'video'],
			success(res) {
				var friendId = self.data.friend.uuid;
				var imService = app.globalData.imService;
				if (res.type == 'image') {
					imService.sendPrivateImageMessage(friendId, res);
				} else {
					imService.sendPrivateVideoMessage(friendId, res);
				}
				self.loadPendingMsg();
			}
		})
	},
	previewImage(event) {
		// 预览图片
		let imagesUrl = [event.currentTarget.dataset.src];
		wx.previewImage({
			urls: imagesUrl // 需要预览的图片http链接列表
		})
	},
	//播放视频
	playVideo (e) {
		this.selectComponent("#videoPlayer").play({
			url : e.currentTarget.dataset.url,
			duration : e.currentTarget.dataset.duration
		})
	},
	scrollToBottom() { // 滑动到最底部
		wx.pageScrollTo({
			scrollTop : 200000,
			duration :10
		})
	},
	onClickLeft(){
    wx.navigateBack({
       delta: 1 //跳转的级数
       })

  }, 
	
	navigateBack() { //返回
		//将未读消息数清零
		app.globalData.imService.resetFriendUnReadMessage(this.data.friend);
		wx.redirectTo({
			url: '../friendList/friendList'
		});
	}
})
