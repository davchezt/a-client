import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SocketProvider {

  constructor(
    public http: HttpClient,
    public socket: Socket
  ) {
    
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinRoom(roomId) {
    this.socket.emit('subscribe', roomId); // subscribe socket
  }

  leaveRoom(roomId) {
    this.socket.emit('unsubscribe', roomId); // unsubscribe socket
  }

  emit(name: string, data: any) {
    this.socket.emit(name, data);
  }

  on(name) {
    let observable = new Observable(observer => {
      this.socket.on(name, (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

}
