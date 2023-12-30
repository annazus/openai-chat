import { openai } from './openai.js';
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const newMessage = async (history, message) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [...history, message],
    model: 'gpt-3.5-turbo-0301',
  });
  return chatCompletion.choices[0].message;
};

const formatMesssage = (userInput) => ({ role: 'user', content: userInput });

const chat = () => {
  let history = [
    {
      role: 'system',
      content: 'You are an AI assistant.  Answer questions or else! ',
    },
  ];
  const start = () => {
    rl.question('You:', async (userInput) => {
      if (userInput.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      const message = formatMesssage(userInput);
      const response = await newMessage(history, message);

      console.log(`\n\nAI:${response.content}`);
      history = [...history, message];
      start();
    });
  };
  start();
};

console.log('Type exit  to stop');
chat();
