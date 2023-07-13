import Phaser from "phaser";
import { postRequest } from "@/lib/apiRequests";
import Button from "../components/Button";

export default class LeaderboardScene extends Phaser.Scene {
  win = false;
  promptForUsername = false;
  score = 0;

  constructor() {
    super("LeaderboardScene");
  }
  init({
    win,
    promptForUsername,
    score,
  }: {
    win: boolean;
    promptForUsername?: boolean;
    score?: number;
  }) {
    this.win = win;
    this.promptForUsername = promptForUsername ?? false;
    this.score = score ?? 0;
  }
  preload() {
    this.load.image("stars", "/images/Stars_nebulae/stars.png");
  }

  create() {
    this.add
      .image(+this.game.config.width / 2, +this.game.config.height / 2, "stars")
      .setDisplaySize(+this.game.config.width, +this.game.config.height);

    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: "40px",
      fontStyle: "bold",
      fontFamily: "Courier New",
    };

    this.add
      .text(
        +this.game.config.width / 2,
        +this.game.config.height / 2 - 150,
        "CONGRATULATIONS YOU MADE",
        textStyle
      )
      .setOrigin(0.5, 0.5)
      .setVisible(this.win);

    this.add
      .text(
        +this.game.config.width / 2,
        +this.game.config.height / 2 - 150,
        "UNFORTUNATELY YOU DIDN'T MAKE",
        textStyle
      )
      .setOrigin(0.5, 0.5)
      .setVisible(!this.win);

    this.add
      .text(
        +this.game.config.width / 2,
        +this.game.config.height / 2 - 110,
        "THE LEADERBOARD",
        textStyle
      )
      .setOrigin(0.5, 0.5);

    const usernamePrompt = this.add
      .text(
        +this.game.config.width / 2,
        +this.game.config.height / 2,
        "PLEASE ENTER A USERNAME AND HIT ENTER",
        textStyle
      )
      .setOrigin(0.5, 0.5)
      .setVisible(this.promptForUsername);

    const usernameError = this.add
      .text(
        +this.game.config.width / 2,
        +this.game.config.height / 2 + 120,
        "ACCOUNT WITH THAT NAME ALREADY EXISTS.",
        {
          fontSize: "40px",
          fontStyle: "bold",
          color: "red",
        }
      )
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    const emptyUsernameError = this.add
      .text(
        +this.game.config.width / 2,
        +this.game.config.height / 2 + 120,
        "PLEASE ENTER A USERNAME",
        {
          fontSize: "40px",
          fontStyle: "bold",
          color: "red",
        }
      )
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    const slotFilledError = this.add
      .text(
        +this.game.config.width / 2,
        +this.game.config.height / 2,
        "SLOT FILLED, SORRY!",
        {
          fontSize: "40px",
          fontStyle: "bold",
          color: "red",
        }
      )
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    const scoreAdded = this.add
      .text(
        +this.game.config.width / 2,
        +this.game.config.height / 2,
        "YOUR SCORE WAS ADDED",
        textStyle
      )
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    const playAgain = new Button(
      this,
      +this.game.config.width / 2,
      !this.promptForUsername
        ? +this.game.config.height / 2
        : +this.game.config.height / 2 + 120,
      "play again",
      "menu-button",
      "pointerdown",
      () => {
        this.scene.start("MainScene", { score: 0, level: 1 });
      }
    ).setVisible(!this.promptForUsername);

    const html = "<div class='lds-dual-ring'></div>";
    const loadingSpinner = this.add
      .dom(+this.game.config.width / 2, +this.game.config.height / 2 + 140)
      .createFromHTML(html)
      .setVisible(false);

    const input = this.add
      .dom(
        +this.game.config.width / 2,
        +this.game.config.height / 2 + 60,
        "input",
        { ...textStyle, color: "#000" }
      )
      .setOrigin(0.5, 0.5)
      .addListener("keydown")
      .on("keydown", async (event: KeyboardEvent) => {
        if (event.key === " ") {
          return event.preventDefault();
        }

        usernameError.setVisible(false);
        emptyUsernameError.setVisible(false);
        const target = event.target as HTMLInputElement;
        const username = target.value;
        if (event.key === "Enter") {
          if (!username.length) {
            return emptyUsernameError.setVisible(true);
          }

          target.disabled = true;
          loadingSpinner.setVisible(true);
          try {
            const { userExists, added } = await postRequest(
              "/api/high-scores/add-when-unauthenticated",
              {
                username,
                score: this.score,
              }
            );
            loadingSpinner.setVisible(false);
            target.disabled = false;
            if (userExists) {
              return usernameError.setVisible(true);
            }
            usernamePrompt.setVisible(false);
            playAgain.setVisible(true);
            input.setVisible(false);
            if (added) {
              scoreAdded.setVisible(true);
            } else {
              slotFilledError.setVisible(true);
            }
          } catch (error) {
            window.showBoundary(error);
          }
        }
      })
      .setVisible(this.promptForUsername);
  }
}
