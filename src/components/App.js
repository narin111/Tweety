import AppRouter from 'components/Router';
import { useState, useEffect } from 'react';
import { authService } from 'fbase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  // 처음시작할 때( 컴포넌트가 mount 될 때 실행: useEffect)
  // 변화를 감지해야함 js의 sdk 사용 - onAuthStateChanged
  // 유저의 상태의 변화 감지 - 로그인, 로그아웃, 계정 생성, firebase 초기화할 때
  useEffect(() => {
    const auth = getAuth();
    // 로그인했을 때 호출
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        // 로그인한 유저 정보 저장
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return <>{init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : 'Init'}</>;
}

export default App;
