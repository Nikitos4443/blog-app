const express = require('express');
const app = express();
const userRouter = require('./routing/userRoutes');
const postRouter = require('./routing/postRoutes');
const commentRouter = require('./routing/commentRoutes');
const likeRouter = require('./routing/likeRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    exposedHeaders: ['Authorization'], 
    credentials: true
}));

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/likes', likeRouter);
app.use('/comments', commentRouter);

app.listen(3000, "localhost", () => {
    console.log('Server is working on url localhost:3000');
})