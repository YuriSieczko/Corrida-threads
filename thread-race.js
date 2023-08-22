"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var worker_threads_1 = require("worker_threads");
// Verifica se o código está sendo executado na thread principal
if (worker_threads_1.isMainThread) {
    // Cria duas instâncias de threads de trabalho
    var worker1_1 = new worker_threads_1.Worker(__filename);
    var worker2_1 = new worker_threads_1.Worker(__filename);
    var maxCount = 100; // Número de voltas para a corrida
    var finishedCount_1 = 0; // Contagem de threads de trabalho concluídas
    // Mensagem da thread de trabalho 1
    worker1_1.on('message', function (message) {
        console.log("Thread 1: ".concat(message));
        finishedCount_1++;
        // Se ambas as threads de trabalho terminaram, encerra a corrida
        if (finishedCount_1 === 2) {
            console.log('A corrida terminou!');
            worker1_1.terminate();
            worker2_1.terminate();
        }
    });
    // Mensagem da thread de trabalho 2
    worker2_1.on('message', function (message) {
        console.log("Thread 2: ".concat(message));
        finishedCount_1++;
        // Se ambas as threads de trabalho terminaram, encerra a corrida
        if (finishedCount_1 === 2) {
            console.log('A corrida terminou!');
            worker1_1.terminate();
            worker2_1.terminate();
        }
    });
    // Envia o número de voltas para as threads de trabalho
    worker1_1.postMessage(maxCount);
    worker2_1.postMessage(maxCount);
}
else {
    // Código executado nas threads de trabalho
    var count_1 = 0; // Contagem atual
    var maxCount_1 = 0; // Número máximo de voltas
    // Mensagem enviada pela thread principal
    worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', function (receivedMaxCount) {
        maxCount_1 = receivedMaxCount;
        // Inicia um intervalo para simular contagens assíncronas
        var interval = setInterval(function () {
            count_1++;
            // Se a contagem está dentro dos limites, exibe mensagem
            if (count_1 <= maxCount_1) {
                console.log("Contagem na thread: ".concat(count_1));
            }
            // Se a contagem atingir o limite máximo, encerra a contagem
            if (count_1 >= maxCount_1) {
                clearInterval(interval);
                // Envia mensagem para a thread principal indicando término
                if (worker_threads_1.parentPort) {
                    worker_threads_1.parentPort.postMessage('Thread terminada!');
                }
                // Encerra a thread de trabalho
                process.exit();
            }
        }, 0);
    });
}
