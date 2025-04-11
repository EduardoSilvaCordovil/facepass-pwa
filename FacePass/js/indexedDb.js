(function () {
    // IndexedDB
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
        IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
        dbVersion = 1.0;

    // Create/open database
    var request = indexedDB.open("elephantFiles", dbVersion),
        db,
        createObjectStore = function (dataBase) {
            // Create an objectStore
            console.log("Creating objectStore")
            dataBase.createObjectStore("elephants");
        },

        getImageFile = function () {
            // Create XHR
            var xhr = new XMLHttpRequest(),
                blob;

            xhr.open("GET", "elephant.png", true);
            // Set the responseType to blob
            xhr.responseType = "blob";

            xhr.addEventListener("load", function () {
                if (xhr.status === 200) {
                    console.log("Image retrieved");

                    // Blob as response
                    blob = xhr.response;
                    console.log("Blob:" + blob);

                    // Put the received blob into IndexedDB
                    putElephantInDb(blob);
                }
            }, false);
            // Send XHR
            xhr.send();
        },

        putElephantInDb = function (blob) {
            console.log("Putting elephants in IndexedDB");

            // Open a transaction to the database
            var transaction = db.transaction(["elephants"], IDBTransaction.READ_WRITE);

            // Put the blob into the dabase
            var put = transaction.objectStore("elephants").put(blob, "image");

            // Retrieve the file that was just stored
            transaction.objectStore("elephants").get("image").onsuccess = function (event) {
                var imgFile = event.target.result;
                console.log("Got elephant!" + imgFile);

                // Get window.URL object
                var URL = window.URL || window.webkitURL;

                // Create and revoke ObjectURL
                var imgURL = URL.createObjectURL(imgFile);

                // Set img src to ObjectURL
                var imgElephant = document.getElementById("elephant");
                imgElephant.setAttribute("src", imgURL);

                // Revoking ObjectURL
                URL.revokeObjectURL(imgURL);
            };
        };

    request.onerror = function (event) {
        console.log("Error creating/accessing IndexedDB database");
    };

    request.onsuccess = function (event) {
        console.log("Success creating/accessing IndexedDB database");
        db = request.result;

        db.onerror = function (event) {
            console.log("Error creating/accessing IndexedDB database");
        };

        // Interim solution for Google Chrome to create an objectStore. Will be deprecated
        if (db.setVersion) {
            if (db.version != dbVersion) {
                var setVersion = db.setVersion(dbVersion);
                setVersion.onsuccess = function () {
                    createObjectStore(db);
                    getImageFile();
                };
            }
            else {
                getImageFile();
            }
        }
        else {
            getImageFile();
        }
    }

    // For future use. Currently only in latest Firefox versions
    request.onupgradeneeded = function (event) {
        createObjectStore(event.target.result);
    };
})();

/*// Configuração do IndexedDB
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
} */