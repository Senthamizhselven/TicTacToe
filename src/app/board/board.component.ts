import { Component, OnInit } from '@angular/core';
import { GameService, Game } from '../game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  private game: Game;
  board: any[];

  constructor(public gameService: GameService) {
    this.gameService.boardChangedEvent.subscribe((game: Game) => {
      this.game = game;
      this.board = game.board;
    });
  }

  ngOnInit(): void {
    this.game = this.gameService.startNewGame();
    this.board = this.game.board;
  }

  makeMove(idx: number) {
    this.gameService.makeMove(this.game, idx);
  }


}
