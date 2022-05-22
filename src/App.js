import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import './App.css';
import DiaryList from './Diary.List';
import DiaryEditor from './DiaryEditor';

// 상태변화가 일어나기 직전의 state, 어떤 상태변화를 일으켜야하는지에대한 정보가 담긴 acrion 객체
const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      return action.data;
    }
    case 'CREATE': {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    case 'REMOVE': {
      return state.filter((it) => it.id !== action.targetId);
    }
    case 'EDIT': {
      return state.map((it) =>
        it.id === action.targetId ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};

function App() {
  // const [data, setData] = useState([]); // 일기가 없는 상태 빈배열 -> APP컴포넌트 1차 렌더링

  const [data, dispatch] = useReducer(reducer, []);

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
    dispatch({ type: 'INIT', data: initData }); // action타입은 INIT, action에 필요한 데이터 initData
  };

  useEffect(() => {
    getData(); // 호출 및 24:setData로 다시 2차 렌더링
  }, []);

  // usememo는 함수가아닌 값을 반환하므로 아래에 쓰면 안된다.
  // onCreate 함수를 원본 그대로 DiaryEditor에 보내주기를 원함 (어떤값을 반환하는 것이 아님)
  // onCreate 함수가 다시 생성되지 않도록 하기를 원한다. 즉 mount되었을때 한번 만들고 그다음부터는 재사용O(함수를재생성X)
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: 'CREATE',
      data: { author, content, emotion, id: dataId.current },
    });
    dataId.current += 1;
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: 'EDIT', targetId, newContent });
  }, []);

  const onRemove = useCallback((targetId) => {
    dispatch({ type: 'REMOVE', targetId });
  }, []);

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
