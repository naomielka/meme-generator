'use strict'

var gElCanvas;
var gCtx;
var gLine = 0;

var gLastY;
var gLastX;
var gLastText;
var gLastLineSize;

function onInit() {
    gElCanvas = document.getElementById('meme-canvas');
    gCtx = gElCanvas.getContext('2d');
    gElCanvas.width = 450;
    gElCanvas.height = 450;
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
    renderImg(currImg.id)
}

function renderCanvas() {
    var meme = getGmeme()
    renderImg(meme.selectedImgId)
    for (var i = 0; i < meme.lines.length; i++) {
        if (meme.lines[i].delete) {
            meme.lines[i].delete = false;
            continue;
        }
        drawText(meme.lines[i].txt, meme.lines[i], i)

        // if (meme.selectedLineIdx === i) {
        //     outlineText(true, gLastX - gCtx.measureText(gLastText).width / 2, gLastY - gLastLineSize, gLastLineSize, gCtx.measureText(gLastText).width)
        // } else {
        //     outlineText(false)
        // }
    }
}

function renderImg(id) {
    var elImg = document.getElementById(`${id}`);
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
}

function updateTextLine(text) {
    var meme = getGmeme()
    meme.selectedLineIdx = gLine
    meme.lines[gLine].txt = text;
    var line = meme.lines[gLine]
    renderCanvas()
    drawText(text, line)

}


function drawText(text, line, idx = gLine) {
    if (idx === 0) var y = 50
    else if (idx === 1) y = 400;
    else y = 225;
    if (line.align === 'center') var x = gElCanvas.width / 2
    else if (line.align === 'right') x = gElCanvas.width - 5
    else x = 5
    gCtx.lineWidth = '2';
    gCtx.font = `${line.size}px impact`;
    gCtx.textAlign = `${line.align}`;
    gCtx.strokeStyle = `${line.outline}`;
    gCtx.fillStyle = `${line.color}`;
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
    gLastY = y
    gLastX = x
    gLastText = text
    gLastLineSize = line.size

}

function deleteLine() {
    var meme = getGmeme()
    meme.lines[gLine].delete = true;
    renderCanvas()
    document.querySelector('.text-input').value = ''
}

function outlineText(isSelected, x, y, height, width) {
    if (!isSelected) { return }
    gCtx.rect(x, y, width, height);
    gCtx.beginPath();
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
}

function toggleLines() {
    var meme = getGmeme()
    if (gLine === meme.lines.length - 1) {
        gLine = 0
    } else {
        gLine++
    }
    document.querySelector('.text-input').value = ''
    renderCanvas()
        // if (gLine === 0) {
        //     gLine = 1;
        //     addLine()
        //     document.querySelector('.text-input').value = ''
        //     renderCanvas()
        // } else {
        //     document.querySelector('.text-input').value = ''
        //     gLine = 0;
        //     renderCanvas()
        // }
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

function backToGallary() {
    document.body.classList.remove('generator');
    document.querySelector('.text-input').value = ''
        // var el = document.getElementById(id);
        // el.scrollIntoView(true);
}

function toggleNavBar() {
    document.body.classList.toggle('nav-toggle');
}