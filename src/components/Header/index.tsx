import { HeaderContainer } from "./styles";
import logo from "../../assets/logo.svg";
import { NavLink } from "react-router-dom";
import { Scroll, Timer } from "phosphor-react";

export function Header() {
  return (
    <HeaderContainer>
      <img src={logo} alt="logo" />
      <nav>
        <NavLink to="/" title="timer">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="history">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  );
}
