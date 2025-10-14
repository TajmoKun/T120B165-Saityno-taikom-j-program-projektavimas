const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
const subforumRoutes = require('./routes/subforums');
const postRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/subforums',subforumRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/comments',commentsRoutes);

app.get('/',(req,res)=>{
  res.send("Hello World");
});

app.listen(PORT,()=>{
  console.log(`Server runnin on Port ${PORT}`);
});