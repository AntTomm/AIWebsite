"use client"
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useTheme } from 'next-themes';

export default function Home() {
  const { theme, setTheme } = useTheme();  
  const initialMessages = [
    { role: 'assistant', content: 'Hello! How can I assist you today? If you have any questions about the Headstarter fellowship or anything else, feel free to ask!' }
  ];
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    const userMessage = { role: 'user', content: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, userMessage]),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    const processText = async ({ done, value }) => {
      if (done) {
        setMessages((prevMessages) => [
          ...prevMessages,
        ]);
        return;
      }

      result += decoder.decode(value, { stream: true });

      setMessages((prevMessages) => {
        const lastMessageIndex = prevMessages.length - 1;
        const lastMessage = prevMessages[lastMessageIndex];

        if (lastMessage && lastMessage.role === 'assistant') {
          const updatedMessages = prevMessages.slice(0, lastMessageIndex);
          return [
            ...updatedMessages,
            { ...lastMessage, content: result },
          ];
        } else {
          return [
            ...prevMessages,
            { role: 'assistant', content: result },
          ];
        }
      });

      reader.read().then(processText);
    };

    reader.read().then(processText);
    setMessage('');
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      className="gradient-background"
      position="relative"
      display="flex"
      flexDirection="column"
    >
      <Box
        position="absolute"
        top="50px"
        left="20px"
        width="700px"
        padding="20px"
      >
        <Typography 
          variant="h6" 
          color="white" 
          gutterBottom
          sx={{ fontFamily: 'Segoe UI', fontSize: '48px' }}  
        >
          Hi, I'm your customer support artificial intelligence.
        </Typography>
        <Typography 
          variant="body1" 
          color="white"
          sx={{ fontFamily: 'Arial, sans-serif', fontSize: '20px' }}  
        >
          
          For Week #3 of my Headstarter AI Fellowship, I created my own unique AI using OpenAI's API. Amongst a huge amount of debugging, testing, and struggling to understand how backend works, I have created my first artificial intelligence project! The basic gist of it is to act as customer service assistance for the Headstarter website.
        </Typography>
      </Box>

      <Box
        width="100%"
        height="100%"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        paddingRight="20px"
      >
        <Stack direction={'column'} width="500px" height="700px" className="chat-container">
          <Stack direction={"column"} spacing={2} flexGrow={1} overflow="auto" maxHeight="100%">
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
              >
                <Box
                  bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                  color="white"
                  borderRadius={16}
                  p={3}
                  spacing={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Footer Section */}
      <Box
        component="footer"
        sx={{
          width: '100%',
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          py: 2,
          mt: 'auto', 
        }}
      >
        <Typography variant="body2">
          Created by Anthony Tommaso.
        </Typography>
      </Box>
    </Box>
  );
}
