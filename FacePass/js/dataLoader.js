// Função para carregar os dados iniciais
async function carregarDadosIniciais() {
    try {
        // Verifica se já temos os dados armazenados localmente
        const dadosExistem = await verificarDadosExistem();

        if (dadosExistem) {
            console.log('Dados já estão armazenados localmente');
            return true;
        }

        // Mostra feedback de progresso para o usuário
        mostrarTelaCarregamento();

        // Solicita persistência de armazenamento
        await solicitarPersistencia();

        // Obtém informações sobre os chunks disponíveis
        const infoResponse = await fetch('/api/presos-data/info');
        const { totalChunks, versao } = await infoResponse.json();

        for (let i = 0; i < totalChunks; i++) {
            updateProgressBar(Math.floor((i / totalChunks) * 100),
                `Carregando chunk ${i + 1} de ${totalChunks}...`);

            const chunkResponse = await fetch(`/api/presos-data/chunk/${i}`);

            if (!chunkResponse.ok) {
                throw new Error(`Falha ao carregar chunk ${i}: ${chunkResponse.status}`);
            }

            const chunk = await chunkResponse.json();

            // Armazena o chunk no IndexedDB
            await armazenarChunkIndexedDB(chunk);
        }

        // Armazena a versão atual dos dados
        await armazenarVersaoLocal(versao);

        finalizarTelaCarregamento();
        return true;
    } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        mostrarErroCarregamento(error.message);
        return false;
    }
}

// Função para armazenar um chunk no IndexedDB
async function armazenarChunkIndexedDB(chunk) {
    const db = await obterConexaoIndexedDB();
    const transaction = db.transaction(['presos'], 'readwrite');
    const store = transaction.objectStore('presos');

    return Promise.all(chunk.map(preso => {
        return new Promise((resolve, reject) => {
            const request = store.put(preso);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }));
}

// Solicitar persistência de armazenamento
async function solicitarPersistencia() {
    if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log(`Persistência de armazenamento ${isPersisted ? 'concedida' : 'negada'}`);
        return isPersisted;
    }
    return false;
}

// Verificar espaço disponível
async function verificarEspacoDisponivel() {
    if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        console.log(`Espaço usado: ${Math.round(estimate.usage / (1024 * 1024))}MB`);
        console.log(`Espaço total: ${Math.round(estimate.quota / (1024 * 1024))}MB`);
        return estimate;
    }
    return null;
}