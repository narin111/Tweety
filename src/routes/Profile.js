import { signOut } from 'firebase/auth';
import React from 'react';
import { authService } from 'fbase';
import { useHistory, useNavigate } from 'react-router-dom';

// 로그아웃하면 home으로 돌아가도록
// v6에서는 Redirect 사용 못 함
export default () => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
