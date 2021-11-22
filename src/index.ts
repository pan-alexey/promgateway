import express, { Application, Request, Response } from 'express';
import { AggregatorRegistry } from 'prom-client';
import cluster from 'cluster';
import * as server from './worker';

const aggregatorRegistry = new AggregatorRegistry();
const app: Application = express();
const port = 9000;

const fork = (env: {[key: string]: string | number | null}) => {
    cluster.fork(env).on('exit', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fork(env);
    });
}

if (!cluster.isWorker) {
    for (let i = 0; i < 3; i++) {
        fork({ PORT: 4000 + i, WORKER: `worker_${i}`});
    }

    app.get('/metrics', async (req: Request, res: Response) => {
        try {
            const metrics = await aggregatorRegistry.clusterMetrics();
            res.set('Content-Type', aggregatorRegistry.contentType);
            res.send(metrics);
        } catch (err) {
            res.statusCode = 500;
            res.send((err as {message: string}).message);
        }
    });
    app.listen(port, () =>{
        console.log(`Server running in http://localhost:${port}`)
    });
} else {
    server.start();
}
