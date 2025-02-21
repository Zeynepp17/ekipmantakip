import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role_name= localStorage.getItem("role_name");

  console.log("PrivateRoute: Kullanıcı Token =>", token);
  console.log("PrivateRoute: Kullanıcı Role ID =>", role_name);
  console.log("PrivateRoute: İzin Verilen Roller =>", allowedRoles);

  // Eğer token yoksa giriş sayfasına yönlendir
  if (!token) {
    console.log("PrivateRoute: Kullanıcı giriş yapmamış, yönlendiriliyor...");
    return <Navigate to="/" />;
  }

  // Eğer kullanıcının rolü yetkili değilse giriş sayfasına yönlendir
  if (!allowedRoles.includes(role_name)) {
    console.log("PrivateRoute: Kullanıcının yetkisi yok, yönlendiriliyor...");
    return <Navigate to="/home" />;
  }

  console.log("PrivateRoute: Kullanıcının erişimi var, sayfa gösteriliyor.");
  return children;
};

export default PrivateRoute;
