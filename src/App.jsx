import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from './lib/supabaseClient';
import { setUser } from './store/authSlice';
import Routes from './Routes';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Check for an active session immediately when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch(setUser(session.user));
      }
    });

    // 2. Set up a listener for any auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setUser(session.user));
      } else {
        dispatch(setUser(null));
      }
    });

    // Cleanup the listener when the component unmounts
    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <Routes />;
};

export default App;