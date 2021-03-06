
var pulseSynth = new Tone.Synth(pulseOptions).connect(pulseAnalyser).toMaster()
var squareSynth = new Tone.Synth(squareOptions).connect(squareAnalyser).toMaster()
var triangleSynth = new Tone.Synth(triangleOptions).connect(triangleAnalyser).toMaster()
var noiseSynth = new Tone.NoiseSynth().connect(noiseAnalyser).toMaster()

var song = {}
var pulsePart = new Tone.Part()
var squarePart = new Tone.Part()
var trianglePart = new Tone.Part()
var noisePart = new Tone.Part()

var button = document.querySelector('.play')
var songSelectors = document.querySelectorAll('.song')
var showNft = document.querySelector('.show_nft')
// var video = document.querySelector('video')

// function setVideo(index) {
//   video.src = songs[index].video
// }

function setSong(index) {
  song = songs[index]
  // if (songs[index].video) {
  //   setVideo(index)
  // }

  pulsePart.removeAll()
  squarePart.removeAll()
  trianglePart.removeAll()
  noisePart.removeAll()

  if (song.pulse != null) {
    pulsePart = new Tone.Part(function (time, note) {
      pulseSynth.triggerAttackRelease(note.name, note.duration, time, note.velocity)
    }, song.pulse)
  }

  if (song.square != null) {
    squarePart = new Tone.Part(function (time, note) {
      squareSynth.triggerAttackRelease(note.name, note.duration, time, note
        .velocity)
    }, song.square)
  }

  if (song.triangle != null) {
    trianglePart = new Tone.Part(function (time, note) {
      triangleSynth.triggerAttackRelease(note.name, note.duration, time,
        note.velocity)
    }, song.triangle)
  }

  if (song.noise != null) {
    noisePart = new Tone.Part(function (time, note) {
      noiseSynth.triggerAttackRelease(note.duration, time, note.velocity)
    }, song.noise)
  }
}

function start() {

  if (song.pulse != null) pulsePart.start(0)
  if (song.square != null) squarePart.start(0)
  if (song.triangle != null) trianglePart.start(0)
  if (song.noise != null) noisePart.start(0)


  // video.currentTime = 0
  // video.play()
}

function stop() {
  if (song.pulse != null) pulsePart.stop(0)
  if (song.square != null) squarePart.stop(0)
  if (song.triangle != null) trianglePart.stop(0)
  if (song.noise != null) noisePart.stop(0)

  // video.pause()
}

function songRemoveClass(songs) {
  songs.forEach(function (song) {
    song.classList.remove('active')
  })
}

setSong(0)
visualize()

const all_nft = []

showNft.addEventListener('click', function () {
  if (nft_id.value && !isNaN(Number(nft_id.value))) {
    nftContract.methods.getDynamicMelodiesById(Number(nft_id.value)).call().then((result) => {
      console.log('getDynamicMelodiesById 0:', result)
      getMelodies(result)
    })
  }

  if (creater_address.value) {
    nftContract.methods.getMelodiesByOwner(creater_address.value).call().then((result) => {
      console.log('getMelodiesByOwner:', result)
    })
  }
})

button.addEventListener('click', function () {

  if (Tone.Transport.state == 'started') {
    Tone.Transport.stop()
    button.textContent = 'Restart'

    stop()
  } else {
    Tone.Transport.start('+0.1', 0)

    start()

    Tone.Transport.stop('+' + song.length)

    button.textContent = 'Stop'
  }
})



const balanceList = []
const blockSynth1 = []
const blockSynth2 = []
const blockBass1 = []
const blockBass2 = []
const yinfu = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const yinjie = ['1', '2', '3', '4', '5', '6', '7'] //['C4,D4,G#2']

