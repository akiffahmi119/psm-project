import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserSession } from "./store/authSlice"; 
import AppRoutes from "./Routes";
import "./styles/index.css"; 

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // On App load, check Supabase for an active session
    dispatch(loadUserSession());
  }, [dispatch]);

  return (
    <div className="App">
       <AppRoutes />
    </div>
  );
}

export default App;