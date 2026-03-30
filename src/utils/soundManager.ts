import { createAudioPlayer, AudioPlayer, preload } from "expo-audio";

const MOVE_SOUND = require("../../assets/sounds/move.mp3");
const BUTTON_PRESS_SOUND = require("../../assets/sounds/buttonPress.mp3");
const WIN_SOUND = require("../../assets/sounds/winner.mp3");
const LOSE_SOUND = require("../../assets/sounds/gameOver2.mp3");

void preload(MOVE_SOUND);
void preload(BUTTON_PRESS_SOUND);
void preload(WIN_SOUND);
void preload(LOSE_SOUND);

class SoundManager {
  private players: Record<string, AudioPlayer> = {};
  private isPrimed = false;

  // Лінива ініціалізація плеєра
  private getPlayer(key: string, source: any): AudioPlayer {
    if (!this.players[key]) {
      this.players[key] = createAudioPlayer(source, {
        downloadFirst: true,
        keepAudioSessionActive: true,
      });
    }
    return this.players[key];
  }

  public prime() {
    if (this.isPrimed) return;
    this.isPrimed = true;

    this.getPlayer("click", MOVE_SOUND);
    this.getPlayer("press", BUTTON_PRESS_SOUND);
  }

  // Для руху плиток
  public playClick(isSoundEnabled: boolean) {
    if (!isSoundEnabled) return;
    try {
      const player = this.getPlayer("click", MOVE_SOUND);
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.warn("SoundManager.playClick error:", error);
    }
  }

  // Для натискання кнопок інтерфейсу
  public playPressButton(isSoundEnabled: boolean) {
    if (!isSoundEnabled) return;
    try {
      const player = this.getPlayer("press", BUTTON_PRESS_SOUND);
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.warn("SoundManager.playPressButton error:", error);
    }
  }

  // Для перемоги
  public playWin(isSoundEnabled: boolean) {
    if (!isSoundEnabled) return;
    try {
      const player = this.getPlayer("win", WIN_SOUND);
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.warn("SoundManager.playWin error:", error);
    }
  }

  // Для програшу (якщо буде потрібно)
  public playLose(isSoundEnabled: boolean) {
    if (!isSoundEnabled) return;
    try {
      const player = this.getPlayer("lose", LOSE_SOUND);
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.warn("SoundManager.playLose error:", error);
    }
  }
}

export const soundManager = new SoundManager();
