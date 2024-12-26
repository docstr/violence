console.log('Запуск приложения...');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

console.log('Сервер инициализирован. Проверка API-ключа...');
console.log('API Key:', process.env.OPENAI_API_KEY);

app.use(express.json());
app.use(cors());
app.post('/ask', async (req, res) => {
  const { userMessage } = req.body;

  try {
    console.log('Получен запрос от клиента:', userMessage);

    const response = await axios.post(
      "http://localhost:3000/ask",
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: 150
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('Ответ от OpenAI:', response.data);
    res.json({ message: response.data.choices[0].message.content.trim() });

  } catch (error) {
    console.error('Ошибка при запросе к OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).json({
      message: 'Ошибка при обращении к OpenAI',
      error: error.response ? error.response.data : error.message
    });
  }
});


app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
