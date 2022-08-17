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