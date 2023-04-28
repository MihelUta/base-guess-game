import React, { useState } from 'react';

function App() {
  const [iteration, setIteration] = useState(0);
  const [randomArray, setRandomArray] = useState([]);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');

  const generateRandomArray = (length) => {
    const arr = Array.from({ length }, (_, i) => i + 1); // membuat array dengan nilai 1-5
    let currentIndex = length;
    let randomIndex;

    // mengacak elemen array dengan algoritma Fisher-Yates
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // menukar nilai elemen array
      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }

    return arr;
  };

  const handleGuess = (event) => {
    event.preventDefault();
    if (guess.split('').toString() === randomArray.toString()) {
      setMessage(`Congratulation! You Win!`);
    } else if (iteration === 10) {
      setMessage(`Game Over! The answer is ${randomArray}`);
    } else {
      let rightPosition = 0;
      let rightValue = 0;

      for (let i = 0; i < randomArray.length; i++) {
        if (randomArray[i] == guess[i]) {
          rightPosition++;
        }

        for (let j = 0; j < guess.length; j++) {
          if (randomArray[i] == guess[j]) {
            rightValue++;
          }
        }
      }

      setMessage(`Right Position: ${rightPosition}, Right Value: ${rightValue}`);
      setGuess('');
      setIteration(iteration + 1);
    }
  };

  const handleReset = () => {
    setRandomArray(generateRandomArray(3));
    setGuess('');
    setMessage('');
    setIteration(0);
  };

  return (
    <div className="container">
      <h1>Guess the Number</h1>
      <p>Guess the 3-digit number in 10 turns or less.</p>
      <form onSubmit={handleGuess}>
        <input
          type="text"
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
          placeholder="Enter your guess"
          maxLength="3"
          pattern="\d{3}"
          required
        />
        <button type="submit">Guess</button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
