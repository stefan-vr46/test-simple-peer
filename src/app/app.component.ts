import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
// import { SimplePeer } from 'simple-peer';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit , AfterViewInit {
  // @ts-ignore
  @ViewChild('myvideo') myVideo: any;

  title = 'simple-peer-test';
  public msg = 'test';
  public p = null;
  n = <any> navigator;
  stream = null;

  ngOnInit(): void {
    this.turnOnCamera();
  }

  ngAfterViewInit(): void {

    console.log(document.querySelector('#incoming'))

    // @ts-ignore
    this.p = new SimplePeer({
      initiator: location.hash === '#1',
      trickle: false,
      streams: []
    })

    this.p.on('error', err => console.log('error', err))

    this.p.on('signal', data => {
      console.log('SIGNAL', JSON.stringify(data))
      document.querySelector('#outgoing').textContent = JSON.stringify(data)
    })

    document.querySelector('form').addEventListener('submit', ev => {
      ev.preventDefault()
      // @ts-ignore
      this.p.signal(JSON.parse(document.querySelector('#incoming').value))
    })

    this.p.on('connect', () => {
      console.log('CONNECT')
      this.p.send('whatever' + Math.random())
    })

    this.p.on('data', data => {
      console.log('data: ' + data)
    });

    // this.p.on('stream', stream => {
    //   // got remote video stream, now let's show it in a video tag
    //
    //   this.myVideo.nativeElement.srcObject = stream;
    //   this.myVideo.nativeElement.play();
    //   console.log(stream);
    // });

    this.p.on('track', (track, stream) => {
      console.log('track');
    });
    this.p.on('stream', stream => {
      console.log('stream', stream);
      this.myVideo.nativeElement.srcObject = stream;
      this.myVideo.nativeElement.play();
    });

  }

  send() {
    this.p.send(this.msg);
    this.msg = '';
  }

  turnOnCamera(){
    let that = this;
    const video = that.myVideo.nativeElement;

    this.n.getUserMedia = (this.n.getUserMedia || this.n.webkitGetUserMedia || this.n.mozGetUserMedia || this.n.msGetUserMedia);
    this.n.getUserMedia({video: true, Audio: true}, function(stream) {

      that.stream = stream;

      // that.myVideo.nativeElement.srcObject = stream;
      // video.play();
      console.log(stream);
    }, function() {});

    console.log(this.stream);

  }

  turnOfCamera(){
    this.myVideo.nativeElement.srcObject = null;
  }

   async addStreamToConnection(){


     this.p.addStream(this.stream);

    //  for (const track of gumStream.getTracks()) {
    // }
    // this.p.addTrack(this.stream);
  }

   async removeStreamFromConnection(){

     this.p.removeStream(this.stream);

    //  for (const track of gumStream.getTracks()) {
    // }
    // this.p.addTrack(this.stream);
  }
}
