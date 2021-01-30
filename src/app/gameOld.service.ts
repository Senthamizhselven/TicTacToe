import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    private xIsNext = true;
    // private winner:String = null;

    public newGame = new Subject<void>();
    public xIsNextSubject = new Subject<boolean>();
    public gameWonBy = new Subject<String>();
    public modeChange = new Subject<void>();



    public startNewGame() {
        this.newGame.next();
        this.xIsNext = true;
        this.xIsNextSubject.next(this.xIsNext);
    }


    public changePlayer() {
        this.xIsNext = !this.xIsNext;
        this.xIsNextSubject.next(this.xIsNext);
    }

    public gameWon(player: String) {
        this.gameWonBy.next(player);
        this.newGame.next();
    }
    
}