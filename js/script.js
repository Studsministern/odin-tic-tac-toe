const displayController = (() => {
    const _player1 = Player('X');
    const _player2 = Player('O');

    const getPlayer1 = () => _player1;
    const getPlayer2 = () => _player2;

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
            return true;
        }
        return false;
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

        if(row === col) {                   // Same index => Diagonal from top left to bottom right
            return _checkFields(0, 8, 4);   // 0 = top left, 4 = middle, 8 bottom right
        } else {                            // Different index => Diagonal from top right to bottom left
            return _checkFields(2, 6, 2);   // 2 = top right, 4 = middle, 6 bottom left
        }
    }

    const checkWinner = (row, col) => {
        return (_checkRow(row) || _checkColumn(col) || _checkDiagonal(row, col));
    }

    const reset = () => {
        for(let i = 0; i <= 8; i++) {
            gameBoard.clearField(i);
        }
    }

    return {
        getPlayer1,
        getPlayer2,
        checkWinner,
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