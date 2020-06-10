'use strict'

var gId = 1;

var gKeywords = { 'happy': 12, 'funny puk': 1 };
var gImgs = createImgs();

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [{ txt: 'I never eat Falafel', size: 20, align: 'left', color: 'red' }]
}

function createImgs() {
    var imgs = [];
    for (var i = 0; i < 18; i++) {
        imgs.push(createImg())
    }
    return imgs;
}

function createImg() {
    var img = {
        id: gId,
        url: `img/${gId++}.jpg`,
        keywords: ['happy']

    }
    return img;
}

function getImgs() {
    return gImgs;
}

function updateGmeme(currMeme) {
    gMeme = currMeme
}

function getGmeme() {
    return gMeme;
}

function getImgById(id) {
    var img = gImgs.find(function(img) {
        return img.id === id;
    })
    return img;
}

function createCurrMeme(currImg) {
    var meme = {
        selectedImgId: currImg.id,
        selectedLineIdx: 0,
        lines: [{ txt: '', size: 20, align: 'left', color: 'white', outline: 'black' }]
    }
    return meme;
}

function getNewLine() {
    return { txt: '', size: 20, align: 'left', color: 'white' }
}