"use client";

import { useEffect, useRef } from "react";
import * as Phaser from "phaser";

// --- Type Definitions for clear communication between components ---
export interface GameStats {
  score: number;
  won: boolean;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface MathGameProps {
  onComplete: (stats: GameStats) => void;
  difficulty: "Easy" | "Medium" | "Hard";
}

// --- Constants for Game Configuration ---
const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const WINNING_SCORE = 50;
const POINTS_PER_QUESTION = 10;
const FONT_FAMILY = "'Inter', Arial, sans-serif";
const PRIMARY_TEXT_COLOR = "#ffffff";
const SECONDARY_TEXT_COLOR = "#cccccc";

// --- Main Phaser Game Scene ---
class MathGameScene extends Phaser.Scene {
  private score!: number;
  private difficulty!: "Easy" | "Medium" | "Hard";
  private onCompleteCallback!: (stats: GameStats) => void;

  private questionText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private optionsText: Phaser.GameObjects.Text[] = [];
  private feedbackText!: Phaser.GameObjects.Text;

  private currentQuestion!: {
    correctAnswer: number;
    options: number[];
  };

  constructor() {
    super({ key: "MathGameScene" });
  }

  init(data: { onComplete: (stats: GameStats) => void; difficulty: "Easy" | "Medium" | "Hard" }) {
    this.onCompleteCallback = data.onComplete;
    this.difficulty = data.difficulty;
  }

  create() {
    this.score = 0;

    // --- UI Elements ---
    this.scoreText = this.add.text(20, 20, `Score: 0`, {
      font: `24px ${FONT_FAMILY}`,
      color: PRIMARY_TEXT_COLOR,
    }).setOrigin(0);
    
    this.add.text(GAME_WIDTH - 20, 20, `Difficulty: ${this.difficulty}`, {
        font: `24px ${FONT_FAMILY}`,
        color: PRIMARY_TEXT_COLOR,
      }).setOrigin(1, 0);

    this.questionText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2.2, "", {
        font: `bold 96px ${FONT_FAMILY}`,
        color: PRIMARY_TEXT_COLOR,
        align: "center",
      }).setOrigin(0.5);

    this.feedbackText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 40, "", {
        font: `32px ${FONT_FAMILY}`,
        align: "center",
      }).setOrigin(0.5).setAlpha(0);

    // Create interactive text options horizontally
    const optionsContainerY = GAME_HEIGHT / 2 + 120;
    const buttonWidth = 150;
    const buttonGap = 20;
    const totalRequiredWidth = (buttonWidth * 4) + (buttonGap * 3);
    const startX = (GAME_WIDTH - totalRequiredWidth) / 2;


    for (let i = 0; i < 4; i++) {
      const optionX = startX + (buttonWidth / 2) + i * (buttonWidth + buttonGap);
      const optionText = this.add.text(optionX, optionsContainerY, "", {
          font: `36px ${FONT_FAMILY}`,
          color: SECONDARY_TEXT_COLOR,
          align: "center",
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: { x: 10, y: 10 },
          fixedWidth: buttonWidth
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.checkAnswer(i))
        .on('pointerover', () => optionText.setStyle({ fill: '#66ff66', backgroundColor: 'rgba(255, 255, 255, 0.2)' }))
        .on('pointerout', () => optionText.setStyle({ fill: SECONDARY_TEXT_COLOR, backgroundColor: 'rgba(255, 255, 255, 0.1)' }));
        
      this.optionsText.push(optionText);
    }

    this.input.keyboard?.on("keydown", this.handleKeyPress, this);
    this.generateAndDisplayQuestion();
  }
  
  private generateAndDisplayQuestion() {
    let num1: number, num2: number;

    switch(this.difficulty) {
        case 'Hard':
            num1 = Phaser.Math.Between(20, 100);
            num2 = Phaser.Math.Between(20, 100);
            break;
        case 'Medium':
            num1 = Phaser.Math.Between(10, 50);
            num2 = Phaser.Math.Between(10, 50);
            break;
        case 'Easy':
        default:
            num1 = Phaser.Math.Between(1, 10);
            num2 = Phaser.Math.Between(1, 10);
            break;
    }

    const correctAnswer = num1 + num2;
    const wrongAnswers = new Set<number>();
    while (wrongAnswers.size < 3) {
      const offset = Phaser.Math.Between(-10, 10);
      if (offset !== 0 && correctAnswer + offset > 0) {
        wrongAnswers.add(correctAnswer + offset);
      }
    }
    const options = Phaser.Utils.Array.Shuffle([correctAnswer, ...wrongAnswers]);
    this.currentQuestion = { correctAnswer, options };
    
    this.questionText.setText(`${num1} + ${num2} = ?`);
    this.optionsText.forEach((text, index) => {
      text.setText(`${options[index]}`);
    });
  }

  private handleKeyPress(event: KeyboardEvent) {
    const keyNum = parseInt(event.key, 10);
    if (keyNum >= 1 && keyNum <= 4) {
      this.checkAnswer(keyNum - 1);
    }
  }

  private checkAnswer(selectedIndex: number) {
    if (this.scene.isPaused()) return;

    const selectedAnswer = this.currentQuestion.options[selectedIndex];
    const isCorrect = selectedAnswer === this.currentQuestion.correctAnswer;
    
    if (isCorrect) {
      this.score += POINTS_PER_QUESTION;
      this.scoreText.setText(`Score: ${this.score}`);
      this.showFeedback("Correct! 🎉", "#2ecc71");
      if (this.score >= WINNING_SCORE) {
        this.endGame(true);
      } else {
        this.time.delayedCall(1000, () => this.generateAndDisplayQuestion());
      }
    } else {
      this.showFeedback("Incorrect!", "#e74c3c");
      // Optional: endGame on wrong answer
      // this.endGame(false); 
    }
  }
  
  private showFeedback(message: string, color: string) {
    this.feedbackText.setText(message).setColor(color).setAlpha(1);
    this.add.tween({
        targets: this.feedbackText,
        alpha: 0,
        ease: 'Power1',
        duration: 1000,
    });
  }
  
  private endGame(won: boolean) {
    this.scene.pause();
    this.input.keyboard?.shutdown();
    
    const finalStats: GameStats = {
      score: this.score,
      won: won,
      difficulty: this.difficulty,
    };
    
    this.cameras.main.fadeOut(500, 20, 20, 40);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.onCompleteCallback(finalStats);
    });
  }
}

// --- The React Component Wrapper for the Phaser Game ---
export default function EnhancedMathGame({ onComplete, difficulty = "Easy" }: MathGameProps) {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      parent: gameRef.current,
      backgroundColor: "transparent",
      scene: [MathGameScene],
    };

    const game = new Phaser.Game(config);
    game.scene.start("MathGameScene", { onComplete, difficulty });

    return () => {
      game.destroy(true);
    };
  }, [onComplete, difficulty]);

  return <div ref={gameRef} className="w-full h-[500px] rounded-lg shadow-2xl" />;
}


