import express, { Application, Request, Response } from 'express';
import { AggregatorRegistry } from 'prom-client';
import cluster from 'cluster';
import * as server from './worker';

const aggregatorRegistry = new AggregatorRegistry();
const app: Application = express();
const port = 9000;

// import { cpus } from 'os';
// console.log(cpus().length);

if (!cluster.isWorker) {
    cluster.fork();
    cluster.fork();

    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
    
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
