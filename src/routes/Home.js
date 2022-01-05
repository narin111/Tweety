import { dbService } from 'fbase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

const Home = () => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const getTweets = async () => {
    const dbTweets = await getDocs(collection(dbService, 'tweets'));
    dbTweets.forEach((document) => {
      // set이 붙은 함수르 쓸 때 값 대신에 함수 전달 가능
      // 함수를 전달하면 리액트는 이전 값에 접근할 수 있다
      // 배열 리턴 - 첫번째 요소는 가장 최근 document...
      // setTweets((prev) => [document.data(), ...prev]);
      const tweetObject = {
        // spread attribute: document.data()를 가져와서 풀어냄
        ...document.data(),
        id: document.id,
      };
      setTweets((prev) => [tweetObject, ...prev]);
    });
  };
  // 마운트되면 실행
  useEffect(() => {
    getTweets();
  }, []);
  // 트윗 작성, firestore에 전송
  const onSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(dbService, 'tweets'), {
      tweet,
      createdAt: serverTimestamp(),
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
          <div key={tweet.id}>
            <h4>{tweet.tweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
