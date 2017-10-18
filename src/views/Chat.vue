<template>
  <div v-title data-title="聊天室">
    <Header></Header>
    <div class="circle" v-show="!userPanel&&!current.name" @click="userPanel=true;"><i class="fa fa-home fa-2x"></i></div>
    <div class="chat flex-column flex-center">
      <div class="flex-column-emp">
        <div class="circle" v-on:click="hasLogined=true;logIn();" v-show="!hasLogined">进入</div>
        <!-- <button v-on:click="hasLogined=true;logIn();" v-show="!hasLogined">进入</button>
        <button v-on:click="hasLogined=false;logOut()" v-show="hasLogined">退出</button> -->
      </div>
      <div class="chat-box flex-row flex-center">
        <div class="flex-row-emp" style="min-width:10px;"></div>
        <!-- user start -->
        <div class="user-panel flex-column flex-center" v-show="hasLogined&&userPanel">
          <div class="user-panel-head">
            通讯录
          </div>
          <div class="flex-row user-panel-tabs">
            <div class="flex-row-emp user-panel-tab" :class="{'tab-active':curTab==1}" @click="curTab=1;">在线用户
            </div>
            <div class="flex-row-emp user-panel-tab" :class="{'tab-active':curTab==2}" @click="curTab=2;">聊天室
            </div>
            <div class="flex-row-emp" :class="{'tab-active':curTab==3}" @click="curTab=3">最近联系
            </div>
          </div>
          <div class="flex-column-emp flex-column" style="width:100%;">
            <div class="flex-column-emp" style="width:100%;overflow:scroll;flex-wrap: nowrap;" v-show="curTab==1">
              <div style="height:25px;text-align:center;line-height:25px;">
                当前共{{chatList.length}}人在线
                <i class="fa fa-refresh btn-refresh" id="btnChatRefresh" @click="getChatList()"></i>
              </div>
              <div v-for="chat in chatList" v-if="chat" class="chatList flex-row flex-center" @click="chatWithPerson(chat);setPanel(false);notReadMesCount[chat._id]=null;">
                <span>{{chat.nickname}}</span>
                <span class="flex-row-emp"></span>
                <span class="badge">{{notReadMesCount[chat._id]}}</span>
              </div>
            </div>
            <div class="flex-column-emp" style="width:100%;overflow:scroll;flex-wrap: nowrap;" v-show="curTab==2">
              <div style="height:25px;text-align:center;line-height:25px;">
                当前共{{roomList.length}}个聊天室
                <i class="fa fa-refresh btn-refresh" id="btnRoomRefresh" @click="getRoomList()"></i>
              </div>
              <!-- 当前共{{roomList.length}}聊天室 -->
              <div class="input-group">
                <input type="text" class="form-control" placeholder="请输入房间名字" v-model="addRoomName">
                <span class="input-group-addon" v-on:click="addRoom">新增聊天室</span>
              </div>
              <div v-for="room in roomList" v-if="room" class="chatList flex-row flex-center" @click="enterRoom(room);setPanel(false);notReadMesCount[room.name]=null;">
                <span>{{room.name}}</span>
                <span class="flex-row-emp"></span>
                <span class="badge">{{notReadMesCount[room.name]}}</span>
                <span v-show="inRoom[room.name]" @click.stop="leaveRoom(room.name)"><i class="fa fa-sign-out fa-fw"></i></span>
                <span v-show="room.creator==socketInfo._id" @click.stop="removeRoom(room.name)"><i class="fa fa-close fa-fw"></i></span>
              </div>
            </div>
            <div class="flex-column-emp" style="width:100%;overflow:scroll;flex-wrap: nowrap;" v-show="curTab==3">
              <div v-for="recent in recentList" v-if="recentList" class="chatList flex-row flex-center" @click="chatRecent(recent);setPanel(false);">
                <span>{{recent.nickname||recent.name}}</span>
                <span class="flex-row-emp"></span>
                <span class="badge">{{notReadMesCount[recent._id||recent.name]}}</span>
                <i class="fa fa-group" v-if="recent.type=='room'"></i>
              </div>
            </div>
          </div>
          <div class="user-panel-exit flex-row">
            <div class="flex-row-emp" v-on:click="logOut()">退出</div>
            <!-- <div class="flex-row-emp" v-on:click="userPanel=false;">隐藏</div> -->
          </div>
        </div>
        <!-- user end -->
        <div class="flex-row-emp" style="min-width:10px;max-width:50px;" v-if="userPanel&&current&&current.name"></div>
        <!-- chat start -->
        <div class="chat-panel flex-column flex-center" v-if="current&&current.name">
          <div class="chat-panel-head flex-row flex-center">
            <i class="fa fa-user-circle-o fa-fw" @click="userPanel=!userPanel"></i>
            <div class="flex-row-emp"></div>
            {{current.name}}
            <div class="flex-row-emp"></div>
            <i class="fa fa-address-book-o fa-fw" v-if="current.type=='room'" @click="usersShow=!usersShow;"></i>
            <i class="fa fa-sign-out fa-fw" v-if="current.type=='room'" @click="leaveRoom(current.id);setPanel(true)"></i>
            <i class="fa fa-close fa-fw" @click="initCurrent();setPanel(true)"></i>
          </div>
          <div class="flex-row flex-column-emp" style="width:100%;">
            <div class="flex-column flex-row-emp" style="width:100%;padding:10px 5px;overflow:scroll;flex-wrap: nowrap;" v-bind:id="'mesArea'+current.id">
              <!-- mes start -->
              <div v-for="(mes,index) in messages[current.id]">
                <div v-if="mes.info">
                  <div class="well well-sm text-center" style="margin-bottom:5px;">
                    <b>【{{mes.user}}】</b>{{mes.info}}
                    <span style="color:#999">{{mes.time|formatTime}}</span>
                  </div>
                </div>
                <div v-else-if="mes.history" class="text-center">
                  <span style="color:#999;">{{mes.history}}</span>
                </div>
                <div v-else class="flex-row chat-mes" style="flex-shrink:0;width:100%;margin-bottom:5px;min-height:50px;">
                  <div class="flex-column flex-center" style="padding:0;">
                    <img v-bind:src="mes.user.avatar||avatarBaseUrl+'default.png'" class="img-circle" style="min-width:40px;height:40px;cursor:pointer;">
                    <div class="flex-column-emp"></div>
                  </div>
                  <div class="flex-column" style="width:100%;">
                    <div class="flex-row chat-body-info" style="color:#666">
                      <div><span>{{mes.user.nickname}}</span> <span style="color:#999">{{mes.time|formatTime}}</span></div>
                      <div class="flex-row-emp"></div>
                      <transition name="fade">
                        <div class="copy-msg" copymes v-bind:index="index"></div>
                      </transition>
                      <div class="btn-copy">
                        <i class="fa fa-copy chat-tool " v-on:click="copy(index)"></i>
                      </div>
                    </div>
                    <div class="chat-body" v-bind:index="index" message v-bind:message="mes.msg">
                    </div>
                  </div>
                </div>
              </div>
              <!-- mes end -->
            </div>
            <div v-if="current.type=='room' && usersShow" class="flex-column" style="max-width:150px;width:150px;min-width:100pxpadding:10px 5px;overflow:scroll;flex-wrap: nowrap;border-left:1px solid #ccc">
              <div v-for="user in roomUsers[current.id]">
                <div class="well well-sm text-center" style="margin-bottom:5px;">
                  {{user.nickname}}
                </div>
              </div>
            </div>
          </div>
          <div class="chat-panel-foot flex-column" id="chatIframeBox" tabindex="-1" style="outline:none;">
            <div class="chat-tools flex-row flex-start">
              <i tabindex="-1" class="fa fa-smile-o fa-lg fa-fw chat-tool" style="position: relative;outline:none;" v-on:click="toggleExpression($event)" v-on:blur="toggleExpression($event,false)">
                <div class="expression" style="cursor:auto;" onselect="return false">
                  <div >
                    <img class="emoji" v-bind:src="e.url" alt="" v-for="e in expression.emoji.list" v-on:click="addEmoji($event)">
                  </div>
                </div>
              </i>
              <i class="fa fa-photo fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-microphone fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-phone fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-video-camera fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-map-marker fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-info fa-lg fa-fw chat-tool"></i>
              <!-- <i class="fa fa-at fa-lg fa-fw chat-tool"></i> -->
              <i class="fa fa-save fa-lg fa-fw chat-tool"></i>
              <i class="fa fa-trash-o fa-lg fa-fw chat-tool" @click="clear()"></i>
              <div class="flex-row-emp"></div>
              <button class="btn btn-default" id="send" v-on:click="send($event)"><i class="fa fa-send-o"></i> 发送</button>
            </div>
            <iframe class="chat-iframe" frameborder="0" height="99" placeholder="请输入内容...">
              <!-- contenteditable="true" -->
            </iframe>
          </div>
        </div>
        <div class="flex-row-emp" style="min-width:10px;"></div>
      </div>
      <!-- chat end -->
      <div class="flex-column-emp"></div>
    </div>
  </div>
