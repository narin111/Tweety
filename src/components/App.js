import AppRouter from 'components/Router';
import { useState, useEffect } from 'react';
import { authService } from 'fbase';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // userObj의 시작: App.js 새로운 상태 적용시켜주면 전체변화 줄 수 있음
  const [userObj, setUserObj] = useState(null);

  // 처음시작할 때( 컴포넌트가 mount 될 때 실행: useEffect)
  // 변화를 감지해야함 js의 sdk 사용 - onAuthStateChanged
  // 유저의 상태의 변화 감지 - 로그인, 로그아웃, 계정 생성, firebase 초기화할 때
  useEffect(() => {
    const auth = getAuth();
    // 로그인했을 때 호출
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserObj({
          // userObj 간소화 - 필요한 정보만 가져오기
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) =>
            updateProfile(user, { displayName: user.displayName }),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) =>
        updateProfile(user, { displayName: user.displayName }),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        'Init'
      )}
    </>
  );
}

export default App;
