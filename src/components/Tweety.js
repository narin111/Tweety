import { dbService } from 'fbase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';

const Tweety = ({ tweetObj, isOwner }) => {
  // edit 모드인지
  const [editing, setEditing] = useState(false);
  // text 업데이트
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure');
    if (ok) {
      // delete
      const TweetTextRef = doc(dbService, 'tweets', `${tweetObj.id}`);
      await deleteDoc(TweetTextRef);
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    const TweetTextRef = doc(dbService, 'tweets', `${tweetObj.id}`);
    await updateDoc(TweetTextRef, { text: newTweet });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input type="text" placeholder="Edit" value={newTweet} required onChange={onChange} />
            <input type="submit" value="Update Tweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {/* 글의 주인일 때만 버튼 보이게 */}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete 🗑</button>
              <button onClick={toggleEditing}>Edit 🛠</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweety;
