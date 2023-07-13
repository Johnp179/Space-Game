import Phaser from "phaser";
import { useEffect, useState } from "react";
import { IUser } from "@/lib/session";
import { useErrorBoundary } from "react-error-boundary";
import LeaderboardScene from "@/game/scenes/LeaderboardScene";
import ControlsBar from "@/game/scenes/ControlsBar";
import MainScene from "@/game/scenes/MainScene";
import ControlsScene from "@/game/scenes/ControlsScene";
import GameOverScene from "@/game/scenes/GameOverScene";
import OpeningScene from "@/game/scenes/OpeningScene";
import PauseScene from "@/game/scenes/PauseScene";

export function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default function Game({ user }: { user: IUser | null }) {
  const { showBoundary } = useErrorBoundary();
  const [fullScreen, setFullScreen] = useState(false);
  useEffect(() => {
    window.user = user;
    window.showBoundary = showBoundary;
    window.setFullScreen = setFullScreen;
    const gameDiv = document.querySelector("#game");
    gameDiv?.addEventListener("contextmenu", (event) => event.preventDefault());
    let game: Phaser.Game | null = null;
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      // width: 1024,
      // height: 900,
      scale: {
        parent: "game",
        mode: Phaser.Scale.FIT,
        width: 1024,
        height: 900,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: "fullscreen-target",
      },
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
        PauseScene,
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
  //w-[80%] h-[80%]
  return (
    <div className={`${fullScreen ? "h-full w-full" : "h-[80%] w-[80%]"}`}>
      <div id="game"></div>
    </div>
  );
}
