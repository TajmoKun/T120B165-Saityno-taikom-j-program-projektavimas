const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
const subforumRoutes = require('./routes/subforums');
const postRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const messagesRoutes = require('./routes/messages');
const userControlRoutes = require('./routes/users');

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/subforums',subforumRoutes);
app.use('/api/subforums/:subforumId/posts',postRoutes);
app.use('/api/subforums/:subforumId/:postId/comments',commentsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/userControl', userControlRoutes);

app.get('/health',(req,res)=>{
  res.json({status: 'ok', timestamp: new Date()});
});

app.get('/',(req,res)=>{
  res.send("Hello World");
});

app.listen(PORT,()=>{
  console.log(`Server runnin on Port ${PORT}`);
});