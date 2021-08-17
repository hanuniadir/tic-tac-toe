import React, { useState } from "react";
import Login from "../Login/Login";
import "./App.css";
import Home from "../Home/Home";

export default function App() {
  const [session, setSession] = useState("")

  const updateSession = () => {
    setSession(sessionStorage.token)
  }
  return (
    <div className="App">
      {session ? <Home updateSession={updateSession} /> : <Login updateSession={updateSession} />}
    </div>
  );
}