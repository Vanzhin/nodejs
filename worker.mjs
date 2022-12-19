import {workerData, parentPort} from 'worker_threads';

parentPort.postMessage(`your workerData = ${workerData}`)