import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [response, setResponse] = useState(null);

  const handleRequest = async (numberType) => {
    try {
      const response = await axios.get(http://localhost:9876/numbers/${numberType});
      setResponse(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button onClick={() => handleRequest('p')}>Fetch Prime Numbers</button>
      <button onClick={() => handleRequest('f')}>Fetch Fibonacci Numbers</button>
      <button onClick={() => handleRequest('e')}>Fetch Even Numbers</button>
      <button onClick={() => handleRequest('r')}>Fetch Random Numbers</button>

      {response && (
        <div>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
