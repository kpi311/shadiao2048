/**
 * top-level, game status
 */

const gameStatus = {
    _score: 0,
    _best: 0,
    gameStack: [],
    _gameBoard: [],
    randomTick: 0
}

Object.defineProperty(gameStatus, 'gameBoard', {
    set(mat) {
        this._gameBoard = mat
        gDOMBoardRender()
    },
    get() {
        return this._gameBoard
    }
})

Object.defineProperty(gameStatus, 'score', {
    set(val) {
        this._score = val
        gDOMScoreRender()
    },
    get() {
        return this._score
    }
})

Object.defineProperty(gameStatus, 'best', {
    set(val) {
        this._best = val
        gDOMBestRender()
    },
    get() {
        return this._best
    }
})


const updateTick = () => {
    gameStatus.randomTick += 1
    if(gameStatus.randomTick % 2 === 0){
        gameStatus.randomTick = 0
        generateNewBlks()
        commitBoard()
    }
}

let board = new Array()
for (let i = 0; i < 4; i += 1) {
    board.push(new Array(4).fill(0))
}

const commitBoard = () => {
    gameStatus.gameBoard = board
}


/**
 * 分数相关
 */

 const updateScore = (val) => {
    gameStatus.score += val;
    if (gameStatus.score > gameStatus.best) {
        gameStatus.best = gameStatus.score
    }
}

/**
 * utils
 */

const directions = {
    'TOP': 0,
    'RIGHT': 1,
    'BOTTOM': 2,
    'LEFT': 3
}

let availBlks = []

const detectAvailableBlks = () => {
    let res = []
    for (let i = 0; i < 4; i += 1) {
        for (let j = 0; j < 4; j += 1) {
            if (board[i][j] === 0) {
                res.push([i, j])
            }
        }
    }
    availBlks = res
}

let genBlks = []

const randomVal = () => {
    return Math.random() > 0.5 ? 4 : 2
}

/**
 * 
 * @param {number[][]} blkarr 
 */
const generateBlk = (blkarr) => {
    blkarr.forEach(e => { board[e[0]][e[1]] = randomVal() })
}

const generateNewBlks = () => {
    detectAvailableBlks()
    const n = availBlks.length
    if (n <= 0) {
        // game over? won't go here perhaps
        return
    } else if (n > 2) {
        let a = Math.trunc(Math.random() * (n - 1))
        let b = a
        while (b === a) {
            b = Math.trunc(Math.random() * (n - 1))
        }
        genBlks = [availBlks[a], availBlks[b]]
        generateBlk(genBlks)
    } else {
        generateBlk(availBlks)
    }
}

const rowCollapsable = (direction, rn) => {
    if (direction === directions.LEFT) {
        for (let i = 0; i < 3; i += 1) {
            if (board[rn][i] === 0) {
                if (board[rn][i + 1] > 0) {
                    return true
                }
            } else {
                if (board[rn][i] === board[rn][i + 1]) {
                    return true
                }
            }
        }
    } else if (direction === directions.RIGHT) {
        for (let i = 3; i > 0; i -= 1) {
            if (board[rn][i] === 0) {
                if (board[rn][i - 1] > 0) {
                    return true
                }
            } else {
                if (board[rn][i] === board[rn][i - 1]) {
                    return true
                }
            }
        }
    }
    return false
}

const colCollapsable = (direction, cn) => {
    if (direction === directions.TOP) {
        for (let i = 0; i < 3; i += 1) {
            if (board[i][cn] === 0) {
                if (board[i + 1][cn] > 0) {
                    return true
                }
            } else {
                if (board[i][cn] === board[i + 1][cn]) {
                    return true
                }
            }
        }
    } else if (direction === directions.BOTTOM) {
        for (let i = 3; i > 0; i -= 1) {
            if (board[i][cn] === 0) {
                if (board[i - 1][cn] > 0) {
                    return true
                }
            } else {
                if (board[i][cn] === board[i - 1][cn]) {
                    return true
                }
            }
        }
    }
    return false
}

