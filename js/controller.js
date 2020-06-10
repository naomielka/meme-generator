'use strict'

var gElCanvas;
var gCtx;
var gLine = 0;

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

}

function renderImg(id) {
    var elImg = document.getElementById(`${id}`);
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
}

function updateTextLine(text) {
    var meme = getGmeme()
    meme.selectedLineIdx = gLine
    meme.lines[gLine].txt = text;
    renderImg(meme.selectedImgId)
    for (var i = 0; i < meme.lines.length; i++) {
        drawText(meme.lines[i].txt, i, meme)
    }
    drawText(text, gLine, meme)
}


function drawText(text, idx, meme) {
    if (idx === 0) var y = 50
    else y = 400;
    gCtx.lineWidth = '2';
    gCtx.font = '40px impact';
    gCtx.textAlign = 'center';
    gCtx.strokeStyle = `${meme.lines[idx].outline}`;
    gCtx.fillStyle = `${meme.lines[idx].color}`;
    gCtx.fillText(text, gElCanvas.width / 2, y);
    gCtx.strokeText(text, gElCanvas.width / 2, y);
}

function toggleLines() {
    if (gLine === 0) {
        gLine = 1;
        var meme = getGmeme();
        meme.lines.push(getNewLine());
    } else gLine = 0;
}