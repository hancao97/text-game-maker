const { lstatSync, readFileSync, readdirSync, writeFileSync } = require('fs');
const { extname, join, dirname } = require('path');

function isDir(path) {
  const stat = lstatSync(path);
  return stat.isDirectory();
}

const readContent = (path) => {
  let resContent = '';
  if(isDir(path)) {
    let files = readdirSync(path);
    for(const file of files) {
      resContent += readContent(join(path, file));
    }
  } else if(extname(path) == '.md') {
    const content = readFileSync(path, { 
      encoding: 'utf-8' 
    });
    resContent += content;
  }
  return resContent;
}

const parseContent = (content) => {
  const unitLinesList = content.split('@unitStart').filter(item => item).map(item => item.split('\n')).map(list => {
    let res = [];
    for(const item of list) {
      const str = item.replace(/\s*/g,"");
      if(str) {
        res.push(str);
      }
    }
    return res;
  })
  // const unitMap = new Map();
  const unitList = [];
  for(const unitLines of unitLinesList) {
    const unit = {};
    let isInOption = false;
    for(const line of unitLines){
      if(!isInOption) {
        if(line != '@unitOptionStart') {
          const lineContent = line.split(":");
          unit[lineContent[0]] = lineContent[1];
        } else {
          isInOption = true;
          unit['unit-option'] = [];
        }
      } else {
        if(line != '@unitOptionEnd') {
          const lineContent = line.split(":");
          const len = unit['unit-option'].length;
          if (len == 0){
            unit['unit-option'][0] = {};
            unit['unit-option'][0][lineContent[0]] = lineContent[1]; 
          } else if (unit['unit-option'][len - 1][lineContent[0]]) {
            unit['unit-option'][len] = {};
            unit['unit-option'][len][lineContent[0]] = lineContent[1];
          } else if(!unit['unit-option'][len - 1][lineContent[0]]) {
            unit['unit-option'][len - 1][lineContent[0]] = lineContent[1]; 
          }
        } else {
          isInOption = false;
        }
      }
    }
    // unitMap.set(unit['id'], unit);
    unitList.push(unit);
  }
  // return unitMap;
  return unitList;
}

const createGameHtml = (contentString, path) => {
  const dirPath =  dirname(path);
  writeFileSync(join(dirPath, 'text-game.html'), `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
  
      body {
        color: #ffffff;
        font-weight: 600;
        font-size: 16px;
        background-color: black;
        overflow: hidden;
      }
  
      #container {
        margin: 5vh auto;
        height: 92vh;
        width: 82vw;
        overflow: hidden;
        border-radius: 10px;
        border: #ffffff 1px dashed;
      }
  
      #text-content {
        width: 100%;
        height: 40vh;
        text-align: center;
        padding-top: 20vh;
      }
  
      #option-container {
        width: 80vw;
        margin: 0 auto;
        height: 30vh;
        border: #ffffff 1px solid;
        border-radius: 10px;
        overflow: hidden;
      }
  
      #name {
        border: #ffffff 1px solid;
        transform: skewX(-45deg);
        padding-left: 5vw;
        padding-right: 3vw;
        height: 5vh;
        display: inline-block;
        line-height: 6vh;
        margin-left: -2vw;
        margin-top: -1vh;
      }
  
      #name>div {
        transform: skewX(45deg);
      }
  
      #options {
        margin-top: 5vh;
        display: flex;
        flex-wrap: wrap;
      }
  
      #options .option {
        line-height: 5vh;
        height: 5vh;
        width: 49%;
        cursor: pointer;
        text-align: center;
        transition: all 0.5s ease;
      }
  
      #options .end {
        line-height: 10vh;
        height: 10vh;
        font-size: 24px;
        width: 100%;
        cursor: pointer;
        text-align: center;
      }
  
      #options .option:hover {
        font-size: 25px;
      }
  
      #options .option:hover:before {
        content: "🌟";
      }
  
      #goback-begin {
        cursor: pointer;
        position: absolute;
        right: 10vw;
      }
    </style>
  </head>
  
  <body>
    <div id="container">
      <div id="goback-begin">从头开始🌿</div>
      <div id="text-content">
      </div>
      <div id="option-container">
        <div id="name"></div>
        <div id="options"></div>
      </div>
    </div>
    <script>
      let currentUnit;
      const unitList = ${contentString};
      const unitMap = new Map();
      for (const unit of unitList) {
        unitMap.set(unit.id, unit);
      }
      const containerDom = document.getElementById('container');
      const textContentDom = document.getElementById('text-content');
      const nameDom = document.getElementById('name');
      const optionContainerDom = document.getElementById('option-container');
      const optionDom = document.getElementById('options');
      const resetDom = document.getElementById('goback-begin');
  
      resetDom.onclick = function () {
        init();
      }
      function init() {
        currentUnit = unitMap.get("0");
        update();
      }
      function update() {
        // name
        if (!currentUnit.name) {
          nameDom.style.opacity = 0;
        } else {
          nameDom.style.opacity = 1;
          nameDom.innerHTML = '<div>'+ currentUnit.name +'</div>';
        }
  
        // text
        textContentDom.innerText = currentUnit.text;
  
        // font-color
        document.body.style.color = currentUnit['font-color'] || '#fff';
        containerDom.style.borderColor = currentUnit['font-color'] || '#fff';
        optionContainerDom.style.borderColor = currentUnit['font-color'] || '#fff';
        nameDom.style.borderColor = currentUnit['font-color'] || '#fff';
        // background-color
        document.body.style.background = currentUnit['background-color'] || '#000';
        // options
        if (!currentUnit.next && !currentUnit['unit-option']) {
          optionDom.innerHTML = '<div class="end">End</div>';
        } else if (currentUnit.next) {
          optionDom.innerHTML = '<div class="option">Next</div>';
          document.getElementsByClassName('option')[0].onclick = function () {
            currentUnit = unitMap.get(currentUnit.next);
            update();
          }
        } else {
          let domStr = '';
          for (const option of currentUnit['unit-option']) {
            domStr += '<div class="option">' + option.text + '</div>';
          }
          optionDom.innerHTML = domStr;
          const optionDomList = document.getElementsByClassName('option');
          Array.from(optionDomList).forEach((optionDom, index) => {
            optionDom.onclick = function () {
              currentUnit = unitMap.get(currentUnit['unit-option'][index].next);
              update();
            }
          })
        }
      }
      init();
    </script>
  </body>
  
  </html>`, {
    encoding: 'utf-8'
  })

}

module.exports = {
  readContent,
  parseContent,
  createGameHtml
}