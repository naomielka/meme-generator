'use strict'

var gCurrLang = 'en';

const gTrans = {
    'gallery': {
        en: 'Gallery',
        he: 'גלריה'
    },
    'about': {
        en: 'About',
        he: 'מי אני'
    },
    'memes': {
        en: 'Memes',
        he: 'ממים'
    },
    'about-header': {
        en: 'Naomi Elkayam',
        he: 'נעמי אלקיים'
    },
    'about-info': {
        en: '21 years old from Tel Aviv. Just finished serving for the IDF in an airforce intelligance special unit.',
        he: 'בת 21 מתל אביב, משוחררת טרייה מתפקיד מודיעיני בחיל האוויר.'
    },
    'copyrights': {
        en: 'all rights reserved 2020',
        he: 'כל הזכויות שמורות 2020'
    },
    'insert-text': {
        en: 'insert your text',
        he: 'הטקסט שלך'
    },
    'search': {
        en: 'Enter search keyword ',
        he: 'הכנס מילת חיפוש'
    },
    'share': {
        en: 'Share',
        he: 'שיתוף'
    },
    'download': {
        en: 'Download',
        he: 'הורדה'
    },
    'save': {
        en: 'Save',
        he: 'שמירה'
    }
}

function setLang(lang) {
    gCurrLang = lang;
}

function getTrans(transKey) {
    if (!gTrans[transKey]) return 'UNKNOWN'
    var transMap = gTrans[transKey];
    var trans = transMap[gCurrLang];
    if (!trans) trans = transMap['en']
    return trans;
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]');
    for (var i = 0; i < els.length; i++) {
        var el = els[i]
        var transKey = el.dataset.trans;
        var trans = getTrans(transKey);
        if (el.nodeName === 'INPUT') el.placeholder = trans
        else el.innerText = trans;
    }
}