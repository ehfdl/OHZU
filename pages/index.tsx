import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { authService } from "@/firebase";
import LandingPage from "@/components/landing/landing_page";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // Firebase 연결되면 화면 표시
      // user === authService.currentUser 와 같은 값
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return (
    <>
      <LandingPage />
    </>
  );
};

export default Home;
