'use strict'

var gId = 1;

// var gKeywords = { 'happy': 12, 'funny puk': 1 };

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [{ txt: 'I never eat Falafel', size: 20, align: 'left', color: 'red', }]
}

var gKeywords = [
    [],
    ['trump', 'angry', 'stupid'],
    ['happy', 'cute', 'love', 'kiss'],
    ['sleep', 'cute', 'love'],
    ['sleep', 'cute', 'funny'],
    ['angry', 'mad', 'funny'],
    ['explain', 'mad', 'funny'],
    ['surprise', 'cute', 'funny'],
    ['tell me about it', 'mad', 'funny'],
    ['cunning', 'cute', 'funny'],
    ['happy', 'obama', 'funny'],
    ['love', 'kiss', 'funny'],
    ['you', 'funny'],
    ['cheers', 'leonardo decaprio', 'funny'],
    ['confused'],
    ['one does not simply', 'simply', 'lord of the rings'],
    ['star trek', 'funny', ],
    ['putin', 'angry', ],
    ['buzz', 'toy story', ],
]

var gPopularSearches = []
var gKeywordsMap = {}

function createKeywordsMap() {
    gKeywords.map(function(array) {
        array.map(function(word) {
            if (!gKeywordsMap[word]) {
                gKeywordsMap[word] = 1;
            }
        })
    })
}

function addToPopularSearches(search, value) {
    var found = false;
    var obj = {
        [search]: value
    }
    for (var i = 0; i < gPopularSearches.length; i++) {
        if (JSON.stringify(Object.keys(gPopularSearches[i])) === search) {
            gPopularSearches[i] == obj
            found = true
        }
    }
    if (!found) {
        gPopularSearches.push(obj);
    }
    saveToStorage('popularSearches', gPopularSearches)
}


var gImgs = createImgs();
var gMemes = []

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
        url: `img/${gId}.jpg`,
        keywords: gKeywords[gId++]
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
        lines: [{ txt: '', size: 40, font: 'impact', align: 'center', color: 'white', outline: 'black', delete: false, y: 50, isNew: true },
            { txt: '', size: 40, font: 'impact', align: 'center', color: 'white', outline: 'black', delete: false, y: 50, isNew: true }
        ]
    }
    return meme;
}

function getNewLine() {
    return { txt: '', size: 40, font: 'impact', align: 'center', color: 'white', outline: 'black', delete: false, y: 50, isNew: true }
}

function saveMeme(data) {
    gMemes.push(data);
    saveToStorage('memes', gMemes)
}

function getKeywordsMap() {
    return gKeywordsMap;
}