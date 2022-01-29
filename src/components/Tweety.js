import { dbService, storageService } from 'fbase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { deleteObject, ref } from '@firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Tweety = ({ tweetObj, isOwner }) => {
  // edit 모드인지
  const [editing, setEditing] = useState(false);
  // text 업데이트
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure');
    if (ok) {
      // delete
      await deleteDoc(doc(dbService, 'tweets', `${tweetObj.id}`));
      // await deleteDoc(TweetTextRef);
      await deleteObject(ref(storageService, tweetObj.attachmentUrl));
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
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="Edit"
              value={newTweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Tweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} />}
          {/* 글의 주인일 때만 버튼 보이게 */}
          {isOwner && (
            <>
              <div class="nweet__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweety;
