import { Game2048 } from './game.js';

export const GameState = {
  IDLE: 'idle',
  PLAYING: 'playing',
  GAME_OVER: 'game_over'
};

export class GameManager {
  constructor() {
    this.games = new Map();
  }

  getPlayerGame(userId) {
    if (!this.games.has(userId)) {
      this.games.set(userId, {
        game: new Game2048(),
        state: GameState.IDLE
      });
    }
    return this.games.get(userId);
  }

  startNewGame(userId) {
    const player = this.getPlayerGame(userId);
    player.game.startNewGame();
    player.state = GameState.PLAYING;
    return {
      success: true,
      message: player.game.gridToString(),
      state: player.state
    };
  }

  move(userId, direction) {
    const player = this.getPlayerGame(userId);

    if (player.state === GameState.GAME_OVER) {
      return {
        success: false,
        message: ' Игра окончена! Нажми "🔄 Новая игра", чтобы начать заново.',
        state: player.state
      };
    }

    if (player.state !== GameState.PLAYING) {
      return {
        success: false,
        message: '❌ Сначала начни новую игру командой /new_game',
        state: player.state
      };
    }

    const result = player.game.move(direction);

    // если ход не удался (неверное направление или плитки не двигаются)
    if (result.includes('❌') || result.includes('Так ходить нельзя')) {
      return { success: false, message: result, state: player.state };
    }

    // проверяем победу
    if (player.game.checkWin()) {
      player.state = GameState.GAME_OVER;
      return {
        success: true,
        message: `🎉 ПОБЕДА! Ты собрал 2048!\n\n${result}`,
        state: player.state
      };
    }

    // проверяем, есть ли ещё ходы
    if (!player.game.hasAvailableMoves()) {
      player.state = GameState.GAME_OVER;
      return {
        success: true,
        message: `😔 Игра окончена! Нет доступных ходов.\n\n${result}`,
        state: player.state
      };
    }

    return { success: true, message: result, state: player.state };
  }

  undo(userId) {
    const player = this.getPlayerGame(userId);

    if (player.state !== GameState.PLAYING && player.state !== GameState.GAME_OVER) {
      return {
        success: false,
        message: '❌ Сначала начни новую игру командой /new_game',
        state: player.state
      };
    }

    const result = player.game.undo();
    if (result) {
      // После отмены возвращаем состояние PLAYING (если было GAME_OVER)
      player.state = GameState.PLAYING;
      return {
        success: true,
        message: `↩️ Ход отменен!\n\n${result}`,
        state: player.state
      };
    } else {
      return {
        success: false,
        message: '❌ Нечего отменять! Сделай хотя бы один ход.',
        state: player.state
      };
    }
  }

  getPlayerState(userId) {
    const player = this.getPlayerGame(userId);
    return player.state;
  }
}