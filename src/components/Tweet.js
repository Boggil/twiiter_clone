import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';

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
    <div key={tweetObj.id}>
      {
        editing ? (          
          <>
            <form onSubmit={onSubmit}>
              <input value={newTweet} placeholder="Edit your tweet" required onChange={onChange} />
              <input type="submit" value="Update Tweet" />
            </form>
            <button onClick={toggleEditing}>Cancel</button>              
          </>
        )
          :
          <>
            <h4>{tweetObj.text}</h4>
            {tweetObj.attachmentUrl && 
              <img src={tweetObj.attachmentUrl} alt="img" width="50px" height="50px"/>
            }
            {isOwner && (
              <>
                <button onClick={onDeleteClick}>Delete Tweet</button>
                <button onClick={toggleEditing}>Edit Tweet</button>
              </>
            )}
          </>
      }
    </div>
  );
};

export default Tweet;