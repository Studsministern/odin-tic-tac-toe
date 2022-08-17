const displayController = (() => {
    const _player1 = Player('X');
    const _player2 = Player('O');

    const getPlayer1 = () => _player1;
    const getPlayer2 = () => _player2;

    const _checkRow = (row) => {
        let player1Points = 0;
        let player2Points = 0;

        for(let i = 3 * row; i < 3 * (row + 1); i++) {
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
            return true;
        }
        return false;
    }

    const _checkColumn = (col) => {
        let player1Points = 0;
        let player2Points = 0;

        for(let i = col; i <= 8; i += 3) {
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
            return true;
        }
        return false;
    }

    const _checkDiagonal = (row, col) => {
        if((row === 1 && col !== 1) || (row !== 1 && col === 1)) { // Does not have to check middle of each side. Center (row === 1 and col === 1)
            return false;                                          // is checked in the column from top left to bottom right
        }
        let player1Points = 0;
        let player2Points = 0;

        if(row === col) { // Handles column from top left to bottom right
            for(let i = 0; i <= 2; i++) {
                switch(gameBoard.getField(4 * i)) { // 4 * i for index 0, 4 and 8 (top left, middle, bottom right)
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
        } else { // Handles column from top right to bottom left
            for(let i = 2; i <= 6; i += 2) {
                switch(gameBoard.getField(i)) { // Index 2, 4 and 6 (top right, middle, bottom left)
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
        }

        if(player1Points === 3 || player2Points === 3) {
            return true;
        }
        return false;
    }
    
    const reset = () => {
        for(let i = 0; i <= 8; i++) {
            gameBoard.clearField(i);
        }
    }

    return {
        getPlayer1,
        getPlayer2,
        reset
    }
})();

const gameBoard = ((htmlBoard) => {
    let _board = new Array(9);

    const getField = index => _board[index];

    const setField = (index, player) => {
        if(_board[index] === undefined) {
            const card = htmlBoard.querySelector(`[index="${index}"]`);
            card.textContent = player.getSign();
            _board[index] = player.getSign();
        }
    }

    const clearField = index => _board[index] = undefined;

    return {
        getField,
        setField,
        clearField
    };
})(document.querySelector('.gameBoard'));

const Player = (sign) => {
    let _sign = sign;

    const getSign = () => _sign;

    return { getSign };
};