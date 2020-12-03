const PatchBay = require('./src/pb-live.js')//似乎是必要的 要考虑解耦这个
const HydraSynth = require('hydra-synth') //必要
const Editor = require('./src/editor.js') //编辑器 不需要
const loop = require('raf-loop') //似乎没用
const P5 = require('./src/p5-wrapper.js') //似乎是必要的 不知道在哪里调用了
const Gallery = require('./src/gallery.js') //需要 设置默认的草图有参考价值
const Menu = require('./src/menu.js')//菜单 不需要
const keymaps = require('./keymaps.js') //用于编辑器按键检测 不需要
const log = require('./src/log.js') //用于日志显示 不需要
const repl = require('./src/repl.js') //用于控制前端 不需要
const { Web3 } = require('web3')
const myApp = require('./src/js/app')
const addressList = []
const balanceList = []
const blockSynth1 = []
const blockSynth2 = []

var times = 0

// 获取地址余额
async function getBalance(address) {
  web3.eth.getBalance(address).then(
    function (result) {

      addressList.push(address)
      balanceList.push(result)
      console.log(address + "\t" + result); //地址 余额
      //};
      times++
    });
}

function init() {
  window.pb = pb
  window.P5 = P5


  var canvas = document.getElementById('hydra-canvas')
  // canvas.width = window.innerWidth * window.devicePixelRatio
  // canvas.height = window.innerHeight * window.devicePixelRatio
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.imageRendering = 'pixelated'

  let isIOS =
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream;

  let precisionValue = isIOS ? 'highp' : 'mediump'


  let web3 = new Web3(Web3.givenProvider || "https://kovan.infura.io/v3/a3456970132b4579a76f011dc13828c2"); //'ws://some.local-or-remote.node:8546'
  console.log(web3)
  let blockAmount = 150

  var jiepai = ['1/1', '1/2', '1/2', '1/2', '1/2', '1/4', '1/4', '1/4', '1/4', '1/4', '1/4', '1/4', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/16', '1/16', '1/16', '1/16', '1/16']



  const notes = []


  for (var i = 0; i < MarioSynth1.length; i++) {
    let note = MarioSynth1[i].name
    if (notes.indexOf(note) > -1) continue
    notes.push(note)
  }

  for (var i = 0; i < MarioSynth2.length; i++) {
    let note = MarioSynth2[i].name
    if (notes.indexOf(note) > -1) continue
    notes.push(note)
  }

  for (var i = 0; i < MarioBass1.length; i++) {
    let note = MarioBass1[i].name
    if (notes.indexOf(note) > -1) continue
    notes.push(note)
  }
  //ZeldaSynth1
  for (var i = 0; i < ZeldaSynth1.length; i++) {
    let note = ZeldaSynth1[i].name
    if (notes.indexOf(note) > -1) continue
    notes.push(note)
  }
  for (var i = 0; i < ZeldaSynth2.length; i++) {
    let note = ZeldaSynth2[i].name
    if (notes.indexOf(note) > -1) continue
    notes.push(note)
  }

  console.log(notes)
  getBlockNumber()
  myApp(times)


  var pb = new PatchBay()
  var hydra = new HydraSynth({ pb: pb, canvas: canvas, autoLoop: false, precision: precisionValue })
  //编辑器 不需要
  // var editor = new Editor()
  //菜单 不需要
  // var menu = new Menu({ editor: editor, hydra: hydra})
  //log.init()

  // get initial code to fill gallery
  var sketches = new Gallery(function (code, sketchFromURL) {
    // editor.setValue(code)
    console.log("GalleryGalleryGalleryGalleryGallery")
    repl.eval(code)

    // if a sketch was found based on the URL parameters, dont show intro window
    // if(sketchFromURL) {
    //   menu.closeModal()
    // } else {
    //   menu.openModal()
    // }
  })
  // menu.sketches = sketches

  //按键设置 不需要
  // keymaps.init ({
  //   editor: editor,
  //   gallery: sketches,
  //   menu: menu,
  //   repl: repl,
  //   log: log
  // })

  // define extra functions (eventually should be added to hydra-synth?)

  // hush clears what you see on the screen
  window.hush = () => {
    solid().out()
    solid().out(o1)
    solid().out(o2)
    solid().out(o3)
    render(o0)
  }


  pb.init(hydra.captureStream, {
    server: window.location.origin,
    room: 'iclc'
  })

  var engine = loop(function (dt) {
    hydra.tick(dt)
  }).start()

}
window.onload = init

//获取当前区块高度
async function getBlockNumber() {
  web3.eth.getBlockNumber().then(
    function (result) {
      console.log("blockNumber:" + result);
      throughBlock(result);
    })
}

//从创世区块0开始遍历
//var batch = new web3.BatchRequest();
async function throughBlock(blockNumber) {
  if (!blockNumber) { console.log('blockNumber is 0'); return false; };
  count = blockNumber
  while (count > blockNumber - blockAmount) {

    setTimeout(getBlock, 1, count)
    count--
  }

}

//获取当前区块的信息
async function getBlock(blockNumber) {
  web3.eth.getBlock(blockNumber)
    .then(
      function (result) {
        transactions = result.transactions;
        for (var i = 0; i < transactions.length; i++) {
          getTransactions(transactions[i]);
        }
      });
}

//获取交易信息
async function getTransactions(txh) {
  web3.eth.getTransaction(txh).then(
    function (result) {
      from = result.from;
      to = result.to;
      getCode(from);
      getCode(to);
    });
}

// 验证地址是否是合约地址
async function getCode(address) {
  if (!address) { return false; };
  web3.eth.getCode(address).then(
    function (result) {
      if (result == '0x') {
        getBalance(address);
      };
    });
}



