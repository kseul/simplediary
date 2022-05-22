import React, { useEffect, useState } from 'react';

const UnmountTest = () => {
  useEffect(() => {
    console.log('Mount');
    return () => {
      console.log('Unmount');
    };
  }, []);

  return <div>Unmount Testing Component</div>;
};

const Lifecycle = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => setIsVisible(!isVisible);

  return (
    <div style={{ padding: 20 }}>
      <button onClick={toggle}> ON/OFF </button>
      {/* 단락회로평가를 이용, 앞의 값이 ture인지 false인지를 이용, 뒤의 컴포넌트를 렌더할지 말지 결정 */}
      {isVisible && <UnmountTest />}
    </div>
  );
};

export default Lifecycle;
