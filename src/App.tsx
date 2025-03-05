import React from 'react';
import { useState, useEffect } from 'react';

export default function Board() {
  const INITIAL_TIME = 60;
  const INITIAL_RUNNING = false;
  const INITIAL_PAUSED = false;
  const INITIAL_ANSWERED = true;
  const INITIAL_SCORE = 0;
  const INITIAL_PASSO = 3;
  const INITIAL_WORDS: string[] = [];
  const INITIAL_WORD = "";

  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(INITIAL_RUNNING);
  const [isPaused, setIsPaused] = useState(INITIAL_PAUSED);
  const [answered, setAnswered] = useState(INITIAL_ANSWERED);
  const [passo, setPasso] = useState(INITIAL_PASSO);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [words, setWords] = useState(INITIAL_WORDS);
  const [word, setWord] = useState(INITIAL_WORD);

  const reset = () => {
    setIsPaused(INITIAL_PAUSED);
    setIsRunning(INITIAL_RUNNING);
    setTimeLeft(INITIAL_TIME);
    setAnswered(INITIAL_ANSWERED);
    setPasso(INITIAL_PASSO);
    setScore(INITIAL_SCORE);
    setWord(INITIAL_WORD);
  }

  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch('words.txt');
      if (!response.ok) throw new Error('cannot find `words.txt`');

      const text = await response.text();
      const lines = text.split("\n").map(line => line.trim()).filter(line => line != "");

      setWords(lines);
    };

    if (words.length == 0) {
      fetchWords();
    }
  }, [words]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsPaused(true);
      
      return;
    }

    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const start = () => {
    if (words.length == 0) {

    }

    const randomIndex = Math.floor(Math.random() * words.length);
    const newWords = words.filter((_, index) => index != randomIndex);

    setWord(words[randomIndex]);
    setWords(newWords);

    setIsRunning(true);
    setIsPaused(false);
    setAnswered(false);
  };

  const pause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const doPasso = () => {
    setIsRunning(false);
    setAnswered(true);

    if (passo > 0) {
      setPasso((prev) => prev - 1);
    }
  };

  const correct = () => {
    setAnswered(true);

    setScore((prev) => prev + 1);
  };

  const error = () => {
    setAnswered(true);

    if (score > 0) {
      setScore((prev) => prev - 1);
    }
  };

  return (
    <>
      <h1>L'intesa vincente</h1>
      <h2>score: {score}</h2>
      <h2>passo: {passo}</h2>
      <h2>time: {timeLeft}s</h2>
      <p><button onClick={() => start()} disabled={isRunning || !answered || timeLeft <= 0}>START</button></p>
      <p><button onClick={() => pause()} disabled={!isRunning || timeLeft <= 0}>BUZZ IN</button></p>
      <p><button onClick={() => doPasso()} disabled={!isRunning || timeLeft <= 0 || passo <= 0} className='passo'>PASSO</button></p>
      <p><button onClick={() => correct()} disabled={!isPaused || answered} className='correct'>CORRECT</button></p>
      <p><button onClick={() => error()} disabled={!isPaused || answered} className='error'>ERROR</button></p>
      <p><button onClick={() => reset()}>RESET</button></p>
      <h2>{word.toUpperCase()}</h2>
    </>
  );
}
