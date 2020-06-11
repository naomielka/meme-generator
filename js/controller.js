'use strict'

var gElCanvas;
var gCtx;
var gLine = 0;


function onInit() {
    gElCanvas = document.getElementById('meme-canvas');
    gCtx = gElCanvas.getContext('2d');
    // gElCanvas.width = 450;
    // gElCanvas.height = 450;
    renderImgs()
}

function renderImgs() {
    var strHtml = ''
    var imgs = getImgs()
    imgs.map(function(img) {
        strHtml += `<img onclick="onOpenGenerator(${img.id})" class="img" id="${img.id}" src="${img.url}" alt="${img.keywords}">`
    })
    var elContainer = document.querySelector('.img-grid')
    elContainer.innerHTML = strHtml;
}

function onOpenGenerator(imgId) {
    document.body.classList.add('generator');
    var currImg = getImgById(imgId)
    var currMeme = createCurrMeme(currImg);
    updateGmeme(currMeme)
    resizeCanvas()
    renderImg(currImg.id)
}

function renderCanvas(height = 0) {
    var meme = getGmeme()
    renderImg(meme.selectedImgId)
    for (var i = 0; i < meme.lines.length; i++) {
        if (meme.lines[i].delete) {
            meme.lines[i].delete = false;
            continue;
        }
        if (meme.selectedLineIdx === i) {
            var y = drawText(meme.lines[i].txt, meme.lines[i], i, height)
            markText(meme.lines[gLine].txt, y)
        } else {
            drawText(meme.lines[i].txt, meme.lines[i], i)
        }
    }
}

function markText(text, y) {
    // var width = gCtx.measureText(text).width + 10
    var height = gCtx.measureText('M').width + 15
        // var x = gElCanvas.width / 2 - width / 2
    var y = y - height + 5
    gCtx.beginPath();
    // gCtx.rect(x, y,width , height);
    gCtx.rect(0, y, gElCanvas.width, height);
    // gCtx.strokeStyle = 'black';
    // gCtx.stroke();
    gCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
    gCtx.fillRect(0, y, gElCanvas.width, height);
}

function renderImg(id) {
    var elImg = document.getElementById(`${id}`);
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
}

function updateTextLine(text) {
    text = text.toUpperCase()
    var meme = getGmeme()
    meme.selectedLineIdx = gLine
    meme.lines[gLine].txt = text;
    var line = meme.lines[gLine]
    renderCanvas()
    drawText(text, line)
}


function drawText(text, line, idx = gLine, height = 0) {
    if (line.isNew) {
        console.log('ch')
        if (idx === 0) line.y = 50;
        else if (idx === 1) line.y = gElCanvas.width - 50;
        else line.y = gElCanvas.width / 2;
        line.isNew = false;
    }
    if (height !== 0) line.y += height
    if (line.align === 'center') var x = gElCanvas.width / 2
    else if (line.align === 'right') x = gElCanvas.width - 5
    else x = 5
    gCtx.lineWidth = '2';
    gCtx.font = `${line.size}px ${line.font}`;
    gCtx.textAlign = `${line.align}`;
    gCtx.strokeStyle = `${line.outline}`;
    gCtx.fillStyle = `${line.color}`;
    gCtx.fillText(text, x, line.y);
    gCtx.strokeText(text, x, line.y);
    return line.y;

}

function deleteLine() {
    var meme = getGmeme()
    meme.lines[gLine].delete = true;
    renderCanvas()
    document.querySelector('.text-input').value = ''
}

function toggleLines() {
    var meme = getGmeme()
    if (gLine === meme.lines.length - 1) {
        gLine = 0
    } else {
        gLine++
    }
    document.querySelector('.text-input').value = ''
    meme.selectedLineIdx = gLine
    renderCanvas()
}

function alignMemeText(direction) {
    var meme = getGmeme()
    meme.lines.forEach((line) => line.align = direction)
    renderCanvas()
}

function getBiggerOrSmallerFont(size) {
    var meme = getGmeme();
    if (size === 'bigger') meme.lines[gLine].size += 10;
    else meme.lines[gLine].size -= 10;
    renderCanvas();
}

function addLine() {
    var meme = getGmeme();
    meme.lines.push(getNewLine());
    gLine = meme.lines.length - 1;
    meme.selectedLineIdx = gLine;
    document.querySelector('.text-input').value = ''
    renderCanvas()
}

function changeColorFill() {
    var color = document.getElementById('color-fill').value;
    var meme = getGmeme()
    meme.lines[gLine].color = color;
    renderCanvas();
}

function changeColorOutline() {
    var color = document.getElementById('color-outline').value;
    var meme = getGmeme()
    meme.lines[gLine].outline = color;
    renderCanvas();
}

function moveUpOrDown(direction, ev) {
    ev.preventDefult()
    var meme = getGmeme();
    if (direction === 'up') {
        drawText(meme.lines[gLine].txt, meme.lines[gLine], gLine, -10)
        renderCanvas(-10)
    } else {
        drawText(meme.lines[gLine].txt, meme.lines[gLine], gLine, 10)
        renderCanvas(10)

    }
}

function editText() {

}

function changeFont(font) {
    var meme = getGmeme()
    meme.lines[gLine].font = font;
    renderCanvas();
}

function backToGallary() {
    document.body.classList.remove('generator');
    document.querySelector('.text-input').value = ''
        // var el = document.getElementById(id);
        // el.scrollIntoView(true);
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    console.log(elContainer.offsetWidth)
    gElCanvas.height = elContainer.offsetHeight;
}


function toggleNavBar() {
    document.body.classList.toggle('nav-toggle');
}

function downloadMeme(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'new-meme.jpg'
}