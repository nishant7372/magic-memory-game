import { useEffect, useState } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";

const cardImages = [
  { src: "/img/helmet.png", matched: false },
  { src: "/img/potion.png", matched: false },
  { src: "/img/ring.png", matched: false },
  { src: "/img/shield.png", matched: false },
  { src: "/img/scroll.png", matched: false },
  { src: "/img/sword.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [minTurns, setMinTurns] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [cardOne, setCardOne] = useState(null);
  const [cardTwo, setCardTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const resetChoice = () => {
    setCardOne(null);
    setCardTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  const compare = () => {
    return cardOne.src === cardTwo.src ? true : false;
  };

  useEffect(() => {
    if (cardOne && cardTwo) {
      setDisabled(true);
      if (compare()) {
        setScore((prevScore) => prevScore + 100);
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === cardOne.src) return { ...card, matched: true };
            else return card;
          });
        });
      } else {
        setScore((prevScore) => prevScore - 50);
      }
      setTimeout(() => resetChoice(), 1000);
    }
  }, [cardOne, cardTwo]);

  useEffect(() => {
    if (score > highScore) setHighScore(() => score);
  }, [score]);

  useEffect(() => {
    if (allFlipped()) {
      if (minTurns > turns || minTurns == 0) setMinTurns(() => turns);
    }
  }, [turns]);

  const allFlipped = () => {
    let c = 0;
    cards.forEach((card) => {
      if (!card.matched) c = 1;
    });
    return c == 1 ? false : true;
  };

  const handleChoice = (card) => {
    cardOne ? setCardTwo(card) : setCardOne(card);
  };

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setTurns(0);
    setScore(0);
  };

  return (
    <div className="App">
      <h1>Magic Memory</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            card={card}
            handleChoice={handleChoice}
            key={card.id}
            flipped={card === cardOne || card === cardTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>

      {cards.length != 0 && (
        <div className="scoreCard">
          <h3>MinTurns: {minTurns}</h3>
          <h3>Turns: {turns}</h3>
          <h3>Score: {score}</h3>
          <h3>HighScore: {highScore}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
