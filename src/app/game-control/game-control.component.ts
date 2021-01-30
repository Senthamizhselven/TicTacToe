import { Component, OnInit } from '@angular/core';
import { GameService, Game } from '../game.service';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.scss']
})
export class GameControlComponent implements OnInit {
  xIsPlaying:boolean=true;
  winner:String;
  xWinCount = 0;
  oWinCount = 0;

  constructor(public gameService:GameService) {
    this.gameService.boardChangedEvent.subscribe((game:Game)=>{
      this.xIsPlaying = game.xIsPlaying;
    })

    this.gameService.gameWonEvent.subscribe((game:Game)=>{
      this.winner = game.lastRoundWinner;
      this.xWinCount = game.xWins;
      this.oWinCount = game.oWins;
    })
   }

  ngOnInit(): void {
  }

  newGame(){
    this.gameService.startNewGame();
  }

  changeMode(){
    this.gameService.gameModeChangeEvent.next();
  }

}
