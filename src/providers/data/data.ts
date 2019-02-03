import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocketProvider } from '../socket/socket';

@Injectable()
export class DataProvider {
  socketUrl: string = 'http://localhost:8080';
  apiUrl: string = 'http://localhost';
  // Array
  feeds: any = [];
  rooms: any = [];
  user: any = [];
  clients: any = [];
  // Boolean
  isAuth: boolean = false;
  inRoom: boolean = false;
  // Object
  chats: any = {};
  headers:any = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  constructor(public http: HttpClient, public socket: SocketProvider) {
    if (localStorage.getItem('userData')) {
      this.user = JSON.parse(localStorage.getItem('userData'));
      this.isAuth = true;
    }
  }

  getFeed() {
    this.http.get(this.socketUrl + '/feed/' + this.user.user_id, { headers:this.headers })
    .subscribe(data => {
      let result:any = data;
      this.feeds = result.feed;
    }, error => {
      console.log("data:provider", error);
    });
  }

  getRoom(update?:boolean) {
    this.http.get(this.socketUrl + '/room/' + this.user.user_id, { headers: this.headers })
    .subscribe(data => {
      let room:any = data;
      if (room.count === 0) return;
      if (update) this.rooms = [];
      room.rooms.map(data => {
        let chat = {
          id: data.id,
          subject: data.subject,
          created: data.created,
          agronomis: data.agronomis,
          message: data.chat,
          new: 0
        }
        if (this.rooms.length === 0) {
          this.rooms.unshift(chat);
        }
        else {
          if (!this.roomExists(data.id)) {
            this.rooms.unshift(chat);
          }
        }
        this.updateMessage(data.id);
      });
      if (!update) this.roomsJoin();
    }, error => {
      console.log("data:provider", error);
    });
  }

  addRoom(body, cb?:any) {
    this.http.post(this.socketUrl + '/room', body, { headers: this.headers }).subscribe(data => {
      let room:any = data;
      // SOCKET JOIN
      this.socket.joinRoom(room.room_id);
      if (cb) cb(room);
    }, err => {
      console.log(err);
    })
  }

  updateMessage(roomId) {
    var that = this;
    this.http.get(this.socketUrl + "/room/read/" + roomId + "/" + this.user.user_id).subscribe(data => {
      let unread:any = data;
      Object.keys(this.rooms).forEach(function(id) {
        if (that.rooms[id].id === roomId) {
          that.rooms[id].new = unread.count;
        }
      });
    });
  }

  newMessage(roomId, chat?:any) {
    var that = this;
    Object.keys(this.rooms).forEach(function(id) {
      if (that.rooms[id].id === roomId) {
        that.rooms[id].new++;
        if (chat) {
          that.rooms[id].message = chat;
        }
      }
    });
  }

  isOnline(userId: number): boolean {
    if (this.clients.length === 0) return false;
    const index = this.clients.findIndex(user => user.id_user === userId);
    return index !== -1 ? true : false;
  }

  roomExists(roomId: string): boolean {
    const index = this.rooms.findIndex(chat => chat.id === roomId);
    return index !== -1 ? true : false;
  }

  roomRemove(roomId) {
    var that = this;
    Object.keys(this.rooms).forEach(function(id) {
      if (that.rooms[id].id === roomId) {
        that.rooms.splice(parseInt(id), 1);
      }
    });
  }

  roomsJoin() {
    let that = this;
    Object.keys(this.rooms).forEach(function(id) {
      that.socket.joinRoom(that.rooms[id].id);
      console.log('data:provider | joining room:', that.rooms[id].id);
    });
  }

  roomsLeave() {
    let that = this;
    Object.keys(this.rooms).forEach(function(id) {
      that.socket.leaveRoom(that.rooms[id].id);
      console.log('data:provider | leaving room:', that.rooms[id].id);
    });
  }

  getAgronomis(id) {
    let endpoint = 'v1/nama/' + id;
    return this.http.get(this.apiUrl + '/' + endpoint);
  }

  getChat(roomId) {
    return this.http.get(this.socketUrl + '/room/id/' + roomId, { headers: this.headers })
  }

  addChat(roomId, data) {
    let body = JSON.stringify(data);
    return this.http.post(this.socketUrl + '/room/id/' + roomId, body, { headers: this.headers });
  }

  readChat(roomId) {
    let body: any = JSON.stringify({ "userId": parseInt(this.user.user_id) });
    return this.http.post(this.socketUrl + '/room/read/' + roomId + '/' + this.user.user_id, body, { headers: this.headers });
  }

}
