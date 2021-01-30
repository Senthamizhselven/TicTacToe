import { Component } from '@angular/core';
import { GameService } from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TicTacToeMaster';

  constructor(public gameService:GameService){
    this.gameService.gameModeChangeEvent.subscribe(()=>{
      this.gameMode = null;
    })  
  }

  gameMode:number;

  twoPlayerSingle(){
    this.gameService.setMode(true);
    this.gameMode = 1;
  };

  onePlayerComputer(){
    this.gameService.setMode(false);
    this.gameMode = 2;
  }
}
