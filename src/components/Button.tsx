import * as React from "react";
import "../assets/css/button.css";
interface ButtonProps {
  children: React.ReactNode;
  buttonHandler: React.MouseEventHandler<HTMLElement>;
  disabled: boolean;
}
const Button: React.FC<ButtonProps> = ({
  children,
  buttonHandler,
  disabled,
}) => {
  return (
    <button disabled={disabled} className="button" onClick={buttonHandler}>
      {children}
    </button>
  );
};
export default Button;
