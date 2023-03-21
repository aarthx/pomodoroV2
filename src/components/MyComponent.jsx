import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => {
        if (seconds === 1) {
          setCount((count) => count + 1);
          return 60;
        }
        return seconds - 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Seconds: {seconds}</p>
    </div>
  );
}

export default MyComponent;
