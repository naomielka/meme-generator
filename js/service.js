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

var gPopularSearches = {}
var gKeywordsMap = {}

function getPopularSearches() {
    return gPopularSearches;
}

function createPopularSearches() {
    var keyMap = Object.keys(gKeywordsMap);
    keyMap.map(function(key) {
        if (gKeywordsMap[key] >= 3) {
            console.log(key)
            gPopularSearches[key] = gKeywordsMap[key]
        }
    })

    // if (localStorage.getItem('popularSearches') === 'undefined') {
    //     gPopularSearches = { 'happy': 3, 'angry': 3, 'funny': 3, 'love': 3 }
    //     saveToStorage('popularSearches', gPopularSearches)
    // } else {
    //     gPopularSearches = loadFromStorage('popularSearches');
    // }
}

function createKeywordsMap() {
    if (loadFromStorage('keyWordsMap')) {
        gKeywordsMap = loadFromStorage('keyWordsMap')
    } else {
        gKeywords.map(function(array) {
            array.map(function(word) {
                if (!gKeywordsMap[word]) {
                    gKeywordsMap[word] = 1;
                }
            })
        })
        var popularKeys = Object.keys(getPopularSearches);
        popularKeys.map(function(key) {
            console.log(gKeywordsMap[key])
            if (gKeywordsMap[key]) {
                gKeywordsMap[key] = gPopularSearches[key]
            }
        })
        saveToStorage('keyWordsMap', gKeywordsMap)
    }
}

function addToPopularSearches(search, value) {

    var popularSearches = getPopularSearches()
    popularSearches[search] = value;

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
        lines: [{ txt: 'insert your text', size: 40, font: 'impact', align: 'center', color: 'white', outline: 'black', delete: false, y: 50, isNew: true },
            { txt: 'insert your text', size: 40, font: 'impact', align: 'center', color: 'white', outline: 'black', delete: false, y: 50, isNew: true }
        ]
    }
    return meme;
}

function getNewLine() {
    return { txt: 'insert your text', size: 40, font: 'impact', align: 'center', color: 'white', outline: 'black', delete: false, y: 50, isNew: true }
}

function saveMeme(data) {
    gMemes.push(data);
    saveToStorage('memes', gMemes)
}

function getKeywordsMap() {
    return gKeywordsMap;
}