</template>
<script src="../assets/js/clipboard.js"></script>
<script>
import * as io from 'socket.io-client'
import Util from '../assets/js/util.js'
import Header from '../components/Header.vue'
export default {
  data() {
      return {
        User: null,
        serverUrl: null,
        socket: null,
        avatarBaseUrl: '',
        expression: {
          emoji: {
            list: [],
            url: ''
          }
        },
        recentList: [],
        socketInfo: null,
        chatList: [],
        roomList: [],
        messages: {},
        roomUsers: {},
        notReadMesCount: {},
        inRoom: {},
        curTab: 1, //1 人 2 群 3 最近
        addRoomName: '',
        usersShow: false,
        userPanel: true,
        curRoomUsers: null,
        current: {
          type: '',
          name: '',
          id: ''
        },
        hasLogined: false
      }
    },
    filters: {
      formatTime: Util.formatTime
    },
    updated() {
      $("div[message]").each(function() {
        $(this).html($(this).attr("message"));
      })
      if (this.current) {
        var div = document.getElementById('mesArea' + this.current.id);
        div && (div.scrollTop = div.scrollHeight);
      }
      var that = this;
      if ($('.chat-iframe').length > 0) {
        var obj = $('.chat-iframe')[0].contentWindow.document;
        $(obj).find('body').off('click').on('click', function(e) {
          var element = this;
          if (obj.designMode == 'off') {
            obj.designMode = 'on';
            $(element).focus();
          } else {
            return;
          }
        })
      }
      if ($('.chat-iframe').length) {
        this.activeChatIframe();
      }
    },
    created() {
      this.expression.emoji.url = global.expression.emoji;
      this.User = global.User;
      this.serverUrl = global.serverUrl;
      this.avatarBaseUrl = global.avatarBaseUrl;
      /*初始化表情列表*/
      var url = this.expression.emoji.url;
      for (var i = 0; i < 30; i++) {
        this.expression.emoji.list[i] = {
          name: 'emoji-' + (i + 1),
          url: url + 'emoji-' + (i + 1) + '.png'
        }
      };
    },
    components: {
      Header
    },
    methods: {
      activeChatIframe() {
        console.log('activeChatIframe')
        var that = this;
        var doms = $('.chat-iframe');
        var sendBtn = $("#send");
        // for (var i = 0, len = doms.length; i < len; i++) {
        var _win = doms[0].contentWindow; // 我们用 _win 变量代替 iframe window
        var _doc = _win.document; // 用 _doc 变量代替 iframe的document 
        _doc.designMode = 'On';
        $(_doc).off('keydown').on('keydown', function(e) {
            console.log(e)
            if ((e.keyCode == '13' && e.metaKey) || (e.keyCode == '13' && e.ctrlKey)) {
              sendBtn.click();
            }
          })
          // }
      },
      inactiveChatIframe() {
        console.log('inactiveChatIframe')
        var that = this;
        var doms = $('.chat-iframe');
        // for (var i = 0, len = doms.length; i < len; i++) {
        var _win = doms[0].contentWindow; // 我们用 _win 变量代替 iframe window
        var _doc = _win.document; // 用 _doc 变量代替 iframe的document 
        _doc.designMode = 'Off';
        // }
      },
      toggleExpression(e, sign) {
        if (sign === true) {
          $(e.target).find(".expression").show()
          $(e.target).focus();
        } else if (sign === false) {
          $(e.target).find(".expression").hide();
        } else {
          $(e.target).find(".expression").toggle();
          $(e.target).focus();
        }
      },
      addEmoji(e) {
        var _win = $($(e.target).parentsUntil(".chat-panel", ".chat-panel-foot")[0]).find(".chat-iframe")[0].contentWindow;
        // _win.document.getElementsByTagName('body')[0].innerHTML = '';
        if (navigator.userAgent.indexOf("MSIE") >= 0) {
          _win.selection.createRange().pasteHTML('<img src=' + e.target.src + ' style="width:20px;height:20px;">');
        } else {
          _win.focus();
          _win.document.execCommand('InsertHtml', '', '<img src=' + e.target.src + ' style="width:20px;height:20px;">');
        }
      },
      copy(index) {
        var con = $("div[message][index='" + index + "']");
        var copymsg = $("div[copymes][index='" + index + "']");
        copymsg.text(Util.copyTextToClipboard(con.text()));
        setTimeout(function() {
          copymsg.text('');
        }, 1000);
      },
      send(e) {
        var _win = $($(e.target).parentsUntil(".chat-panel", ".chat-panel-foot")[0]).find(".chat-iframe")[0].contentWindow;
        var content = _win.document.getElementsByTagName('body')[0].innerHTML;
        if (content == '') {
          return;
        }
        var that = this;
        if (that.current.type == 'room') {
          that.socket.emit('chat room send', {
            user: that.User,
            msg: content,
            room: that.current.id
          });
        } else if (that.current.type == 'person') {
          that.socket.emit('chat person send', {
            user: that.User,
            msg: content,
            from: that.socketInfo._id,
            to: that.current.id
          });
        }
        _win.document.getElementsByTagName('body')[0].innerHTML = '';
        $('.chat-iframe').blur();
      },
      clear() {
        this.messages[this.current.id] = [];
      },
      logIn() {
        var that = this;
        // that.socket = io(this.serverUrl);
        // // 发送登录个人信息
        // that.socket.on('chat info', function() {
        //   that.socket.emit('chat info', that.User);
        // })
        // that.socket = io.connect(that.serverUrl + 'chat');
        that.socket = io(global.chatServerUrl + '/chat');
        global.chatSocket = that.socket;
        that.socket.on('connect', function() {
          that.socket.on('chat info', function() {
            that.socket.emit('chat info', that.User);
          })

          function initChatList(data) {
            that.chatList = data;
            for (var i in that.chatList) {
              if (!that.chatList[i]) return;
              var person = that.chatList[i]._id;
              !that.messages[person] && that.$set(that.messages, person, []);
              !that.notReadMesCount[person] && that.$set(that.notReadMesCount, person, null);
            }
            if (that.current && that.current.type == 'person') {
              if (that.current.id) {
                var exist = false;
                for (var i in that.chatList) {
                  if (that.chatList[i]._id == that.current.id) {
                    exist = true;
                  }
                }
                if (!exist) {
                  Util.hint('【' + that.current.name + '】下线了');
                  that.initCurrent();
                }
              }
            }
            $("#btnChatRefresh").removeClass('fa-spin');
          }

          function initRoomList(data) {
            that.roomList = data;
            for (var i = 0, len = that.roomList.length; i < len; i++) {
              // if (!that.roomList[i]) return;
              var room = that.roomList[i].name;
              !that.messages[room] && that.$set(that.messages, room, []);
              !that.notReadMesCount[room] && that.$set(that.notReadMesCount, room, null);
              !that.inRoom[room] && that.$set(that.inRoom, room, false);
              !that.roomUsers[room] && that.$set(that.roomUsers, room, false);
            }
            $("#btnRoomRefresh").removeClass('fa-spin');
          }
          that.socket.on('chat list', function(data) {
            initChatList(data);
          })
          that.socket.on('room list', function(data) {
            initRoomList(data);
          })
          that.socket.on('enter room', function(data) {
            var id = data.room;
            that.roomUsers[id] = data.roomUsers;
            that.messages[id].push({
              info: '进入了房间',
              user: data.user.nickname,
              time: data.time
            });
          })
          that.socket.on('leave room', function(data) {
            var id = data.room;
            that.roomUsers[id] = data.roomUsers;
            that.messages[id].push({
              info: '离开了房间',
              user: data.user.nickname,
              time: data.time
            });
          })
          that.socket.on('room exist', function(data) {
            Util.hint('房间名已被占用', 1000);
          })
          that.socket.on('chat receive', function(data) {
            var id = data.room || data.from;
            that.messages[id].push(data)
            if (that.notReadMesCount[id]) {
              that.notReadMesCount[id]++;
            } else {
              that.notReadMesCount[id] = 1;
            }
            that.notReadMesCount[that.current.id] = null;
            if (data.from) {
              var msg = '<b>【' + data.user.nickname + '】</b>' + data.msg;
              Util.msg(msg, function() {
                that.current.type = 'person';
                that.current.name = data.user.nickname;
                that.current.id = data.from;
              }, 2000);
            }
            // that.$set(that.notReadMesCount, that.current.id, null);
          })
          that.socket.on('chat receive self', function(data) {
            data.to && that.messages[data.to].push(data);
          })
          that.socket.on('log in', function(data) {
            if (that.socketInfo && that.socketInfo._id == data.logInInfo._id /*&& that.socketInfo.id != data.id*/ ) {
              that.logOut();
              Util.hint('您已经在其他地方登录，被签退。', 1500);
              // alert("您已经在其他地方登录，被签退。")
              return;
            } else if (!that.socketInfo) {
              that.socketInfo = data.logInInfo;
            }
            initChatList(data.chatList);
            initRoomList(data.roomList);
          });
        })
      },
      getChatList() {
        var that = this;
        that.socket.emit('chat list');
        $("#btnChatRefresh").addClass('fa-spin')
      },
      getRoomList() {
        var that = this;
        that.socket.emit('room list');
        $("#btnRoomRefresh").addClass('fa-spin')
      },
      getRoomUsers(room) {
        var that = this;
        that.socket.emit('get room users', room);
      },
      logOut() {
        var that = this;
        that.initCurrent();
        that.initState();
        that.socket.disconnect();
        that.hasLogined = false;
        delete global.chatSocket;
      },
      addRoom() {
        var that = this;
        if (!that.addRoomName) {
          Util.hint('房间名不能为空', 1000)
          return;
        }
        that.socket.emit('add room', that.addRoomName);
        that.addRoomName = '';
      },
      removeRoom(room) {
        var that = this;
        if (!room) {
          return;
        }
        that.socket.emit('remove room', room);
      },
      chatRecent(recent) {
        var that = this;
        if (recent.type == 'person') {
          that.chatWithPerson(recent);
          that.notReadMesCount[recent._id] = null;
        }
        if (recent.type == 'room') {
          that.enterRoom(recent);
          that.notReadMesCount[recent.name] = null;
        }
      },
      enterRoom(room) {
        var that = this;
        that.current.type = 'room';
        that.current.name = room.name;
        that.current.id = room.name;
        if (!that.inRoom[room.name]) {
          that.socket.emit('enter room', room.name);
          that.inRoom[room.name] = true;
          if (that.messages[room.name].length) {
            that.messages[room.name].push({
              history: '--- 以上为历史消息 ---',
            });
          }
        }
        var recent = Util.deepCopy(room);
        recent.type = 'room';
        var exist = false;
        for (var i in that.recentList) {
          if (that.recentList[i].name == recent.name) {
            that.recentList.splice(i, 1);
          }
        };
        !exist && (that.recentList.unshift(recent));
      },
      leaveRoom(room) {
        var that = this;
        that.socket.emit('leave room', room);
        that.inRoom[room] = false;
        that.initCurrent();
        // that.$set(that.inRoom,room,false);
      },
      chatWithPerson(person) {
        var that = this;
        that.current.type = 'person';
        that.current.name = person.nickname;
        that.current.id = person._id;

        var recent = Util.deepCopy(person);
        recent.type = 'person';
        var exist = false;
        for (var i in that.recentList) {
          if (that.recentList[i]._id == recent._id) {
            that.recentList.splice(i, 1);
          }
        };
        that.recentList.unshift(recent);
      },
      initCurrent() {
        var that = this;
        that.current.type = '';
        that.current.name = '';
        that.current.id = '';
      },
      initState() {
        var that = this;
        that.socketInfo = null;
        that.chatList = [];
        that.roomList = [];
      },
      setPanel(sign) {
        // console.log($(window).width());
        var that = this;
        if (sign) { //user panel
          that.userPanel = true;
        } else {
          if ($(window).width() <= 500) {
            that.userPanel = false;
          }
        }
      }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chat {
  position: fixed;
  top: 50px;
  bottom: 0;
  width: 100%;
}

.chat-box {
  width: 100%;
  /*background: #ccc;*/
  height: 600px;
}

.flex-center {
  justify-content: center;
  align-items: center;
}

.flex-start {
  justify-content: flex-start;
  align-items: center;
}

.flex-end {
  justify-content: flex-end;
  align-items: center;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column-emp {
  flex: 1;
  /*height: 100%;*/
}

.flex-row-emp {
  flex: 1;
  /*width: 100%;*/
}

.chat-panel {
  width: 800px;
  min-width: 320px;
  height: 100%;
  background: #eee;
  border-radius: 10px;
  border: 2px solid #ccc;
}

.user-panel {
  width: 300px;
  min-width: 200px;
  height: 100%;
  background: #eee;
  border-radius: 10px;
  border: 2px solid #ccc;
}

.chat-panel-head {
  height: 40px;
  min-height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  padding: 0 5px;
}

.user-panel-head {
  height: 40px;
  min-height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}

.user-panel-tabs {
  width: 100%;
  background: #f8f8f8;
  text-align: center;
  min-height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  height: 40px;
}

.user-panel-exit {
  width: 100%;
  text-align: center;
  min-height: 40px;
  line-height: 40px;
  height: 40px;
  cursor: pointer;
  border-top: 1px solid #ccc;
}

.tab-active {
  background: #fff;
}

.chat-panel-foot {
  height: 140px;
  min-height: 140px;
  width: 100%;
  border-top: 1px solid #ccc;
}

.chat-tools {
  height: 40px;
  min-height: 40px;
  color: #666;
  background: #f8f8f8;
  /*border-bottom: 1px solid #ccc;*/
  padding: 0 5px;
}

.chat-tool:hover {
  color: #000;
}

.btn-refresh {
  cursor: pointer;
}

.chat-iframe {
  background: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.chat-body-info {
  height: 25px;
  line-height: 25px;
  background: #f8f8f8;
  width: 100%;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom: 1px dotted #eee;
  padding: 0 3px;
}

.chat-body {
  background: #fff;
  width: 100%;
  line-height: 23px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  padding: 0 3px;
  word-break: break-all;
}

.btn-copy {
  padding-left: 5px;
  display: none;
}

.chat-body-info:hover>.btn-copy {
  display: block;
}

.chat-message {
  margin-top: 5px;
}


/*表情*/

.expression {
  position: absolute;
  text-align: left;
  bottom: 20px;
  left: 0px;
  max-width: 150px;
  min-width: 150px;
  border-radius: 5px;
  opacity: 0.9;
  background: #B0E2ff;
  border: 1px solid #408ff2;
  padding: 3px;
  display: none;
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  /* you could also put this in a class */
  -webkit-user-select: none;
  /* and add the CSS class here instead */
  -ms-user-select: none;
  user-select: none;
  /**禁止选中文字*/
}

.circle {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 100px;
  height: 100px;
  background: #ccc;
  border-radius: 50px;
  line-height: 100px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  z-index: 100;
}

.chatList {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: #fff;
  padding: 0 10px;
  border-bottom: 1px solid #ccc;
}

img.emoji {
  width: 20px;
  height: 20px;
}

@media screen and (max-width: 550px) {
  .user-panel {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 1000;
    border: none;
    border-radius: 0;
  }
  .chat-panel {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 999;
    border: none;
    border-radius: 0;
  }
}
</style>