const collapse = (direction) => {
    switch (direction) {
        case directions.TOP:
            // cols
            for (let i = 0; i < 4; i += 1) {
                // inside col, at most 3 times
                // working like bubbling
                for (let j = 0; j < 3; j += 1) {
                    for (let k = 1; k < 4; k += 1) {
                        const curr = board[k][i];
                        // skip 0
                        if (curr) {
                            if (board[k - 1][i] === 0) {
                                board[k - 1][i] = curr
                                board[k][i] = 0
                            } else if (board[k - 1][i] === curr) {
                                board[k - 1][i] *= 2
                                board[k][i] = 0
                                updateScore(board[k - 1][i])
                            }
                        }

                    }
                }
            }
            break
        case directions.BOTTOM:
            // cols
            for (let i = 0; i < 4; i += 1) {
                // inside col, at most 3 times
                // working like bubbling
                for (let j = 0; j < 3; j += 1) {
                    for (let k = 2; k >= 0; k -= 1) {
                        const curr = board[k][i];
                        // skip 0
                        if (curr) {
                            if (board[k + 1][i] === 0) {
                                board[k + 1][i] = curr
                                board[k][i] = 0
                            } else if (board[k + 1][i] === curr) {
                                board[k + 1][i] *= 2
                                board[k][i] = 0
                                updateScore(board[k + 1][i])
                            }
                        }

                    }
                }
            }
            break
        case directions.LEFT:
            // rows
            for (let i = 0; i < 4; i += 1) {
                // inside row, at most 3 times
                // working like bubbling
                for (let j = 0; j < 3; j += 1) {
                    for (let k = 1; k < 4; k += 1) {
                        const curr = board[i][k];
                        // skip 0
                        if (curr) {
                            if (board[i][k - 1] === 0) {
                                board[i][k - 1] = curr
                                board[i][k] = 0
                            } else if (board[i][k - 1] === curr) {
                                board[i][k - 1] *= 2
                                board[i][k] = 0
                                updateScore(board[i][k - 1])
                            }
                        }

                    }
                }
            }
            break
        case directions.RIGHT:
            // cols
            for (let i = 0; i < 4; i += 1) {
                // inside col, at most 4 times
                // working like bubbling
                for (let j = 0; j < 3; j += 1) {
                    for (let k = 2; k >= 0; k -= 1) {
                        const curr = board[i][k];
                        // skip 0
                        if (curr) {
                            if (board[i][k + 1] === 0) {
                                board[i][k + 1] = curr
                                board[i][k] = 0
                            } else if (board[i][k + 1] === curr) {
                                board[i][k + 1] *= 2
                                board[i][k] = 0
                                updateScore(board[i][k + 1])
                            }
                        }

                    }
                }
            }
            break
    }
    // after collapse, save stack
    let state = JSON.parse(JSON.stringify(board))
    gameStatus.gameStack.push(state)
}

const detectPossibleMove = () => {
    for (let i = 0; i < 4; i += 1) {
        if (rowCollapsable(directions.LEFT, i) || rowCollapsable(directions.RIGHT, i) || colCollapsable(directions.TOP, i) || colCollapsable(directions.BOTTOM, i)) {
            return true
        }
    }
    return false
}

const swipe = (dir) => {
    collapse(dir)
    commitBoard()
}


/**
 * total game control
 */

const gameOver = () => {
    alert('gameover')
    location.reload()
}


/**
 * game path
 */

const gameFlow = (dir) => {
    return function() {
        if(detectPossibleMove()){
            swipe(dir)
            updateTick()
        }else{
            gameOver()
        }
    }
}


/**
 * DOM actions
 */

const [gScore, gBest] = document.getElementsByClassName("g-score-box")

/**
 * 
 * @param {number} score 
 * @param {HTMLElement} dom 
 */

const gDOMSetScore = (score, dom) => {
    dom.innerText = score
}

const gDOMScoreRender = () => {
    gDOMSetScore(gameStatus.score,gScore.children[1])
}

const gDOMBestRender = () => {
    gDOMSetScore(gameStatus.best,gBest.children[1])
}


/**
 * gameboard
 */

let [gBoard] = document.getElementsByClassName("g-cross")
gBoard = Array.from(gBoard.children).map(e => Array.from(e.children))


const gDOMSetBoardBlk = (val, rn, cn) => {
    let gStyle = 'g-blk'
    if(val === 0){        
        gBoard[rn][cn].innerText = ""
    }else{
        gStyle +=  ` g-${val > 2048 ? 'over' : val}`
        gBoard[rn][cn].innerText = val
    }
    gBoard[rn][cn].classList.value = gStyle
}

const gDOMBoardRender = () => {
    for (let i = 0; i < 4; i += 1) {
        for (let j = 0; j < 4; j += 1) {
            gDOMSetBoardBlk(gameStatus.gameBoard[i][j], i, j)
        }
    }
}

/**
 * triggers
 */

document.addEventListener('keydown', e=>{
    const triggers = [gameFlow(directions.TOP), gameFlow(directions.RIGHT), gameFlow(directions.BOTTOM), gameFlow(directions.LEFT)]
    switch(e.key){
        case "ArrowUp":
            triggers[0]()
            break
        case "ArrowRight":
            triggers[1]()
            break
        case "ArrowDown":
            triggers[2]()
            break
        case "ArrowLeft":
            triggers[3]()
            break
    }
})

/**
 * initialization
 */

/**
 * for now static 2 blks
 */

 board[1][1] = 2
 board[2][2] = 4

 commitBoard()
 gDOMScoreRender()
 gDOMBestRender()