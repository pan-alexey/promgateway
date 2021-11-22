import express, { Request, Response } from 'express';
import { Counter, register } from 'prom-client';

export function start(): void {
  const PORT = process.env.PORT;
  const WORKER = process.env.WORKER;

  const counter = new Counter({
    name: 'test_counter',
    help: 'Example of a counter',
    labelNames: ['worker'],
  });

  const app = express();

  app.get('/', (req: Request, res: Response): void => {
    counter.inc({ worker: WORKER });
    res.end('Done!');
  });

  app.get('/metrics', async (req: Request, res: Response) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.getSingleMetricAsString('test_counter'));
  });

  app.listen(PORT, () => {
    console.log(`PROCESS: [${process.pid}]. Server started with worker: http://localhost:${PORT} `);
  });
}