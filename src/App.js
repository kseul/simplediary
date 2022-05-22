import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import DiaryList from './Diary.List';
import DiaryEditor from './DiaryEditor';
import OptimizeTest from './OptimizeTest';

function App() {
  const [data, setData] = useState([]); // 일기가 없는 상태 빈배열
  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      'https://jsonplaceholder.typicode.com/comments'
    ).then((res) => res.json());

    const initData = res.slice(0, 20).map((it) => {
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

  const getDiaryAnalysis = useMemo(() => {
    // useMemo 함수연산최적화 / useMemo를 사용하면 값을 반환받음 -> 함수로 사용하지 않도록 주의
    // 두번 찍히는 이유: 초기 data 빈배열 상태일때 한번 호출, getData API의 성공으로 data가 바뀌면서 재호출
    // console.log('일기 분석 시작');

    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <div className='App'>
      <OptimizeTest />
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio} %</div>

      <DiaryList diaryList={data} onEdit={onEdit} onRemove={onRemove} />
    </div>
  );
}

export default App;
