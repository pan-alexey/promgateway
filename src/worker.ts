import express, { Request, Response } from 'express';
import cluster from 'cluster';
import { Counter, register } from 'prom-client';

export function start(): void {

  const counter = new Counter({
    name: 'test_counter',
    help: 'Example of a counter',
    labelNames: ['code'],
  });

  const app = express();

  app.get('/', (req: Request, res: Response): void => {
    counter.inc({ code: `worker_${cluster.worker?.id}` });
    res.end('Done!');
  });

  app.get('/metrics', async (req: Request, res: Response) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.getSingleMetricAsString('test_counter'));
  });

  app.listen(4000, () => {
    console.log(`Server started with worker ${process.pid}`);
  });
}