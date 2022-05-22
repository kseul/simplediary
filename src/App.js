import { useEffect, useRef, useState } from 'react';
import './App.css';
import DiaryList from './Diary.List';
import DiaryEditor from './DiaryEditor';
// import Lifecycle from './Lifecycle';

// https://jsonplaceholder.typicode.com/comments

function App() {
  const [data, setData] = useState([]); // 일기가 없는 상태 빈배열
  const dataId = useRef(0);
  const getData = async () => {
    const res = await fetch(
      'https://jsonplaceholder.typicode.com/comments'
    ).then((res) => res.json());
    console.log(dataId);
    const initData = res.slice(0, 20).map((it) => {
      console.log(dataId);
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++, // return이 바로됨 (dataId.current += 1)을 할 수가 없으므로 후위연산자++ 이용
      };
    });
    setData(initData);
  };
  console.log(dataId);
  useEffect(() => {
    getData();
  }, []);

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

  // 특정 일기 데이터를 수정하는 함수
  const onEdit = (targetId, newContent) => {
    console.log(targetId);
    console.log(newContent);
    setData(
      // 원본 데이터 배열에 map으로 순회, 새로운 수정된 배열 만들어서 반환
      // 수정대상이라면 객체 수정, 아니라면 그대로 it 객체
      data.map((it) =>
        it.id === targetId ? { ...it, content: newContent } : it
      )
    );
  };

  const onRemove = (targetId) => {
    const newDiaryList = data.filter((it) => it.id !== targetId);
    setData(newDiaryList);
  };

  return (
    <div className='App'>
      {/* <Lifecycle /> */}
      <DiaryEditor onCreate={onCreate} />
      <DiaryList diaryList={data} onEdit={onEdit} onRemove={onRemove} />
    </div>
  );
}

export default App;
