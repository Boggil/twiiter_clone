import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this tweet?');

    if (ok) {
      await dbService.doc(`tweets/${tweetObj.id}`).delete();
      await storageService.refFromURL(tweetObj.attachmentUrl).delete();
    } else {

    }
  };
  
  const toggleEditing = () => setEditing((prev) => !prev);    

  const onSubmit = async (event) => {
    event.preventDefault();
    
    await dbService.doc(`tweets/${tweetObj.id}`).update({
      text: newTweet
    });
    
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setNewTweet(value);
  };

  return (
    <div className="tweet">
      {
        editing ? (          
          <>
            <form onSubmit={onSubmit} className="container tweetEdit">
              <input
                type="text"
                placeholder="Edit your tweet"
                value={newTweet}
                required
                autoFocus
                onChange={onChange}
                className="formInput"
              />
              <input type="submit" value="Update Tweet" className="formBtn" />
            </form>
            <span onClick={toggleEditing} className="formBtn cancelBtn">
              Cancel
            </span>
          </>
        )
          :
          <>
            <h4>{tweetObj.text}</h4>
            {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} alt="img" />}
            {isOwner && (
              <div class="tweet__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            )}
          </>
      }
    </div>
  );
};

export default Tweet;