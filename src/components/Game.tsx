import * as React from "react";
import { useEffect, useState } from "react";
import PlayerHand from "./PlayerHand";
import Button from "./Button";
export interface CardType {
  code: string;
  image: string;
  value: string;
  suit: string;
}
interface PlayerType {
  coins: number;
  cards: CardType[];
  points: number;
  broke: boolean;
}
interface PlayersType {
  [key: string]: PlayerType;
}
const Game: React.FC = () => {
  const coinsLoss = 900;
  const numberOfPlayers = 4;
  const initState = {
    players: {
      playerA: {
        coins: 5000,
        cards: [],
        points: 0,
        broke: false,
      },
      playerB: {
        coins: 5000,
        cards: [],
        points: 0,
        broke: false,
      },
      playerC: {
        coins: 5000,
        cards: [],
        points: 0,
        broke: false,
      },
      playerD: {
        coins: 5000,
        cards: [],
        points: 0,
        broke: false,
      },
    },
    validPlayers: ["playerA", "playerB", "playerC", "playerD"],
  };
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReveal, setIsReveal] = useState<boolean>(true);
  const [isDrawn, setIsDrawn] = useState<boolean>(false);
  const [deck, setDeck] = useState({
    deck_id: "",
    remaining: 0,
  });
  const [players, setPlayers] = useState<PlayersType>(initState.players);
  const [validPlayers, setValidPlayers] = useState<string[]>(
    initState.validPlayers
  );
  const fetchDeck = async () => {
    fetch("https://deckofcardsapi.com/api/deck/new/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDeck((prev) => ({
          ...prev,
          deck_id: data.deck_id,
          remaining: data.remaining,
        }));
      });
  };
  const shuffle = async () => {
    const main = async () => {
      const url = `https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setDeck((prev) => ({ ...prev, remaining: data.remaining }));
        });
    };
    setIsLoading(true);
    await main();
    setIsLoading(false);
  };
  const reset = async () => {
    setIsLoading(true);
    await fetchDeck();
    setPlayers(initState.players);
    setValidPlayers(initState.validPlayers);
    setIsLoading(false);
    setIsReveal(true);
    setIsDrawn(false);
  };
  const removeBrokePlayer = () => {
    const updatePlayers = { ...players };
    for (const name in players) {
      if (players[name].coins <= 0) {
        updatePlayers[name].broke = true;
      }
    }
    setPlayers(updatePlayers);
  };
  const drawCardsAll = async () => {
    setIsReveal(false);
    removeBrokePlayer();
    if (deck.remaining < numberOfPlayers * 3) {
      alert(
        `Not enough card remaining in deck(remaining:${deck.remaining})\nShuffle new deck.`
      );
      await shuffle();
    }
    async function main() {
      const promises: Promise<Response>[] = [];
      const playerNames: string[] = [];
      const updatePlayers = { ...players };
      if (validPlayers.length > 0) {
        validPlayers.forEach((name) => {
          const drawCardURL = `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=3`;
          promises.push(fetch(drawCardURL));
          playerNames.push(name);
        });
        const responses = await Promise.all(promises);
        const data = await Promise.all(
          responses.map((response) => response.json())
        );
        for (let i = 0; i < playerNames.length; i++) {
          updatePlayers[playerNames[i]].cards = data[i].cards;
        }
        setPlayers(updatePlayers);
        setDeck((prev) => {
          return { ...prev, remaining: data[data.length - 1].remaining };
        });
      }
    }
    setIsLoading(true);
    await main();
    setIsLoading(false);
    setIsDrawn(true);
  };
  const cardToPoint = (value: string) => {
    let point = 0;
    switch (value) {
      case "ACE":
        point = 1;
        break;
      case "JACK":
      case "QUEEN":
      case "KING":
        point = 10;
        break;
      default:
        point = Number(value);
    }
    return point;
  };
  const countPoint = (cards: CardType[]) => {
    let points = 0;
    cards.forEach((card) => {
      points += cardToPoint(card.value);
    });
    return points % 10;
  };
  const reveal = () => {
    let winner: string[] = [];
    const outOfCash: string[] = [];
    let winnerPoint = 0;
    const updatePlayers = { ...players };
    validPlayers.forEach((name) => {
      const points = countPoint(players[name].cards);
      updatePlayers[name].points = points;
      if (points > winnerPoint) {
        winner = [name];
        winnerPoint = points;
      } else if (points === winnerPoint) {
        winner.push(name);
      }
    });
    const winnerStr = winner.join(",");
    validPlayers.forEach((name) => {
      if (!winner.includes(name)) {
        updatePlayers[name].coins -= coinsLoss;
        if (updatePlayers[name].coins <= 0) {
          outOfCash.push(name);
          setValidPlayers((prev) => {
            return prev.filter((validName) => validName !== name);
          });
        }
      }
    });
    setPlayers(updatePlayers);
    setIsReveal(true);
    setIsDrawn(false);
    alert(
      `Winner:${winnerStr}${
        outOfCash.length > 0 ? `\n Out of coins: ${outOfCash.join(",")}` : ""
      }`
    );
  };
  const buildPlayer = (name: string) => {
    return (
      <PlayerHand
        name={name}
        coins={players[name].coins}
        isReveal={isReveal}
        points={players[name].points}
        cards={players[name].cards}
        broke={players[name].broke}
      />
    );
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await fetchDeck();
        setIsLoading(false);
      } catch (error) {
        console.error("Something wrong");
      }
    };
    init();
  }, []);
  return (
    <div className="App">
      <div className="table">
        {buildPlayer("playerB")}
        <div className="secondRow">
          {buildPlayer("playerC")}
          {isLoading ? <div className="loading">Loading...</div> : ""}
          {buildPlayer("playerA")}
        </div>
        {buildPlayer("playerD")}
        <div className="deckCards">{`Deck Cards: ${deck.remaining}`}</div>
        <div className="buttons">
          <Button disabled={isLoading} buttonHandler={shuffle}>
            Shuffle
          </Button>
          <Button disabled={isLoading || isDrawn} buttonHandler={drawCardsAll}>
            Draw
          </Button>
          <Button disabled={isLoading || isReveal} buttonHandler={reveal}>
            Reveal
          </Button>
          <Button disabled={isLoading} buttonHandler={reset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Game;
