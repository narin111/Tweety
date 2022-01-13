import { dbService, storageService } from 'fbase';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react';
import Tweety from 'components/Tweety';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString } from '@firebase/storage';

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState('');

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
    let attachmentUrl = '';
    if (attachment !== '') {
      //파일 경로 참조 만들기
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      //storage 참조 경로로 파일 업로드 하기
      const uploadFile = await uploadString(fileRef, attachment, 'data_url');
      console.log(uploadFile);
      //storage에 있는 파일 URL로 다운로드 받기
      attachmentUrl = await ref.getDownloadURL(uploadFile.ref);
    }
    const tweetObj = {
      // uuid는 어떤 특별한 식별자를 랜덤으로 생성해줌
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await addDoc(collection(dbService, 'tweets'), tweetObj);
    setTweet('');
    setAttachment('');
  };
  // clear 후에도 파일이름 남아있음
  const fileInput = useRef();
  const onChange = (event) => {
    // event 안에 있는 target 안에 있는 value를 줘라
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  const onFileChange = (event) => {
    // console.log(event);
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    // 첫번째 파일받아 reader를 만들어서 event listender추가
    // 파일 로딩이 끝나면 finishedEvent가진다.
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      // state로 가짐
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    setAttachment(null);
    fileInput.current.value = null;
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={tweet} onChange={onChange} type="text" placeholder="tweet tweet!" maxLength={120}></input>
        {/* 사진 올리기 */}
        <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
        <input type="submit" value="Tweet" />

        {/* 미리보기사진(있다면) */}
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
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
