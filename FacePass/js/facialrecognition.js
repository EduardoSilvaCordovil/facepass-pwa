// Funções para reconhecimento facial
async function obterTodosDescritores() {
    try {
        const db = await obterConexaoIndexedDB();
        const transaction = db.transaction(['presos'], 'readonly');
        const store = transaction.objectStore('presos');

        return new Promise((resolve, reject) => {
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Erro ao obter descritores:', error);
        throw error;
    }
}

async function obterInfoPreso(id) {
    try {
        const db = await obterConexaoIndexedDB();
        const transaction = db.transaction(['presos'], 'readonly');
        const store = transaction.objectStore('presos');

        return new Promise((resolve, reject) => {
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Erro ao obter informações do preso:', error);
        throw error;
    }
}

// Função para realizar o reconhecimento facial
async function realizarReconhecimentoFacial(faceDescriptor) {
    try {
        // Obtém todos os descritores do IndexedDB
        const presos = await obterTodosDescritores();

        // Encontra a melhor correspondência
        const correspondencia = encontrarMelhorCorrespondencia(faceDescriptor, presos);

        if (correspondencia) {
            return correspondencia;
        }

        return null; // Nenhuma correspondência encontrada
    } catch (error) {
        console.error('Erro no reconhecimento facial:', error);
        return null;
    }
}

// Função para comparar descritores e encontrar a melhor correspondência
function encontrarMelhorCorrespondencia(targetDescriptor, todosPresos) {
    let melhorCorrespondencia = null;
    let menorDistancia = Infinity;
    const LIMIAR_RECONHECIMENTO = 0.6; // Ajuste conforme necessário

    for (const preso of todosPresos) {
        const distancia = calcularDistancia(targetDescriptor, preso.preso_descriptor);

        if (distancia < menorDistancia && distancia < LIMIAR_RECONHECIMENTO) {
            menorDistancia = distancia;
            melhorCorrespondencia = preso;
        }
    }

    return melhorCorrespondencia;
}

// Função otimizada para calcular distância euclidiana entre vetores
function calcularDistancia(vec1, vec2) {
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
        sum += Math.pow(vec1[i] - vec2[i], 2);
    }
    return Math.sqrt(sum);
}