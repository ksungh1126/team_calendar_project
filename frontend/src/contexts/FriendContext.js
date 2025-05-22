import React, { createContext, useContext } from 'react';

const FriendContext = createContext({
  friends: [],
  addFriend: () => {},
  visibleFriends: [],
});

export const useFriend = () => useContext(FriendContext);

export const FriendProvider = ({ children }) => {
  return (
    <FriendContext.Provider value={{ friends: [], addFriend: () => {}, visibleFriends: [] }}>
      {children}
    </FriendContext.Provider>
  );
};
