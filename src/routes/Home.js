import { dbService } from 'fbase';
import { getDocs, addDoc, collection, getFirestore, onSnapshot, orderBy, query, where, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Tweety from 'components/Tweety';

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);

  // 마운트되면 실행
  useEffect(() => {
    // 데이터베이스의 변화를 알게해줌
    // 수정, 삭제 등
    // dbService.collection('tweets').onSnapshot((snapshot) => {
    //   console.log('something happened');
    // });
    const q = query(collection(dbService, 'tweets'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot) => {
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArr);
    });
  }, []);
  // 트윗 작성, firestore에 전송
  const onSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(dbService, 'tweets'), {
      // tweet는 state인 tweet의 value이다.
      text: tweet,
      createdAt: Date.now(),
      // update, delete 위해서는 작성자 알아야함
      creatorId: userObj.uid,
    });
    setTweet('');
  };

  const onChange = (event) => {
    // event 안에 있는 target 안에 있는 value를 줘라
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={tweet} onChange={onChange} type="text" placeholder="tweet tweet!" maxLength={120}></input>
        <input type="submit" value="Tweet"></input>
      </form>
      <div>
        {tweets.map((tweet) => (
          // key 빼먹지 않기
          // userObj에는 현재 로그인 유저 정보 담겨있음
          // isOwner은 true, false 형태
          <Tweety key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
        ))}
      </div>
    </div>
  );
};

export default Home;
