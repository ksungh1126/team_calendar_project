// FriendContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const FriendContext = createContext();

export const useFriend = () => useContext(FriendContext);

export const FriendProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const teamId = localStorage.getItem('teamId') || 'testTeam';

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`/api/teams/${teamId}/members`);
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.error('팀원 목록 불러오기 실패:', err);
      }
    };

    fetchMembers();
  }, []);

  const addFriend = async (email) => {
    try {
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`친구 추가 실패: ${err.message || '오류 발생'}`);
        return;
      }

      const newMember = await res.json();
      setFriends((prev) => [...prev, newMember]);
    } catch (err) {
      console.error('친구 추가 실패:', err);
    }
  };

  return (
    <FriendContext.Provider value={{ friends, addFriend }}>
      {children}
    </FriendContext.Provider>
  );
};
