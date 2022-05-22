import React, { useContext, useEffect, useRef, useState } from 'react';
import { DiaryDispatchContext } from './App';

const DiaryEditor = () => {
  const { onCreate } = useContext(DiaryDispatchContext);

  const authorInput = useRef(); // 돔요소 접근
  const contentInput = useRef();
  const [state, setState] = useState({
    author: '',
    content: '',
    emotion: 1,
  });
  const handleChangeState = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (state.author.length < 1) {
      authorInput.current.focus(); // 현재 가리키는 요소 current
      return;
    }
    if (state.content.length < 5) {
      contentInput.current.focus(); // 현재 가리키는 요소 current
      return;
    }
    onCreate(state.author, state.content, state.emotion);
    alert('저장 성공 :)');
    setState({
      author: '',
      content: '',
      emotion: 1,
    });
  };

  return (
    <div className='DiaryEditor'>
      <h2>오늘의 일기</h2>
      <div>
        <input
          ref={authorInput}
          name='author'
          value={state.author}
          onChange={handleChangeState}
        />
      </div>
      <div>
        <textarea
          ref={contentInput}
          name='content'
          value={state.content}
          onChange={handleChangeState}
        ></textarea>
      </div>
      <div>
        <select
          name='emotion'
          value={state.emotion}
          onChange={handleChangeState}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>

      <div>
        <button onClick={handleSubmit}>일기 저장하기</button>
      </div>
    </div>
  );
};

export default React.memo(DiaryEditor);
