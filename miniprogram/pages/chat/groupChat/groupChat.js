/* groupChat.js */

const app = getApp()

Page({
	data: {
		content: '',
		group: null,
		messages: [],
		pendingMessages: [],
		
		//默认为false展示输入框, 为true时显示录音按钮
		recordVisible: false,
		
		currentUser: null,
		groupMemberNum: 0,
		groupMembersMap: {},
		allHistoryLoaded: false,
	},
	onPullDownRefresh () {
		this.loadMoreHistoryMessage();
	},
	onLoad(options) {
		var group = JSON.parse(options.group);
		var imService = app.globalData.imService;
		var groupMemberMap = imService.getGroupMembers(group.uuid);
		var groupMemberNum = Object.keys(groupMemberMap).length;
		var sentMessages = imService.getGroupMessages(group.uuid).sentMessages;
		this.setData({
			group: group,
			groupMemberNum: groupMemberNum,
			groupMembersMap: groupMemberMap,
			currentUser: imService.currentUser,
			messages: sentMessages,
			pendingMessages: imService.getGroupMessages(group.uuid).pendingMessages
		});
		this.scrollToBottom();
		//收到的消息设置为已读
		if(sentMessages.length !=0){
			imService.markGroupMessageAsRead(group.uuid);
		}

		//传入监听器，收到一条私聊消息总是滚到到页面底部
		imService.onNewGroupMessageReceive = (groupId, message) => {
			var messages = this.data.messages;
			var pendingMessages = this.data.pendingMessages;
			self.setData({
				messages: messages,
				pendingMessages: pendingMessages
			});
			if (groupId == this.data.group.uuid) {
				//收到新消息，是滚动到最底部
				this.scrollToBottom();
				imService.markGroupMessageAsRead(groupId)
			}
		};

		//传入监听器，完成一次私聊历史加载时，如果加载结果为空，显示没有更多消息
		var self = this;
		imService.onGroupHistoryLoad = (groupId, messages) => {
			wx.stopPullDownRefresh()
			if (messages.length == 0) {
				//todo:灰色，就不能点击了
				self.setData({
					allHistoryLoaded: true
				});
			}
			var lastMessages = this.data.messages;
			self.setData({
				messages: lastMessages
			});
		};
	},
	onUnload() {
		//退出聊天页面之前，清空页面传入的监听器
		app.globalData.imService.onNewGroupMessageReceive = (groupId, message) => {};
		app.globalData.imService.onGroupHistoryLoad = (groupId, messages) => {};
	},
	setContent(e) {
		var currentContent = e.detail.value;
		this.setData({
			content: currentContent
		});
	},
	loadMoreHistoryMessage() { //历史消息
		var groupId = this.data.group.uuid;
		var lastMessageTimeStamp = Date.now();
		var lastMessage = this.data.messages[0];
		if (lastMessage) {
			lastMessageTimeStamp = lastMessage.timestamp;
		}
		app.globalData.imService.loadGroupHistoryMessage(groupId, lastMessageTimeStamp);
	},
	showMembers() { //显示群成员
		wx.navigateTo({
			url: '../groupMember/groupMember?group=' + JSON.stringify(this.data.group)
		});
	},
	navigateBack() { //返回
		app.globalData.imService.resetGroupUnReadMessage(this.data.group); //清空未读消息
		wx.redirectTo({
			url: '../contacts/contacts'
		});
	},
	scrollToBottom() { // 滑动到最底部
		wx.pageScrollTo({
			scrollTop : 200000,
			duration :10
		})
	},
	loadPendingMsg() {
		//更新pendingMessage，并且滚动到底部
		var pendingMessages = this.data.pendingMessages;
		this.setData({
			pendingMessages: pendingMessages
		});
		this.scrollToBottom();
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
	onRecordStop(res) {
		app.globalData.imService.sendGroupAudioMessage(this.data.group.uuid, res.detail);
		this.loadPendingMsg();
	},
	sendTextMessage() { //发送消息
		if (this.data.content.trim() != "") {
			app.globalData.imService.sendGroupTextMessage(this.data.group.uuid, this.data.content);
			this.setData({
				content: ""
			});
			this.loadPendingMsg();
		}
	},
	sendImageAndVideo() {
		// 发送图片和视频
		let self = this;
		wx.chooseMedia({
			count: 1,
			mediaType: ['image', 'video'],
			success(res) {
				var groupId = self.data.group.uuid;
				var imService = app.globalData.imService;
				if (res.type == "image") {
					imService.sendGroupImageMessage(groupId, res);
				} else {
					imService.sendGroupVideoMessage(groupId, res);
				}
				self.loadPendingMsg();
			}
		});
	},
	//播放视频
	playVideo (e) {
		console.log(e);
		this.selectComponent("#videoPlayer").play({
			url : e.currentTarget.dataset.url,
			duration : e.currentTarget.dataset.duration
		})
	},
	previewImage(event) {
		// 预览图片
		let imagesUrl = [event.currentTarget.dataset.src];
		wx.previewImage({
			urls: imagesUrl // 需要预览的图片http链接列表
		})
	}
})
