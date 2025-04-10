// Configuração do IndexedDB
function configurarIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ReconhecimentoFacialDB', 1);

        request.onerror = event => {
            reject('Não foi possível abrir o banco de dados: ' + event.target.errorCode);
        };

        request.onupgradeneeded = event => {
            const db = event.target.result;

            // Configura para armazenar grandes volumes de dados
            const objectStore = db.createObjectStore('presos', { keyPath: 'ID_preso' });
            objectStore.createIndex('preso_nome', 'preso_nome', { unique: false });

            // Store separado para metadados do sistema
            const metaStore = db.createObjectStore('metadados', { keyPath: 'id' });
        };

        request.onsuccess = event => {
            resolve(event.target.result);
        };
    });
}

// Obter conexão com o IndexedDB
function obterConexaoIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ReconhecimentoFacialDB', 1);

        request.onerror = event => {
            reject('Erro ao conectar ao banco de dados: ' + event.target.errorCode);
        };

        request.onsuccess = event => {
            resolve(event.target.result);
        };
    });
}

// Verificar se dados já existem
async function verificarDadosExistem() {
    try {
        const db = await obterConexaoIndexedDB();
        const transaction = db.transaction(['presos'], 'readonly');
        const store = transaction.objectStore('presos');

        const countRequest = store.count();

        return new Promise((resolve, reject) => {
            countRequest.onsuccess = () => {
                resolve(countRequest.result > 0);
            };

            countRequest.onerror = () => {
                reject(countRequest.error);
            };
        });
    } catch (error) {
        console.error('Erro ao verificar dados:', error);
        return false;
    }
}

// Limpar banco de dados
async function limparBancoDados() {
    const db = await obterConexaoIndexedDB();
    const transaction = db.transaction(['presos'], 'readwrite');
    const store = transaction.objectStore('presos');

    return new Promise((resolve, reject) => {
        const request = store.clear();

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

// Armazenar versão dos dados
async function armazenarVersaoLocal(versao) {
    const db = await obterConexaoIndexedDB();
    const transaction = db.transaction(['metadados'], 'readwrite');
    const store = transaction.objectStore('metadados');

    return new Promise((resolve, reject) => {
        const request = store.put({
            id: 'versao',
            valor: versao,
            timestamp: new Date().getTime()
        });

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

// Obter versão local dos dados
async function obterVersaoLocal() {
    try {
        const db = await obterConexaoIndexedDB();
        const transaction = db.transaction(['metadados'], 'readonly');
        const store = transaction.objectStore('metadados');

        return new Promise((resolve, reject) => {
            const request = store.get('versao');

            request.onsuccess = () => {
                if (request.result) {
                    resolve(request.result.valor);
                } else {
                    resolve(0); // Sem versão, retorna 0
                }
            };

            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Erro ao obter versão local:', error);
        return 0;
    }
}