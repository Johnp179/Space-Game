import Phaser from "phaser";
import { useEffect } from "react";
import { IUser } from "@/lib/session";
import { useErrorBoundary } from "react-error-boundary";
import LeaderboardScene from "@/game/scenes/LeaderboardScene";
import ControlsBar from "@/game/scenes/ControlsBar";
import MainScene from "@/game/scenes/MainScene";
import ControlsScene from "@/game/scenes/ControlsScene";
import GameOverScene from "@/game/scenes/GameOverScene";
import OpeningScene from "@/game/scenes/OpeningScene";

export function wait(ms:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

declare global {
  interface Window {
    user: IUser | null;
    showBoundary: (error: any) => void;
  }
}

export default function Game({ user }: { user: IUser | null }) {
  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    window.user = user;
    window.showBoundary = showBoundary;
    const gameDiv = document.querySelector("#game");
    gameDiv?.addEventListener("contextmenu", (event) => event.preventDefault());
    let game: Phaser.Game | null = null;
    const config = {
      type: Phaser.AUTO,
      width: 1024,
      height: 900,
      parent: "game",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          // debug: process.env.NODE_ENV === "development",
        },
      },
      dom: {
        createContainer: true,
      },
      scene: [
        OpeningScene,
        GameOverScene,
        LeaderboardScene,
        ControlsBar,
        MainScene,
        ControlsScene,
      ],
    };
    game = new Phaser.Game(config);

    return () => {
      game!.destroy(true, process.env.NODE_ENV === "production");
      gameDiv!.removeEventListener("contextmenu", (event) =>
        event.preventDefault()
      );
    };
  }, [user, showBoundary]);

  return <div id="game"></div>;
}
