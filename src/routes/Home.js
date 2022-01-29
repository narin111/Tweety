import { dbService } from 'fbase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Tweety from 'components/Tweety';
import TweetFactory from 'components/TweetFactory';
import '../styles.css';

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);

  // 마운트되면 실행
  useEffect(() => {
    // 데이터베이스의 변화를 알게해줌
    // 수정, 삭제 등
    // dbService.collection('tweets').onSnapshot((snapshot) => {
    //   console.log('something happened');
    // });
    const q = query(
      collection(dbService, 'tweets'),
      orderBy('createdAt', 'desc')
    );
    onSnapshot(q, (snapshot) => {
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArr);
    });
  }, []);
  // 트윗 작성, firestore에 전송

  return (
    <div className="container">
      <TweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {tweets.map((tweet) => (
          // key 빼먹지 않기
          // userObj에는 현재 로그인 유저 정보 담겨있음
          // isOwner은 true, false 형태
          <Tweety
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