var jiepai = ['1/1', '1/2', '1/2', '1/2', '1/4', '1/4', '1/4', '1/4', '1/4', '1/4', '1/4', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/16', '1/16', '1/16', '1/16', '1/16']

var jiepai_avg = ['1/1', '1/2', '1/3', '1/4']

var jiepai_noise = ['1/1', '1/2', '1/16', '1/16', '1/16', '1/16', '1/16', '1/16', '1/16', '1/16', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/32', '1/32', '1/32', '1/32', '1/32', '1/32', '1/32', '1/32', '1/16', '1/16', '1/16', '1/16', '1/16', '1/16', '1/16', '1/16', '1/16', '1/16']

const fixBeats = ['1/2', '1/4', '1/4', '1/4', '1/4', '1/4', '1/4', '1/8', '1/8', '1/8']
const fixBeats2 = ['1/4', '1/4', '1/4', '1/4', '1/4', '1/4', '1/8', '1/8', '1/8']
const fixBeats3 = ['1/16', '1/16', '1/16', '1/4', '1/32', '1/8', '1/16', '1/32', '1/8']
const musicBasicNote = []

const BLOCK_COUNTS = 200
const UNI_CREATE_BLOCK = 10861674

async function getBlockNumber() {
  web3.eth.getBlockNumber().then(
    function (result) {
      console.log("blockNumber:" + result);
      //throughBlock(result);
      var randomBlockDiff = Math.round(Math.random() * (result - UNI_CREATE_BLOCK + BLOCK_COUNTS));

      console.log('randomBlockDiff:', randomBlockDiff)
      contract.getPastEvents('Transfer', {

        fromBlock: (result - BLOCK_COUNTS - randomBlockDiff),
        toBlock: (result - randomBlockDiff)
      }, function (error, events) {
        console.log('Transfer events:', events);

        events.forEach(event => {
          let balance = event.returnValues['amount']
          let to = event.returnValues['to']
          let from = event.returnValues['from']
          let blockHash = event.blockHash



          // if(jiepai[balance % jiepai.length] == undefined || jiepai_avg[to % jiepai.length] == undefined || jiepai[from % jiepai.length] == undefined || jiepai_noise[blockHash % jiepai.length] == undefined){
          //   console.log('jiepai[balance % jiepai.length]:', jiepai[balance % jiepai.length])
          //   console.log('jiepai_avg[to % jiepai.length]:', jiepai_avg[to % jiepai_avg.length])
          //   console.log('jiepai[from % jiepai.length]:', jiepai[from % jiepai.length])
          //   console.log('jiepai_noise[blockHash % jiepai.length]:', jiepai_noise[blockHash % jiepai_noise.length])

          //   console.log(`balance:${balance} , to:${to} , from: ${from} , blockHash: ${blockHash}`)
          // }
          //jiepai_avg jiepai_noise
          blockSynth1.push([notes[balance % 38], jiepai[balance % jiepai.length]])
          blockSynth2.push([notes[to % 38], jiepai[to % jiepai.length]])
          blockBass1.push([notes[from % 38], jiepai_avg[from % jiepai_avg.length]])
          blockBass2.push([notes[blockHash % 38], jiepai_noise[blockHash % jiepai_noise.length]])


        })
        console.log(`blockSynth1: ${blockSynth1}`)
        console.log(`blockSynth2: ${blockSynth2}`)
        console.log(`blockBass1: ${blockBass1}`)
        console.log(`blockBass2: ${blockBass2}`)
        var songofbloock = {
          'pulse': filterNotes(blockSynth1).notes,
          'square': filterNotes(blockSynth2).notes,
          'triangle': filterNotes(blockBass1).notes,
          'noise': filterNotes(blockBass2).notes,
          'length': '120',
          'video': 'file:///D://data//resetDAO//eth.mp4'
        }
        songs.push(songofbloock)


        console.log('begin start')
        console.log('songSelectors:', songSelectors)
        songSelectors.forEach(function (selector) {
          selector.addEventListener('click', function () {
            Tone.Transport.stop()
            console.log('click addEventListener')
            setSong(selector.dataset.index)
            songRemoveClass(songSelectors)
            selector.classList.add('active')
            setTimeout(function () {
              button.textContent = 'Start'
            }, 0)
          })
        })

      })

    })
}
var creater_address = document.getElementById('creater_address')
var nft_id = document.getElementById('nft_id')

//256 x 256 max

// nftContract.methods.getDynamicMelodiesById(0).call().then((result) => {
//   getMelodies(result)
// })

// nftContract.methods.getMelodyById(0).call().then((result) => { console.log('getMelodyById 0:', result) })

const getMelodies = (result) => {
  console.log('getDynamicMelodiesById(1) :', result)
  if (!result || result.length === 0) return null
    result.forEach(data => {
      let pulse1 = yinfu[data[0] % yinfu.length] + yinjie[data[1] % yinjie.length]
      let pulse1Beat = fixBeats2[data[2] % fixBeats2.length]
      let triangle = yinfu[data[3] % yinfu.length] + yinjie[data[4] % yinjie.length]
      let triangleBeat = fixBeats2[data[5] % fixBeats2.length]



      // if(jiepai[balance % jiepai.length] == undefined || jiepai_avg[to % jiepai.length] == undefined || jiepai[from % jiepai.length] == undefined || jiepai_noise[blockHash % jiepai.length] == undefined){
      //   console.log('jiepai[balance % jiepai.length]:', jiepai[balance % jiepai.length])
      //   console.log('jiepai_avg[to % jiepai.length]:', jiepai_avg[to % jiepai_avg.length])
      //   console.log('jiepai[from % jiepai.length]:', jiepai[from % jiepai.length])
      //   console.log('jiepai_noise[blockHash % jiepai.length]:', jiepai_noise[blockHash % jiepai_noise.length])

      //   console.log(`balance:${balance} , to:${to} , from: ${from} , blockHash: ${blockHash}`)
      // }
      //jiepai_avg jiepai_noise
      blockSynth1.push([pulse1, pulse1Beat])
      // blockSynth2.push([notes[to % 38], jiepai[to % jiepai.length]])
      blockBass1.push([triangle, triangleBeat])
      // blockBass2.push([notes[blockHash % 38], jiepai_noise[blockHash % jiepai_noise.length]])


    })
  console.log(`blockSynth1: ${blockSynth1}`)
  //console.log(`blockSynth2: ${blockSynth2}`)
  console.log(`blockBass1: ${blockBass1}`)
  // console.log(`blockBass2: ${blockBass2}`)
  var songofbloock = {
    'pulse': filterNotes(blockSynth1).notes,
    'square': filterNotes(blockBass1).notes,
    //'triangle': filterNotes(blockBass1).notes,
    //'noise': filterNotes(blockBass2).notes,
    'length': '85',
    'video': 'file:///D://data//resetDAO//eth.mp4'
  }
  songs.push(songofbloock)
  console.log('songSelectors:', songSelectors)
  songSelectors.forEach(function (selector) {
    selector.addEventListener('click', function () {
      Tone.Transport.stop()
      console.log('click addEventListener')
      setSong(selector.dataset.index)
      songRemoveClass(songSelectors)
      selector.classList.add('active')
      setTimeout(function () {
        button.textContent = 'Start'
      }, 0)
    })
  })
}

// getBlockNumber();

Tone.Transport.on('stop', function () {
  button.textContent = 'Restart'
  // video.pause()
})
