import express, { Request, Response } from 'express';
import morgan from 'morgan';

const app = express();
const PORT = process.env.NODE_PORT || 3001;

// setup request logging middleware
app.use(morgan('short'));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('hello world!');
});

app.listen(PORT, () => {
  console.log(`🚀 express server running at port ${PORT}`);
});
