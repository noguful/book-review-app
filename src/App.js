import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef(null);
  const handleClick = () => {
    const inputValue = inputRef.current.value;
    setName(inputValue);
    if (!inputValue) {
      setError(true);
    } else {
      setError(false);
    }
  }

  return (
    <div className="App">
      <div className="greeting">
        <div className="greeting-form">
          <input type="text" className="greeting-input" placeholder="名前を入力してください" ref={inputRef} />
          <button type="button" className="greeting-button" onClick={handleClick}>Greeting</button>
        </div>
        <div className="greeting-contents">
          {name && <p className="greeting-body">こんにちは！{name}さん！</p>}
          {error && <p className="greeting-error">名前が空です！</p>}
          {console.log(typeof inputValue)}
        </div>
      </div>
    </div>
  );
}

export default App;
