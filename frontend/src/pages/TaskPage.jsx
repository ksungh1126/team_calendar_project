// src/pages/TaskPage.jsx
import React, { useState, useEffect } from 'react';
import { useTasks } from '../contexts/TaskContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const TaskPage = () => {
  const { tasks, setTasks } = useTasks();
  const [input, setInput] = useState('');
  const [type, setType] = useState('과제');
  const [dueDate, setDueDate] = useState(new Date());

  // 불러오기
  useEffect(() => {
    const fetchTasks = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const q = query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const taskList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            type: data.type,
            done: data.done,
            date: new Date(data.date.seconds * 1000),
          };
        });
        setTasks(taskList);
      } catch (err) {
        console.error('할 일 불러오기 실패:', err);
      }
    };
    fetchTasks();
  }, [setTasks]);

  // 추가하기
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const user = auth.currentUser;
    if (!user) return alert("로그인이 필요합니다!");

    const newTask = {
      title: input,
      type,
      done: false,
      date: dueDate,
      createdAt: new Date(),
      userId: user.uid
    };

    try {
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      setTasks([...tasks, { ...newTask, id: docRef.id }]);
      setInput('');
      setDueDate(new Date());
    } catch (err) {
      alert('저장 실패: ' + err.message);
    }
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center p-6 font-pretendard">
      <h1 className="text-4xl font-bold text-purple-500 mb-8 tracking-tight drop-shadow">📝 과제 알림이</h1>

      <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-3 mb-8 items-center w-full max-w-3xl">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border border-purple-300 rounded-md bg-white shadow-sm"
        >
          <option value="과제">과제</option>
          <option value="시험">시험</option>
          <option value="팀플">팀플</option>
        </select>
        <input
          type="text"
          placeholder="할 일을 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="p-2 w-64 border border-purple-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          className="p-2 border border-purple-300 rounded-md shadow-sm"
          dateFormat="yyyy-MM-dd"
        />
        <button
          type="submit"
          className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-md shadow-md transition"
        >
          추가
        </button>
      </form>

      <ul className="w-full max-w-xl space-y-3">
        {tasks.map(task => (
          <li
            key={task.id}
            className={`flex justify-between items-center p-4 rounded-xl shadow-md transition ${
              task.done
                ? 'bg-green-100 line-through text-gray-400'
                : 'bg-white hover:bg-purple-50'
            }`}
          >
            <span>
              [{task.type}] {task.title} - {task.date.toLocaleDateString()}
            </span>
            <button
              onClick={() => toggleDone(task.id)}
              className="text-sm text-purple-500 hover:underline"
            >
              {task.done ? '되돌리기' : '완료'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskPage;
