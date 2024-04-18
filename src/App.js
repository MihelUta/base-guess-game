import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [iteration, setIteration] = useState(0);
  const [randomArray, setRandomArray] = useState([]);
  const [message, setMessage] = useState([]);
  const [hint, setHint] = useState([]);
  const [win, setWin] = useState(0);
  const [time, setTime] = useState(0);
  const [timeCountDown, setTimeCountDown] = useState(1);
  const [highScore, setHighScore] = useState(0);

  const [level, setLevel] = useState("easy");
  const [playerName, setPlayerName] = useState("jhon doe");
  const [attempt, setAttempt] = useState(6);
  const [guessCount, setGuessCount] = useState(3);

  const [top10, setTop10] = useState([]);

  const [guess, newGuess] = useState();
  const [inGame, setInGame] = useState(false);
  const [start, setStart] = useState(false);
  const [guessVal, setGuessVal] = useState([]);
  const [timeStyle, setTimeStyle] = useState('green');
  const textBase = useRef(null);

  // generate random guess for each first render

  useEffect(() => {
    newGuess(Math.floor(1000 + Math.random() * 9000));
  }, []);

  const clearAll = () => {
    textBase.current.classList.remove("guess-error");
    textBase.current.childNodes.forEach((child) => {
      child.value = "";
    });
    setGuessVal([]);
    setInGame(false);
    setTimeStyle('green')
    setHint([])
  };

  const clear = () => {
    textBase.current.classList.remove("guess-error");
    textBase.current.childNodes.forEach((child) => {
      child.value = "";
    });
    setGuessVal([]);
  };

  const getGuess = () => {
    if (parseInt(guessVal.join("")) === guess) {
      textBase.current.classList.remove("guess-error");
      setInGame(true);
    } else {
      textBase.current.classList.add("guess-error");
    }
  };

  function handleInputChange(event, index) {
    const inputValue = event.target.value;
    const regex = /^[0-9\b]+$/; // Regex untuk memeriksa apakah input hanya terdiri dari angka
    if (regex.test(inputValue)) {
        // Jika input hanya terdiri dari angka, lanjutkan
        focusNext(event);
    } else {
        // Jika input tidak hanya terdiri dari angka, hapus karakter yang tidak valid
        event.target.value = inputValue.replace(/[^\d]/g, '');
    }
  }

  const focusNext = (e) => {
    const childCount = textBase.current.childElementCount;
    const currentIndex = [...e.target.parentNode.children].indexOf(e.target);
    if (currentIndex !== childCount - 1) {
      e.target.nextSibling.focus();
    } else {
      const values = [];
      textBase.current.childNodes.forEach((child) => {
        values.push(child.value);
      });
      if (values.length !== 0) {
        setGuessVal(values);
      }
      handleGuess(e, values.toString());
    }
  };

  useEffect(() => {
    if (guessVal.length === textBase.current.childElementCount) {
      getGuess();
    }
  }, [guessVal]);

  const generateRandomArray = (length) => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let currentIndex = 10;
    let randomIndex;

    // mengacak elemen array dengan algoritma Fisher-Yates
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // menukar nilai elemen array
      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    return arr.slice(0, length);
  };

  const handleGuess = (event,guess) => {
    event.preventDefault();
    if (guess.toString() === randomArray.toString()) {
      let score = (((60 * timeCountDown) - (Date.now() - time)/1000)) * (10-iteration)
      setMessage([`Congratulation! You Win!`,`score ${Math.floor(score)}`, `attempt ${iteration+1}`, `time ${Math.floor((Date.now() - time)/1000)} seconds` ]);
      setInGame(true)
      let winCount = win + 1;
      setWin(winCount)
      if((score > highScore) || (highScore === 0)){
        setHighScore(score)
      }

      //set topscore
      const newTop10 = [...top10,{score:score,playerName:playerName}];
      newTop10.sort((a, b) => b.score - a.score);
      newTop10.slice(0, 5);
      setTop10(newTop10);

    } else if (iteration === attempt-1) {
      setMessage([`Game Over! The answer is ${randomArray}`]);
      setInGame(true)
    } else {
      let rightPosition = 0;
      let rightValue = 0;
      let rightNumberPosition = [];
      let rightNumberValue = [];

      for (let i = 0; i < randomArray.length; i++) {
        let isRightValue = false;
        for (let j = 0; j < guess.length; j++) {
          if (randomArray[i].toString() === guess[j]) {
            rightValue++;
            isRightValue = true;
          }
        }
        if(isRightValue){
          rightNumberValue.push(randomArray[i])
        }else{
          rightNumberValue.push("X")
        }

        if (randomArray[i].toString() === guess[i*2]) {
          rightPosition++;
          rightNumberPosition.push(randomArray[i])
        }else{
          rightNumberPosition.push("X")
        }
      }
      
      let messageHint = "";
      setIteration(iteration + 1);

      clear();
      switch(level){
        case "easy":
          event.target.previousSibling.previousSibling.focus();
          messageHint = `Right Position: ${rightPosition}, Right Value: ${rightValue}  `;
          break;
        case "medium":
          event.target.previousSibling.previousSibling.previousSibling.focus();
          messageHint = `${guess} | Right Position: ${rightPosition}, Right Value: ${rightValue}`;
          break;
        case "hard":
          event.target.previousSibling.previousSibling.previousSibling.previousSibling.focus();
          messageHint = `${guess} | Right Value: ${rightValue}`;
          break;
        default:
          event.target.previousSibling.previousSibling.focus();
          messageHint = `${guess} | Right Position: ${rightPosition}, Right Value: ${rightValue}`;
          break;
      }
      setMessage([...message, messageHint]);

      setHintData(guess, rightNumberValue);
      toggleHistory()
    }
  };

  const handleGuessNoEvent = (guess) => {
    if (guess.toString() === randomArray.toString()) {
      let score = (((60 * timeCountDown) - (Date.now() - time)/1000)) * (10-iteration)
      setMessage([`Congratulation! You Win!`,`score ${Math.floor(score)}`, `attempt ${iteration+1}`, `time ${Math.floor((Date.now() - time)/1000)} seconds` ]);
      setInGame(true)
      let winCount = win + 1;
      setWin(winCount)
      if((score > highScore) || (highScore === 0)){
        setHighScore(score)
      }

      //set topscore
      const newTop10 = [...top10,{score:score,playerName:playerName}];
      newTop10.sort((a, b) => b.score - a.score);
      newTop10.slice(0, 5);
      setTop10(newTop10);

    } else if (iteration === attempt-1) {
      setMessage([`Game Over! The answer is ${randomArray}`]);
      setInGame(true)
    } else {
      let rightPosition = 0;
      let rightValue = 0;
      let rightNumberPosition = [];
      let rightNumberValue = [];

      for (let i = 0; i < randomArray.length; i++) {
        if (randomArray[i].toString() === guess[i*2]) {
          rightPosition++;
          rightNumberPosition.push(randomArray[i])
        }else{
          rightNumberPosition.push("X")
        }

        let isRightValue = false;
        for (let j = 0; j < guess.length; j++) {
          if (randomArray[i].toString() === guess[j]) {
            rightValue++;
            isRightValue = true;
          }
        }
        if(isRightValue){
          rightNumberValue.push(randomArray[i])
        }else{
          rightNumberValue.push("X")
        }
      }

      let messageHint = "";
      setIteration(iteration + 1);
      
      clear();
      switch(level){
        case "easy":
          messageHint = `Right Position: ${rightPosition}, Right Value: ${rightValue}  `;
          break;
        case "medium":
          messageHint = `${guess} | Right Position: ${rightPosition}, Right Value: ${rightValue}`;
          break;
        case "hard":
          messageHint = `${guess} | Right Value: ${rightValue}`;
          break;
        default:
          messageHint = `${guess} | Right Position: ${rightPosition}, Right Value: ${rightValue}`;
          break;
      }
      setMessage([...message, messageHint]);
      setHintData(guess, rightNumberValue);
      toggleHistory()
    }
  };

  const setHintData = (guess, rightNumberValue) => {
    let messageHintObj = [];

    guess = guess.replaceAll(',','');
    for(var i = 0; i < guess.length; i++){
      let color = 'red'
      let currentGuess = guess[i];
      // check position
      for(var j = 0; j < rightNumberValue.length; j++){
        let currentNumberValue = rightNumberValue[j];
        if(currentGuess == currentNumberValue){
          color = 'yellow'
        }
      }

      // check value
      let currentPosition = rightNumberValue[i];
      if(currentGuess == currentPosition){
        color = 'green'
      }

      messageHintObj.push({color,number:currentGuess});
    }

    setHint([...hint,messageHintObj])
  }

  const handleReset = () => {
    setTimeCountDown(5)
    let guessCount = 3;
    switch(level){
      case "easy":
        setAttempt(6);
        guessCount = 3;
        setGuessCount(3);
        break;
      case "medium":
        setAttempt(8);
        guessCount = 4;
        setGuessCount(4);
        break;
      case "hard":
        setAttempt(10);
        guessCount = 5;
        setGuessCount(5);
        break;
      default:
        setAttempt(6);
        guessCount = 3;
        setGuessCount(3);
        break;
    }
    setRandomArray(generateRandomArray(guessCount));
    setMessage([]);
    setIteration(0);
    clearAll();
    setStart(true);
    setTime(Date.now())
    
    
  };

  const Leaderboard = () => {
    let colors = [
      '#FFB900',
      '#69797E',
      '#847545',
      '#E74856',
      '#0078D7',
      '#0099BC',
      '#7A7574',
      '#767676',
      '#FF8C00',
      '#E81123',
      '#0063B1',
      '#2D7D9A',
      '#5D5A58',
      '#4C4A48',
      '#F7630C',
      '#EA005E',
      '#8E8CD8',
      '#00B7C3',
      '#68768A',
      '#CA5010',
      '#C30052',
      '#6B69D6',
      '#038387',
      '#515C6B',
      '#4A5459',
      '#DA3B01',
      '#E3008C',
      '#8764B8',
      '#00B294',
      '#567C73',
      '#647C64',
      '#EF6950',
      '#BF0077',
      '#744DA9',
      '#018574',
      '#486860',
      '#525E54',
      '#D13438',
      '#C239B3',
      '#B146C2',
      '#00CC6A',
      '#498205',
      '#FF4343',
      '#9A0089',
      '#881798',
      '#10893E',
      '#107C10',
      '#7E735F'
    ];
    return (
      <div className="Leaderboard">
				<div className="leaders">
          <h1>Leaderboard</h1>
					{top10.length > 0 ? (
						top10.map((el, i) => (
							<>
                <div
                  key={i}
                  style={{
                    animationDelay: i * 0.1 + 's'
                  }}
                  className="leader"
                >
                <div className="leader-wrap">
                  {i < 3 ? (
                    <div
                      style={{
                        backgroundColor: colors[i]
                      }}
                      className="leader-ava"
                    >
                      <svg
                        fill="#fff"
                        xmlns="http://www.w3.org/2000/svg"
                        height={24}
                        width={24}
                        viewBox="0 0 32 32"
                      >
                        <path d="M 16 3 C 14.354991 3 13 4.3549901 13 6 C 13 7.125993 13.63434 8.112309 14.5625 8.625 L 11.625 14.5 L 7.03125 11.21875 C 7.6313215 10.668557 8 9.8696776 8 9 C 8 7.3549904 6.6450096 6 5 6 C 3.3549904 6 2 7.3549904 2 9 C 2 10.346851 2.9241199 11.470238 4.15625 11.84375 L 6 22 L 6 26 L 6 27 L 7 27 L 25 27 L 26 27 L 26 26 L 26 22 L 27.84375 11.84375 C 29.07588 11.470238 30 10.346852 30 9 C 30 7.3549901 28.645009 6 27 6 C 25.354991 6 24 7.3549901 24 9 C 24 9.8696781 24.368679 10.668557 24.96875 11.21875 L 20.375 14.5 L 17.4375 8.625 C 18.36566 8.112309 19 7.125993 19 6 C 19 4.3549901 17.645009 3 16 3 z M 16 5 C 16.564129 5 17 5.4358709 17 6 C 17 6.5641291 16.564129 7 16 7 C 15.435871 7 15 6.5641291 15 6 C 15 5.4358709 15.435871 5 16 5 z M 5 8 C 5.5641294 8 6 8.4358706 6 9 C 6 9.5641286 5.5641291 10 5 10 C 4.4358709 10 4 9.5641286 4 9 C 4 8.4358706 4.4358706 8 5 8 z M 27 8 C 27.564129 8 28 8.4358709 28 9 C 28 9.5641283 27.564128 10 27 10 C 26.435872 10 26 9.5641283 26 9 C 26 8.4358709 26.435871 8 27 8 z M 16 10.25 L 19.09375 16.4375 L 20.59375 16.8125 L 25.59375 13.25 L 24.1875 21 L 7.8125 21 L 6.40625 13.25 L 11.40625 16.8125 L 12.90625 16.4375 L 16 10.25 z M 8 23 L 24 23 L 24 25 L 8 25 L 8 23 z" />
                      </svg>
                    </div>
                  ) : null}
                  <div className="leader-content">
                    <div className="leader-name">{i + 1 + '. ' + el.playerName}</div>
                    <div className="leader-score">
                      <svg
                        fill="currentColor"
                        height="20"
                        viewBox="0 0 493 493"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M247,468 C369.05493,468 468,369.05493 468,247 C468,124.94507 369.05493,26 247,26 C124.94507,26 26,124.94507 26,247 C26,369.05493 124.94507,468 247,468 Z M236.497159,231.653661 L333.872526,231.653661 L333.872526,358.913192 C318.090922,364.0618 303.232933,367.671368 289.298112,369.742004 C275.363292,371.81264 261.120888,372.847943 246.570473,372.847943 C209.522878,372.847943 181.233938,361.963276 161.702804,340.193617 C142.17167,318.423958 132.40625,287.169016 132.40625,246.427855 C132.40625,206.805956 143.738615,175.914769 166.403684,153.753368 C189.068753,131.591967 220.491582,120.511432 260.673112,120.511432 C285.856523,120.511432 310.144158,125.548039 333.536749,135.621403 L316.244227,177.257767 C298.336024,168.303665 279.700579,163.826682 260.337335,163.826682 C237.840155,163.826682 219.820296,171.381591 206.277218,186.491638 C192.734139,201.601684 185.962702,221.915997 185.962702,247.435186 C185.962702,274.073638 191.419025,294.415932 202.331837,308.462679 C213.244648,322.509425 229.109958,329.532693 249.928244,329.532693 C260.785092,329.532693 271.809664,328.413447 283.002291,326.174922 L283.002291,274.96891 L236.497159,274.96891 L236.497159,231.653661 Z"></path>
                      </svg>
                      <div className="leader-score_title">{Math.floor(el.score)}</div>
                    </div>
                  </div>
                </div>
                <div style={{ animationDelay: 0.4 + i * 0.2 + 's' }} className="leader-bar">
                  <div
                    style={{
                      backgroundColor: colors[i],
                      width: el.score / 3000 * 100 + '%'
                    }}
                    className="bar"
                  />
                </div>
              </div>
              </>
						))
					) : (
						<div className="">No data Leaderboard</div>
					)}
				</div>
			</div>
    )
  }

  const History = () => {
    
    return (
      <>
        { hint.length > 0 &&
          <>
            {hint && hint.map((data, index) => (
              <div className="horizontal-numbers-container">
                <p style={{marginRight:10}}>{message[index]}</p>
                {level ==='easy' && data &&
                  data.map((e, index) => (
                    <p key={index} className={`number-history ${e.color}`}>
                      {e.number}
                    </p>
                  ))}
              </div>
            ))}
          </>
        }
        {hint.length === 0 && <p>no data history</p>}
        
      </>
    )
  }

  const Timer = () => {
    let startTime = time; // Get current time (start time)
    let endTime = startTime + (timeCountDown * 60 * 1000); // Add 5 minutes (300000 milliseconds) to start time

    let timeLeft = Math.floor((endTime - Date.now())/1000);
    const initMinutes = Math.floor(timeLeft / 60);
    const initSeconds = timeLeft % 60;
    const [minutes, setMinutes] = useState(initMinutes);
    const [seconds, setSeconds] = useState(initSeconds);
    
    useEffect(() => {
      const myInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else {
          if (minutes === 0) {
            setTimeStyle('red');
            clearInterval(myInterval);
          } else {
            setMinutes(minutes - 1);
            if(minutes >= 3){
              setTimeStyle('yellow');
            }
            setSeconds(59);
          }
        }

        if(seconds === 0 && minutes === 0){
          setMessage([`Game Over! The answer is ${randomArray}`]);
          setInGame(true)
        }
      }, 1000);
  
      // Clean up interval on component unmount or when minutes and seconds reach 0
      return () => clearInterval(myInterval);
    }, [minutes, seconds]); // Include minutes and seconds in the dependency array
  
  
    return (
      <React.Fragment>
        <div className='guess-word-time'>
            <React.Fragment>
              <h1 className={timeStyle} >{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
            </React.Fragment>
        </div>
      </React.Fragment>
    )
  }

  const handleNumberClick = (number) => {
    const inputs = document.querySelectorAll('.input-guess-base input');
    const input = inputs[guessVal.length];
    // Check if the input element is empty
    if (input.value === '') {
      input.value = number; // Set focus on the first empty input element
      let newGuess = [...guessVal,number];
      setGuessVal(newGuess)

      if(newGuess.length === guessCount){
        handleGuessNoEvent(newGuess.toString());
      }
    }
  }

  const handleClearClick = () => {
  }

  const GuessLetter = () => { 
    return (
      <>
        <div className="buttons">
          <button onClick={() => handleNumberClick(1)}>1</button>
          <button onClick={() => handleNumberClick(2)}>2</button>
          <button onClick={() => handleNumberClick(3)}>3</button>
          <button onClick={() => handleNumberClick(4)}>4</button>
          <button onClick={() => handleNumberClick(5)}>5</button>
          <button onClick={() => handleNumberClick(6)}>6</button>
          <button onClick={() => handleNumberClick(7)}>7</button>
          <button onClick={() => handleNumberClick(8)}>8</button>
          <button onClick={() => handleNumberClick(9)}>9</button>
          <button onClick={() => handleNumberClick(0)}>0</button>
          {/* <button className='enter' onClick={handleClearClick}>ENTER</button> */}
        </div>
      </>
    )
      }

  const GameHeader = () => {
    return(
      <>
        <div className="game-title">Guess Number</div>
        <div className="game-header">
          <Timer />
          <div className="game-info">
            <div className="game-details">
              <div className="game-detail">Level: {level}</div>
              <div className="game-detail">Player: {playerName}</div>
              <div className="game-detail">Wins: {win}</div>
              <div className="game-detail">High Score: {Math.floor(highScore)}</div>
            </div>
          </div>
        </div>
        <div className="game-objective">
          <p>Guess the {guessCount}-digit number in {attempt} turns or less.</p>
          <p>{attempt-iteration} turns left.</p>
        </div>
    </>
    )
  }

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Function to toggle leaderboard visibility
  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard); // Toggle between true and false
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory); // Toggle between true and false
    
    if(showHistory === true){
      const inputs = document.querySelectorAll('.input-guess-base input');
      // Iterate through the input elements to find the first empty one
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];

        // Check if the input element is empty
        if (input.value === '') {
          input.focus(); // Set focus on the first empty input element
          break; // Exit the loop after focusing on the first empty input
        }
      }
    }
  };

  return (
    <>
      {showLeaderboard && (
        <div className="leaderboard-overlay">
          <div className="leaderboard-content">
            <button className="close-button" onClick={toggleLeaderboard}>X</button>
            <Leaderboard /> {/* Render the Leaderboard component */}
          </div>
        </div>
      )}
      {showHistory && (
        <div className="leaderboard-overlay">
          <div className="leaderboard-content">
            <button className="close-button" onClick={toggleHistory}>X</button>
            <History /> {/* Render the Leaderboard component */}
          </div>
        </div>
      )}
      
      {!start ? (
        <div className="base startgame">
        {/* Difficulty Level Select */}
        <div className="select">
          <label>Select Level:</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Username Input */}
        <div className="input">
          <label>Username:</label>
          <input
            type="text"
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="input-guess-base" ref={textBase}></div>
        <button
          className={`button show start`}
          onClick={() => {handleReset();}}
        >
          Start
        </button>
      </div>
      )
      :
      !inGame ? (
        <div className="base ingame">
          <GameHeader/>
          
          {/* Button to toggle Leaderboard pop-up */}
          <button className='button show button-history' onClick={toggleHistory}>Show History</button>

          <div className="input-guess-base" ref={textBase}>
            {new Array(guessCount).fill(null).map((_,index) => {
              return <input key={index} type="text" maxLength={1} onChange={(e) => handleInputChange(e,index)} />;
            })}
          </div>
          <br/>
          <br/>
          <br/>
          <GuessLetter/>
        </div>
      ) : (
        <div className="base endgame">
          <div className="input-guess-base" ref={textBase}></div>
          {message && message.map((d) => (
            <p>{d}</p>
          ))}
          <button className='button show button-leaderboard' onClick={toggleLeaderboard}>Leaderboard</button>
          <button className='button show button-reset' onClick={() => {handleReset();}}>Reset</button>
        </div>
        
      )}
    </>
  );
}



export default App;
