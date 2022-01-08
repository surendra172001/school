import React from "react";
import { signOut } from "../helper";
import { Navigate } from "react-router-dom";

export default function Signout() {
  const performRedirect = () => {
    signOut();
    return <Navigate to="/" />;
  };

  return <>{performRedirect()}</>;
}
