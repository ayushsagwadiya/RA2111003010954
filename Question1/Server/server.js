const express = require('express');
const axios = require('axios');
const { performance } = require('perf_hooks');

const app = express();
const PORT = 9876;
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzEyMTUzNDMzLCJpYXQiOjE3MTIxNTMxMzMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImM4Mjg5ZWJiLTc0YmMtNGU5NS05YjNhLTE1NzA5NTc3YmYyYiIsInN1YiI6ImFtNTAyN0Bzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiQmhhcmF0IE1lZGljYWwiLCJjbGllbnRJRCI6ImM4Mjg5ZWJiLTc0YmMtNGU5NS05YjNhLTE1NzA5NTc3YmYyYiIsImNsaWVudFNlY3JldCI6Ikd6SmJpbGVYR0tGcU9UVFkiLCJvd25lck5hbWUiOiJBeXVzaCBTYWd3YWRpeWEiLCJvd25lckVtYWlsIjoiYW01MDI3QHNybWlzdC5lZHUuaW4iLCJyb2xsTm8iOiJSQTIxMTEwMDMwMTA5NTQifQ.1BsLABa7Jemv3f5iLKXdb7lYycWRboZQxqM5II10GaM";

const WINDOW_SIZE = 10;
let window = [];

const numberTypeUrls = {
  'p': 'http://20.244.56.144/test/primes',
  'f': 'http://20.244.56.144/test/fibonacci',
  'e': 'http://20.244.56.144/test/even',
  'r': 'http://20.244.56.144/test/random'
};

const fetchNumbers = async (numberType) => {
  try {
    const response = await axios.get(numberTypeUrls[numberType], {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data.numbers || [];
  } catch (error) {
    console.error("Error fetching numbers:", error);
    return [];
  }
};

const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return numbers.length > 0 ? sum / numbers.length : 0;
};

const updateWindow = (numbers) => {
  window.push(...numbers);
  while (window.length > WINDOW_SIZE) {
    window.shift();
  }
};

app.get('/numbers/:numberid', async (req, res) => {
  const start = performance.now();

  const { numberid } = req.params;
  const numbers = await fetchNumbers(numberid);
  updateWindow(numbers);
  const average = calculateAverage(window);

  const end = performance.now();
  const responseTime = end - start;

  if (responseTime > 500) {
    console.warn("Warning: Response time exceeded 500ms");
  }

  res.json({
    windowPrevState: window.slice(0, WINDOW_SIZE),
    windowCurrState: window.slice(0, WINDOW_SIZE),
    numbers,
    avg: average.toFixed(2)
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
