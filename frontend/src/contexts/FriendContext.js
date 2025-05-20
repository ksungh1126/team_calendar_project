// contexts/FriendContext.js
import React, { createContext, useContext, useState } from 'react';

const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);

  const addFriend = (email) => {
    if (!friends.includes(email)) {
      setFriends([...friends, email]);
    }
  };

  return (
    <FriendContext.Provider value={{ friends, addFriend }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriend = () => useContext(FriendContext);
