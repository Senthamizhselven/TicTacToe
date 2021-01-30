import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export const symbols = {
    playerX: 'X',
    playerO: 'O'
}
export const results = {
    incomplete: 'incomplete',
    playerXWon: symbols.playerX,
    playerOWon: symbols.playerO,
    tie: 'tie'
}

export interface Game {
    board: any[];
    xIsPlaying: boolean;
    moveCount: number;
    lastRoundWinner: string;
    xWins: number;
    oWins: number;
}

export let gameMode = {
    twoPlayer: null
}

@Injectable({
    providedIn: 'root'
})
export class GameService {
    game = {
        board: Array(9).fill(null),
        xIsPlaying: true,
        moveCount: 0,
        lastRoundWinner: null,
        xWins: 0,
        oWins: 0
    }

    public gameWonEvent = new Subject<Game>();
    public boardChangedEvent = new Subject<Game>();
    public gameModeChangeEvent = new Subject<void>();

    // constructor() {
    //     this.game.board = Array(9).fill(null);
    //     this.game.xIsNext = true;
    // }

    public startNewGame() {
        this.game.board = Array(9).fill(null);
        this.game.xIsPlaying = true;
        this.game.moveCount = 0;
        this.boardChangedEvent.next(this.game);
        return this.game;
    }

    public makeMove(game: Game, idx: number) {
        this.game = game;

        if (!this.game.board[idx]) {
            if (this.game.xIsPlaying) {
                this.game.board.splice(idx, 1, symbols.playerX);
            } else {
                this.game.board.splice(idx, 1, symbols.playerO);
            }
            this.game.moveCount++;
        }

        let result = this.getResult(this.game.board);
        // this.game.lastRoundWinner = result;

        if (result != results.incomplete && result != results.tie) {

            if (result === results.playerXWon) {
                this.game.xWins++;
            } else if (result === results.playerOWon) {
                this.game.oWins++;
            }

            this.game.lastRoundWinner = result;
            this.gameWonEvent.next(this.game);
            this.startNewGame();

        } else if (result == results.tie) {
            this.startNewGame();
        } else {
            this.changePlayer();
        }

        this.boardChangedEvent.next(this.game);
        // return this.game;
    }

    changePlayer() {
        this.game.xIsPlaying = !this.game.xIsPlaying;
    }

    setMode(twoPlayerMode:boolean){
        gameMode.twoPlayer = twoPlayerMode;
    }

    getResult(board: any[]): string {


        const winningLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        let result = results.incomplete;

        const availableMoves = this.getAvailableMoves(board);

        if (availableMoves.length > 5) {
            return result;
        }

        for (let i = 0; i < winningLines.length; i++) {
            const [a, b, c] = winningLines[i];

            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                result = board[a] === symbols.playerX ? results.playerXWon : results.playerOWon;
            }

        }

        if (availableMoves.length == 0 && result == results.incomplete) {
            return result = results.tie;
        }

        return result;
    }

    getAvailableMoves(board: any[]): number[] {

        const availableMoves = [];

        for (let i = 0; i < board.length; i++) {
            !board[i] && availableMoves.push(i)
        }

        return availableMoves;
    }

    getBestMove(board: any[], symbol: string) {

        function copyBoard(board: any[]) {
            return [...board];
        }

        const availableMoves = this.getAvailableMoves(board);

        while(availableMoves.length>4){
            let randomMoveIndex = Math.floor(Math.random()* 8);
            if(!board[randomMoveIndex]){
                return randomMoveIndex;
            }
        }
        const availableMovesAndScores = [];

        for (let i = 0; i < availableMoves.length; i++) {
            let move = availableMoves[i];

            let testBoard = copyBoard(board);
            testBoard[move] = symbol;
            let result = this.getResult(testBoard);

            let score;
            if (result == results.tie) {
                score = 0;
            } else if (result == symbol) {
                score = 1;
            } else {
                let otherSymbol = (symbol == symbols.playerX) ? symbols.playerO : symbols.playerX;
                let nextMove = this.getBestMove(testBoard, otherSymbol);
                score = -(nextMove);
            }

            if (score === 1) {
                return move;
            }
            availableMovesAndScores.push({ move, score });
        }

        availableMovesAndScores.sort((moveA, moveB) => {
            return moveB - moveA;
        })

        return availableMovesAndScores[0].move;
    }


}