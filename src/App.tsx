import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';

const TITLE = "L'intesa vincente";
const DESCRIPTION = 'Simulatore online per il gioco "L\'intesa vincente" del programma Reazione a catena';
const SCHEMA = `
	    {
		"@context": "https://schema.org/",
		"@type": "WebApplication",
		"name": "L'intesa vincente",
		"url": "${window.location.href}",
		"@id": "${window.location.href}",
		"browserRequirements": ["requires JavaScript"],
		"applicationCategory": "Game",
		"aggregateRating": {
		    "@type": "AggregateRating",
		    "ratingValue": 4.6,
		    "ratingCount": 263
		},
		"creator": {
		    "@id": "https://github.com/borsattoz"
		}
	    }
`;

export default function Board() {
  const INITIAL_TIME = 60;
  const INITIAL_RUNNING = false;
  const INITIAL_PAUSED = false;
  const INITIAL_ANSWERED = true;
  const INITIAL_SCORE = 0;
  const INITIAL_PASSO = 3;
  const INITIAL_WORDS: string[] = [];

  const INITIAL_WORD = "PRONTI";

  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(INITIAL_RUNNING);
  const [isPaused, setIsPaused] = useState(INITIAL_PAUSED);
  const [answered, setAnswered] = useState(INITIAL_ANSWERED);
  const [passo, setPasso] = useState(INITIAL_PASSO);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [words, setWords] = useState(INITIAL_WORDS);
  const [word, setWord] = useState(INITIAL_WORD);

  const isDisabledStart = useMemo(() => isRunning || !answered || timeLeft <= 0, [isRunning, answered, timeLeft]);
  const isDisabledPause = useMemo(() => !isRunning || timeLeft <= 0, [isRunning, timeLeft]);
  const isDisabledPasso = useMemo(() => !isRunning || timeLeft <= 0 || passo <= 0, [isRunning, timeLeft, passo]);
  const isDisabledAnswer = useMemo(() => !isPaused || answered, [isPaused, answered]);

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
    <div className='nes-container is-dark'>
      <Helmet>
        <meta name="description" content={DESCRIPTION} />
	<title>{TITLE}</title>
	<script type="application/ld+json">{SCHEMA}</script>
      </Helmet>
      <h1>{TITLE}</h1>
      <p>punteggio: {score}</p>
      <p>passo: {passo}</p>
      <p>tempo rimasto: {timeLeft}s</p>
      <h2 className='nes-container is-dark'>{word.toUpperCase()}</h2>
      <p><button onClick={() => start()} disabled={isDisabledStart} className={`nes-btn ${isDisabledStart ? "is-disabled" : ""}`}>VIA</button></p>
      <p><button onClick={() => pause()} disabled={isDisabledPause} className={`nes-btn ${isDisabledPause ? "is-disabled" : ""}`}>PRENOTA</button></p>
      <p><button onClick={() => doPasso()} disabled={isDisabledPasso} className={`nes-btn is-warning ${isDisabledPasso ? "is-disabled" : ""}`}>PASSO</button></p>
      <p><button onClick={() => correct()} disabled={isDisabledAnswer} className={`nes-btn is-success ${isDisabledAnswer ? "is-disabled" : ""}`}>CORRETTO</button></p>
      <p><button onClick={() => error()} disabled={isDisabledAnswer} className={`nes-btn is-error ${isDisabledAnswer ? "is-disabled" : ""}`}>ERRORE</button></p>
      <p><button onClick={() => reset()} className='nes-btn'>RICOMINCIA</button></p>
    </div>
  );
}
