// testing out workers
import { Worker, isMainThread, parentPort }  from 'worker_threads'; //using this syntax because outside of module?

if(isMainThread) {
    const worker = new Worker("./hello.js");
    worker.once('message', (message) => {
        console.log(message); // print "Worker thread: Hello!"
    });
    worker.postMessage('Main thread says Hi!')
} else {
    parentPort.once('message', (message) => {
        console.log(message); // sprint main threads Hi
        parentPort.postMessage("Worker thread says Hi")
    });
}
