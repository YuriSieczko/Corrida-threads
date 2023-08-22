import { Worker, isMainThread, parentPort } from 'worker_threads';

// Verifica se o código está sendo executado na thread principal
if (isMainThread) {
  // Cria duas instâncias de threads de trabalho
  const worker1 = new Worker(__filename);
  const worker2 = new Worker(__filename);

  const maxCount = 100; // Número de voltas para a corrida
  let finishedCount = 0; // Contagem de threads de trabalho concluídas

  // Mensagem da thread de trabalho 1
  worker1.on('message', (message) => {
    console.log(`Thread 1: ${message}`);
    finishedCount++;
    
    // Se ambas as threads de trabalho terminaram, encerra a corrida
    if (finishedCount === 2) {
      console.log('A corrida terminou!');
      worker1.terminate();
      worker2.terminate();
    }
  });

  // Mensagem da thread de trabalho 2
  worker2.on('message', (message) => {
    console.log(`Thread 2: ${message}`);
    finishedCount++;

    // Se ambas as threads de trabalho terminaram, encerra a corrida
    if (finishedCount === 2) {
      console.log('A corrida terminou!');
      worker1.terminate();
      worker2.terminate();
    }
  });

  // Envia o número de voltas para as threads de trabalho
  worker1.postMessage(maxCount);
  worker2.postMessage(maxCount);
} else {
  // Código executado nas threads de trabalho

  let count = 0; // Contagem atual
  let maxCount = 0; // Número máximo de voltas

  // Mensagem enviada pela thread principal
  parentPort?.on('message', (receivedMaxCount) => {
    maxCount = receivedMaxCount;

    // Inicia um intervalo para simular contagens assíncronas
    const interval = setInterval(() => {
      count++;
      
      // Se a contagem está dentro dos limites, exibe mensagem
      if (count <= maxCount) {
        console.log(`Contagem na thread: ${count}`);
      }

      // Se a contagem atingir o limite máximo, encerra a contagem
      if (count >= maxCount) {
        clearInterval(interval);
        
        // Envia mensagem para a thread principal indicando término
        if (parentPort) {
          parentPort.postMessage('Thread terminada!');
        }

        // Encerra a thread de trabalho
        process.exit();
      }
    }, 0);
  });
}
