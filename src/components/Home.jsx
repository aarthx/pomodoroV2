import React from 'react';
import styles from './Home.module.css';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { ReactComponent as Tomate } from '../assets/tomato.svg';
import { ReactComponent as TomateVazio } from '../assets/emptyTomato.svg';

const Home = () => {
  const [ligado, setLigado] = React.useState(false);
  const [situation, setSituation] = React.useState('Focus');
  const [focus, setFocus] = React.useState(25);
  const [shortBreak, setShortBreak] = React.useState(5);
  const [longBreak, setLongBreak] = React.useState(15);
  const [minuto, setMinuto] = React.useState(focus);
  const [segundo, setSegundo] = React.useState(0);
  const [tomatos, setTomatos] = React.useState(0);
  const intervalRef = React.useRef(null);
  const [alarme, setAlarme] = React.useState('');

  React.useEffect(() => {
    setAlarme(new Audio('alarm.wav'));
  }, []);

  React.useEffect(() => {
    if(segundo < 0) {
      let minutosPassados = Math.ceil(segundo/-60)
      if(minuto - minutosPassados < 0) {
        setSegundo(0)
        setMinuto(0)
      } else {
        setSegundo(segundo => segundo + (60 * minutosPassados))
        setMinuto(minuto => minuto - minutosPassados)
      }
    }
    document.title = `${minuto >= 10 ? minuto : `0${minuto}`}:${segundo >= 10 ? segundo : `0${segundo}`}`
    if (segundo <= 0 && minuto <= 0) {
      pausarTempo();
      alarme.play();
    }
    if (segundo <= 0 && minuto <= 0 && situation === 'Focus') {
      setTomatos((tomatos) => tomatos + 1);
      if (tomatos < 3) {
        setSituation('Short Break');
        setMinuto(shortBreak);
      } else if (tomatos === 3) {
        setSituation('Long Break');
        setMinuto(longBreak);
      }
    }
    if (segundo <= 0 && minuto <= 0 && situation === 'Short Break') {
      setSituation('Focus');
      setMinuto(focus);
    }
    if (segundo <= 0 && minuto <= 0 && situation === 'Long Break') {
      alarme.play();
      alert('PARABÉNS! Você concluiu os 4 ciclos pomodoros!');
      resetar();
    }
  }, [segundo]);
  let testeTempo
  let testeTempo2
  let intervaloContabilizado
  function iniciaTempo() {
    setLigado(true);
    intervalRef.current = setInterval(() => {
      testeTempo2 = Date.now()
      intervaloContabilizado = ((testeTempo2 - testeTempo)/1000).toFixed(0)
      setSegundo((segundo) => {
        if(intervaloContabilizado >= 2) {
          return segundo - intervaloContabilizado
        }
        if (segundo === 0) {
          setMinuto(min => min - 1)
          return 59;
        }
        return segundo - 1;
      });
      testeTempo = Date.now()
    }, 1000);
  }

  function pausarTempo() {
    setLigado(false);
    clearInterval(intervalRef.current);
  }

  function pular() {
    pausarTempo();
    alarme.play();
    if (situation === 'Focus') {
      setTomatos((tomatos) => tomatos + 1);
      if (tomatos < 3) {
        setSituation('Short Break');
        setMinuto(shortBreak);
        setSegundo(0);
      } else {
        setSituation('Long Break');
        setMinuto(longBreak);
        setSegundo(0);
      }
    }
    if (situation === 'Short Break') {
      setSituation('Focus');
      setMinuto(focus);
      setSegundo(0);
    }
    if (situation === 'Long Break') {
      alert('PARABÉNS! Você concluiu os 4 ciclos pomodoros!');
      resetar();
    }
  }

  function resetar() {
    pausarTempo();
    setSituation('Focus');
    setMinuto(focus);
    setSegundo(0);
    setTomatos(0);
  }

  return (
    <main className={styles.mainContent}>
      <Logo />
      <div className={styles.timerBox}>
        <h1>{situation}</h1>
        <span>
          {minuto >= 10 ? minuto : `0${minuto}`}:
          {segundo >= 10 ? segundo : `0${segundo}`}
        </span>
        <ul className={styles.tomatoCounter}>
          <li>{tomatos >= 1 ? <Tomate /> : <TomateVazio />}</li>
          <li>{tomatos >= 2 ? <Tomate /> : <TomateVazio />}</li>
          <li>{tomatos >= 3 ? <Tomate /> : <TomateVazio />}</li>
          <li>{tomatos >= 4 ? <Tomate /> : <TomateVazio />}</li>
        </ul>
      </div>
      <div className={styles.buttonsBox}>
        <ul>
          {ligado ? (
            <button onClick={pausarTempo}>Pause</button>
          ) : (
            <button onClick={iniciaTempo}>Play</button>
          )}
          <button onClick={pular}>Skip</button>
          <button onClick={resetar}>Reset</button>
        </ul>
      </div>
      <div className={styles.optionsBox}>
        <ul>
          <li>
            <p>Focus</p>
            <p>
              <span
                onClick={() => {
                  if (focus > 10) setFocus(focus - 1);
                }}
              >
                -
              </span>
              {focus}
              <span
                onClick={() => {
                  if (focus < 60) setFocus(focus + 1);
                }}
              >
                +
              </span>
            </p>
          </li>
          <li>
            <p>Short Break</p>
            <p>
              <span
                onClick={() => {
                  if (shortBreak > 1) setShortBreak(shortBreak - 1);
                }}
              >
                -
              </span>
              {shortBreak}
              <span
                onClick={() => {
                  if (shortBreak < 30) setShortBreak(shortBreak + 1);
                }}
              >
                +
              </span>
            </p>
          </li>
          <li>
            <p>Long Break</p>
            <p>
              <span
                onClick={() => {
                  if (longBreak > 1) setLongBreak(longBreak - 1);
                }}
              >
                -
              </span>
              {longBreak}
              <span
                onClick={() => {
                  if (longBreak < 30) setLongBreak(longBreak + 1);
                }}
              >
                +
              </span>
            </p>
          </li>
        </ul>
      </div>
      <div className={styles.footerResponsive}>
        {' '}
        <p>© Arthur Augusto 2023</p>{' '}
      </div>
    </main>
  );
};

export default Home;
