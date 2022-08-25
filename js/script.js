const Player = (sign) => { // Player factory function
    let _sign = sign;

    const getSign = () => _sign;

    return { getSign };
};

const gameBoard = ((_htmlBoard) => { // gameBoard module
    let _board = new Array(9);

    const getField = index => _board[index];

    const setField = (index, player) => {
        if(_board[index] === undefined) {
            const card = _htmlBoard.querySelector(`[data-index="${index}"]`);
            card.textContent = player.getSign();
            card.classList.add('filled');
            _board[index] = player.getSign();
            return true;
        }
        return false;
    }    

    const clearField = (index) => {
        _board[index] = undefined;
        const card = _htmlBoard.querySelector(`[data-index="${index}"]`);
        card.classList.remove('winCard');
        card.classList.remove('filled');
        card.textContent = '';
    }

    const isFull = () => !(_board.includes(undefined));
    
    return {
        getField,
        setField,
        clearField,
        isFull
    };    
})(document.querySelector('.gameBoard'));    

const displayController = ((_htmlGameDiv) => { // displayController module
    const _player1 = Object.create(Player('X'));
    const _player2 = Object.create(Player('O'));
    let _currentPlayer;
    let _winner;

    const _tieDiv = _htmlGameDiv.querySelector('.tie');
    const _player1Div = _htmlGameDiv.querySelector('.player-info.player1');
    const _player2Div = _htmlGameDiv.querySelector('.player-info.player2');
    const _htmlBoard = _htmlGameDiv.querySelector('.gameBoard');

    const _switchCurrentPlayer = () => {
        _currentPlayer = (_currentPlayer === _player1) ? _player2 : _player1; 
        _updatePlayerText();
    };

    const _randomizeCurrentPlayer = () => {
        _currentPlayer = (Math.random() > 0.5) ? _player1 : _player2;
        _updatePlayerText();
    }
    
    const _updatePlayerText = () => {
        if(_currentPlayer === _player1) {
            _player1Div.classList.add('current');
            _player2Div.classList.remove('current');
        } else {
            _player1Div.classList.remove('current');
            _player2Div.classList.add('current');
        }
    }
    
    const getPlayer1 = () => _player1;
    const getPlayer2 = () => _player2;

    const checkWinner = (row, col) => {
        const rowWin = _checkRow(row);
        const colWin = _checkColumn(col);
        const diaWin = _checkDiagonal(row, col);

        return (rowWin || colWin || diaWin);
    }

    const _checkRow = (row) => {
        return _checkFields(3 * row, (3 * row) + 2, 1); // Starts at the first position in a row, checking the elements in the same row
    }

    const _checkColumn = (col) => {
        return _checkFields(col, 8, 3); // Starts in one of the three columns, stepping 3 spaces means the next element in the same column
    }

    const _checkDiagonal = (row, col) => {
        if((row === 1 && col !== 1) || (row !== 1 && col === 1)) { // Does not have to check middle of each side. Center (row === 1 and col === 1)
            return false;                                          // is checked in the column from top left to bottom right
        }

        if(row === 1 && col === 1) {               // Middle index =>
            const dia1Win = _checkFields(0, 8, 4); // Top left to bottom right
            const dia2Win = _checkFields(2, 6, 2); // Top right to bottom left
            return dia1Win || dia2Win;
        } else if(row === col) {                   // Same index =>
            return _checkFields(0, 8, 4);          // Top left to bottom right
        } else {                                   // Different index =>
            return _checkFields(2, 6, 2);          // Top right to bottom left
        }
    }

    const _checkFields = (start, end, step) => {
        let player1Points = 0;
        let player2Points = 0;

        for(let i = start; i <= end; i += step) {
            switch(gameBoard.getField(i)) {
                case _player1.getSign():
                    player1Points++;
                    break;
                case _player2.getSign():
                    player2Points++;
                    break;
                default:
                    return false;
            }
        }

        if(player1Points === 3 || player2Points === 3) {
            for(let i = start; i <= end; i += step) {
                _htmlBoard.querySelector(`[data-index="${i}"]`).classList.add('winCard'); // Allows styling for cards that caused a win
            }
            _winner = (player1Points === 3) ? _player1 : _player2;
            return true;
        }
        return false;
    }

    const _win = () => {
        if(_winner === _player1) {
            _player1Div.querySelector('.winner').classList.remove('hidden');
        } else {
            _player2Div.querySelector('.winner').classList.remove('hidden');
        }
        _htmlBoard.classList.add('game-over');
    }

    const _tie = () => {
        _tieDiv.classList.remove('hidden');
        _htmlBoard.classList.add('game-over');
    }

    const reset = () => {
        for(let i = 0; i <= 8; i++) {
            gameBoard.clearField(i);
        }
        _tieDiv.classList.add('hidden');
        _player1Div.querySelector('.winner').classList.add('hidden');
        _player2Div.querySelector('.winner').classList.add('hidden');
        _htmlBoard.classList.remove('game-over');
        _randomizeCurrentPlayer();
        _winner = undefined;
    }

    const _init = (() => { // Initiates eventListeners for cards and restart button
        _randomizeCurrentPlayer();

        _htmlBoard.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
                const index = card.dataset.index;
                
                if(_winner === undefined && gameBoard.setField(index, _currentPlayer)) { // Checks so something was added to the card
                    if(checkWinner(Math.floor(index / 3), index % 3)) _win();
                    else if(gameBoard.isFull())                       _tie();                                            
                    else                                              _switchCurrentPlayer();
                }
            });
        });

        _htmlGameDiv.querySelector('button.restart').addEventListener('click', () => reset());
    })();

    return {
        getPlayer1,
        getPlayer2,
        checkWinner,
        reset
    }
})(document.querySelector('.game-div'));