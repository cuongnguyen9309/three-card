import * as React from "react";
import { useState } from "react";
import "../assets/css/card.css";
interface cardProps {
  isReveal: boolean;
  cardImg: string;
}
const Card: React.FC<cardProps> = ({ isReveal, cardImg }) => {
  return (
    <div className="card">
      <img
        src={
          isReveal ? cardImg : "https://deckofcardsapi.com/static/img/back.png"
        }
        alt=""
      />
    </div>
  );
};
export default Card;
