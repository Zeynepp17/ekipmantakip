import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Ana Sayfa</Link></li>
        <li><Link to="/users">Kullanıcılar</Link></li>
        <li><Link to="/users/create">Yeni Kullanıcı Ekle</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
