import * as React from "react";
import Card from "./Card";
import "../assets/css/playerHand.css";
import { CardType } from "./Game";
interface PlayerHandProps {
  name: string;
  coins: number;
  points: number;
  cards: CardType[];
  isReveal: boolean;
  broke: boolean;
}
const PlayerHand: React.FC<PlayerHandProps> = ({
  name,
  coins,
  points,
  cards,
  isReveal,
  broke,
}) => {
  return (
    <div className="playerHand">
      <p>{name}</p>
      <p>{`Coins:${coins}`}</p>
      {!broke && cards ? (
        <div className="card-wrapper">
          {cards.map((card, index) => (
            <Card key={index} isReveal={isReveal} cardImg={card.image} />
          ))}
        </div>
      ) : (
        ""
      )}
      <p>{!broke ? `Points:${points}` : ""}</p>
    </div>
  );
};
export default PlayerHand;
