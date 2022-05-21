import './App.css';
import DiaryList from './Diary.List';
import DiaryEditor from './DiaryEditor';

const dummyList = [
  {
    id: 1,
    author: '슬비',
    content: '하이1',
    emotion: 5,
    created_date: new Date().getTime(),
  },
  {
    id: 2,
    author: '오예',
    content: '하이2',
    emotion: 3,
    created_date: new Date().getTime(),
  },
  {
    id: 3,
    author: '꼬비',
    content: '하이3',
    emotion: 4,
    created_date: new Date().getTime(),
  },
];

function App() {
  return (
    <div className='App'>
      <DiaryEditor />
      <DiaryList diaryList={dummyList} />
    </div>
  );
}

export default App;
