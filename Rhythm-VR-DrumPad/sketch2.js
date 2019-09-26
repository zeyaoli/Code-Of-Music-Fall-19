let world;

let isPlayingKick = false;
let isPlayingHiha = false;
let isPlayingTom = false;
let isPlayingSnare = false;

let boxIns;
let clickCount = 0;

// let kick = new Tone.Player("sounds/kick.wav").toMaster();
// let hiha = new Tone.Player("sounds/hiha.wav").toMaster();
let kit = new Tone.Players({
  "kick": "sounds/kick.wav",
  "hiha": "sounds/hiha.wav",
  "tom": "sounds/tom.wav",
  "snare": "sounds/snare.wav"
}, () => {
  start();
}).toMaster();
// Tone.Transport.scheduleRepeat(playBeat, "0.5s");

Tone.Transport.bpm.value = 120;
// Tone.Transport.swing = 0.5;


function playKick(time) {
  if (kit.loaded) {
    kit.get("kick").start(time);
  }
}


function playHiha(time) {
  if (kit.loaded) {
    kit.get("hiha").start(time);
  }
}

function playTom(time) {
  if (kit.loaded) {
    kit.get("tom").start(time);
  }
}

function playSnare(time) {
  if (kit.loaded) {
    kit.get("snare").start(time);
  }
}

// Tone.Buffer.on('load', start);

function repeat(e, time) {
  return Tone.Transport.scheduleRepeat(e, time);
}

function start() {
  Tone.Transport.start();
}

function stop() {
  Tone.Transport.stop();
}

// -----------------------------------------------

function setWorld() {
  world = new World('VRScene');

  let plane = new Plane({
    x: 0,
    y: 0,
    z: -3,
    width: 10,
    height: 10,
    red: 100,
    green: 50,
    blue: 50,
    rotationX: -90,
    // repeatX: 10,
    // repeatY: 10
  });
  world.add(plane);

  let box = new Box({
    x: -1,
    y: 0.5,
    z: -2,
    rotationY: 45,
    red: 200,
    green: 100,
    blue: 80,
    // event: 0,
    clickFunction: function(obj, event) {
      if (event && event.isTrusted) {

        console.log('clicked')

        if (!isPlayingKick) {
          this.repeatKick = repeat(playKick, "8n");
          // return this.event;
          isPlayingKick = true;
        } else {
          Tone.Transport.clear(this.repeatKick);
          isPlayingKick = false;
        }
      }
    }
  });
  world.add(box);


  let sphere = new Sphere({
    x: 0,
    y: 1.25,
    z: -5,
    radius: 1.25,
    red: 100,
    green: 200,
    blue: 50,
    clickFunction: function(obj, event) {
      if (event && event.isTrusted) {
        if (!isPlayingHiha) {
          playHiha();
          this.repeatHiha = repeat(playHiha, "4n");
          isPlayingHiha = true;
          let beat = Tone.Transport.position.split(":")[1];
          console.log(beat);
        } else {
          Tone.Transport.clear(this.repeatHiha);
          isPlayingHiha = false;
        }
      }
    }
  });
  world.add(sphere);

  let cylinder = new Cylinder({
    x: 1,
    y: 0.75,
    z: -3,
    radius: 0.5,
    height: 2,
    red: 20,
    green: 150,
    blue: 100,
    clickFunction: function(obj, event) {
      if (event && event.isTrusted) {

        console.log('clicked')

        if (!isPlayingTom) {
          this.repeatTom = repeat(playTom, "6n");
          // return this.event;
          isPlayingTom = !isPlayingTom;
        } else {
          Tone.Transport.clear(this.repeatTom);
          isPlayingTom = !isPlayingTom;
        }
      }
    }
  });
  world.add(cylinder);

  let cone = new Cone({
    x: -2,
    y: 1,
    z: -3.5,
    radiusTop: 0.5,
    radiusBottom: 1,
    red: 80,
    green: 20,
    blue: 200,
    clickFunction: function(obj, event) {
      if (event && event.isTrusted) {
        if (!isPlayingSnare) {
          playSnare();
          this.repeatSnare = repeat(playSnare, "2n");
          isPlayingSnare = true;
          console.log(Tone.Transport.position);
        } else {
          Tone.Transport.clear(this.repeatSnare);
          isPlayingSnare = false;
        }
      }
    }
  });
  world.add(cone);

}

function setup() {

  noCanvas();
  setWorld();
  world.setFlying();

}

function draw() {
  let userPos = world.getUserPosition();
  // console.log("z", userPos.z);
  // console.log("x", userPos.x);
  let tempoChange = map(userPos.z, -20, 20, 240, 0);
  Tone.Transport.bpm.rampTo(tempoChange, 2);
  let volumeChange = map(userPos.x, -8, 8, -20, 20);
  kit.volume.value = volumeChange;
  let swingChange = map(userPos.y, 0, 15, 0, 1);
  Tone.Transport.swing = swingChange;
  //
  // let userRot = world.getUserRotation();
  // console.log(userRot.x);
  // console.log(isFlying);
}