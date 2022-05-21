import { useRef, useState } from 'react';
import './App.css';
import DiaryList from './Diary.List';
import DiaryEditor from './DiaryEditor';

// const dummyList = [
//   {
//     id: 1,
//     author: '슬비',
//     content: '하이1',
//     emotion: 5,
//     created_date: new Date().getTime(),
//   },
//   {
//     id: 2,
//     author: '오예',
//     content: '하이2',
//     emotion: 3,
//     created_date: new Date().getTime(),
//   },
//   {
//     id: 3,
//     author: '꼬비',
//     content: '하이3',
//     emotion: 4,
//     created_date: new Date().getTime(),
//   },
// ];

function App() {
  const [data, setData] = useState([]);
  const dataId = useRef(0);

  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData([newItem, ...data]); // 원래 데이터에다가 newItem을 이어붙이는 효과 -> 반대순서면 newItem이 먼저
  };

  return (
    <div className='App'>
      <DiaryEditor onCreate={onCreate} />
      <DiaryList diaryList={data} />
    </div>
  );
}

export default App;
