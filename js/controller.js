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
    createKeywordsMap()
    saveToStorage('popularSearches', gPopularSearches);
    renderSorters()
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

function findTextCords(text, y) {
    var meme = getGmeme()
    var width = gCtx.measureText(text).width + 10
    var height = gCtx.measureText('M').width + 15
    if (meme.lines[gLine].align === 'center') var x = gElCanvas.width / 2 + width / 2
    else if (meme.lines[gLine].align === 'right') x = gElCanvas.width - 5
    else x = 5
    var y = y - height + 5
    var cords = { width: width, height: height, y: y, x: x }
    return cords;
}

function markText(text, y) {
    // var meme = getGmeme()
    // var width = gCtx.measureText(text).width + 10
    var height = gCtx.measureText('M').width + 15
        // if (meme.lines[gLine].align === 'center') var x = gElCanvas.width / 2
        // else if (meme.lines[gLine].align === 'right') x = gElCanvas.width - 5
        // else x = 5
    var y = y - height + 5
    gCtx.beginPath();
    // gCtx.rect(x, y,width , height);
    gCtx.rect(0, y, gElCanvas.width, height);
    // gCtx.strokeStyle = 'black';
    // gCtx.stroke();
    gCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
    gCtx.fillRect(0, y, gElCanvas.width, height);
    return
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
    var meme = getGmeme();
    if (direction === 'up') {
        drawText(meme.lines[gLine].txt, meme.lines[gLine], gLine, -10)
        renderCanvas(-10)
    } else {
        drawText(meme.lines[gLine].txt, meme.lines[gLine], gLine, 10)
        renderCanvas(10)

    }
}

function editText(ev) {
    const { offsetX, offsetY } = ev;
    var meme = getGmeme()
    for (var i = 0; i < meme.lines.length; i++) {
        var text = meme.lines[i].txt
        var y = meme.lines[i].y
        var cords = findTextCords(text, y)
        if (meme.lines[i].align === 'left') {
            if (offsetX >= cords.x && offsetX <= cords.x + cords.width && offsetY >= cords.y && offsetY <= cords.y + cords.height) {
                document.getElementById("meme-text").focus();
                gLine = i;
                meme.selectedLineIdx = i;
                document.querySelector('.text-input').value = ''
                renderCanvas()
            }
        } else {
            if (offsetX <= cords.x && offsetX >= cords.width && offsetY >= cords.y && offsetY <= cords.y + cords.height) {
                document.getElementById("meme-text").focus();
                gLine = i;
                meme.selectedLineIdx = i;
                document.querySelector('.text-input').value = ''
                renderCanvas()
            }
        }
    }
}

function changeFont(font) {
    var meme = getGmeme()
    meme.lines[gLine].font = font;
    renderCanvas();
}

function backToGallary() {
    document.body.classList.remove('generator');
    document.body.classList.remove('meme-gallary');
    document.querySelector('.text-input').value = ''
    renderImgs()
        // var el = document.getElementById(id);
        // el.scrollIntoView(true);
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
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

function saveMemeToStorage() {
    const data = gElCanvas.toDataURL()
    saveMeme(data)

}

function renderMemes() {
    var memes = loadFromStorage('memes');
    var strHtml = ''
    memes.map(function(meme) {
        strHtml += `<img class="meme" src="${meme}">`
    })
    var elContainer = document.querySelector('.memes')
    elContainer.innerHTML = strHtml;
}

function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gElCanvas.toDataURL("image/jpeg");
    document.querySelector('.share-btn').style.display = 'none'

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a> <a class="btn" href="#" onclick="downloadMeme(this)">Download</a>
        <a class="btn" href="#" onclick="saveMemeToStorage()">Save</a>
        `
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(function(res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function(err) {
            console.error(err)
        })
}


function openMemes() {
    document.body.classList.add('meme-gallary');
    renderMemes()
}

function searchKeyWord() {
    var usersKey = document.getElementById('searcher').value;
    var KeywordsMap = getKeywordsMap()
    if (!KeywordsMap[usersKey]) {
        strHtml = 'No images found! Try differnt keyword.'
    } else {
        KeywordsMap[usersKey]++;
        if (KeywordsMap[usersKey] >= 3) {
            addToPopularSearches(usersKey, KeywordsMap[usersKey]);
            renderSorters(usersKey)

        }
        var strHtml = ''
        var imgs = getImgs()
        imgs.map(function(img) {
            var imgKeywords = img.keywords;
            imgKeywords.map(function(keyword) {
                if (keyword === usersKey) {
                    strHtml += `<img onclick="onOpenGenerator(${img.id})" class="img" id="${img.id}" src="${img.url}" alt="${img.keywords}">`
                }
            })
        })
    }
    var elContainer = document.querySelector('.img-grid')
    elContainer.innerHTML = strHtml;
    renderSorters(usersKey)
}

function search(ev) {
    if (ev.keyCode == 13) searchKeyWord();
}

function renderSorters(key) {
    var sorters = loadFromStorage('popularSearches')
    var strHtml = ''
    var elSorters = document.querySelector('.sorters')
    sorters.map(function(sorter) {
        var objKey = JSON.stringify(Object.keys(sorter))
            // if (objKey === key) {
            //     strHtml += `<button class="sorter" style="font-size: 10+${sorter.objKey}px" onclick="searchKeyWord(this.value)">${sorter}</button>`
            // }
        strHtml += `<button class="sorter" style="font-size: 10+${sorter[objKey]}px" onclick="searchKeyWord(this.value)">${key}</button>`
    })
    elSorters.innerHTML = strHtml;


    // var keywordsMap = getKeywordsMap()
    // var keywords = Object.keys(keywordsMap)
    // var elSorters = document.querySelector('.sorters')
    // var strHtml = ''
    // keywords.map(function(key) {
    //     if (keywordsMap[key] > 3) {
    //         strHtml += `<button class="sorter" onclick="searchKeyWord(this.value)">${key}</button>`
    //     }
    // })
    // elSorters.innerHTML = strHtml;
}