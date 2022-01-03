import React, { useState } from 'react';
import AppRouter from 'components/Router';
import { auth } from 'fbase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // props 전달
  return <AppRouter isLoggedIn={isLoggedIn} />;
}

export default App;
