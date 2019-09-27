import { AfterViewInit, Component } from '@angular/core';
import {BetterSimplePeer} from "./better-simple-peer";
import {getUserMedia} from "./media-helpers";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  outgoing: string;
  desktop: any = null;
  title = 'simple-peer-test';
  msg = 'test';
  stream: MediaStream;
  remoteStream: MediaStream;
  peer: BetterSimplePeer;
  newPeer;


  ngAfterViewInit(): void {
    const isInitiator = location.hash === '#1';
    console.log({ isInitiator });

    if (!isInitiator) return;

    this.peer = this.createPeer(isInitiator);
  }

  setOutgoing(value: string) {
    this.outgoing = value;
  }

  private createPeer(isInitiator) {
    const peer = new BetterSimplePeer(isInitiator);
    peer.sdp$().subscribe(sdp => {
      console.log({ sdp });
      this.setOutgoing(JSON.stringify(sdp));
    });

    peer.error$().subscribe(error => console.log({ error }));
    peer.connect$().subscribe(connect => console.log({ connect }));
    peer.tracks$().subscribe(trackData => console.log({ trackData }));
    peer.msg$().subscribe(trackData => {
      const msg = '' + trackData;
      console.log(msg );
    });
    // peer.peer.on('data', data => {
    //   console.log('data: ' + data)
    // });

    peer.stream$().subscribe(stream => {
      console.log({ stream });
      this.remoteStream = stream;
    });

    return peer;
  }

  setAnswer(sdpValue: string, event) {
    if (!sdpValue) return;

    console.log('setting answer');
    event.preventDefault();
    const sdp = JSON.parse(sdpValue);
    this.peer.setSdp(sdp);
  }

  setOffer(sdpValue: string, event) {
    if (!sdpValue) return;

    event.preventDefault();
    const sdp = JSON.parse(sdpValue);
    const newPeer = this.createPeer(false);

    if (this.stream) newPeer.addStream(this.stream);

    newPeer.setSdp(sdp);
    this.peer = newPeer;
  }

  send() {
    // this.p.send(this.msg);
    // this.msg = '';
  }

  async turnOnCamera() {
    const stream = await getUserMedia({ audio: true, video: true });
    console.log('turned on');
    console.log({ stream });
    this.stream = stream;
  }

  turnOfCamera() {
    // this.myVideo.nativeElement.srcObject = null;
  }

  async addStreamToConnection() {
    const newPeer = this.createPeer(true);
    newPeer.addStream(this.stream);
    this.peer = newPeer;
  }

  async removeStreamFromConnection() {
    this.peer.removeStream(this.stream);
  }

  addAudioTrack() {
    this.peer.addTrack(this.stream.getAudioTracks()[0], this.stream);
  }

  addVideoTrack() {
    this.peer.addTrack(this.stream.getVideoTracks()[0], this.stream);
  }

  removeVideoTrack() {
    this.peer.removeTrack(this.stream.getVideoTracks()[0], this.stream);
  }

}
