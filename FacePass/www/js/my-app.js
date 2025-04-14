let myPrompt;
const pwaAlert = document.querySelector('.pwa_alert');
const btnPwa = document.querySelector('.pwa_alert_btn');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then((registration) => {
                console.log('Registration successful', registration);
            }).catch((error) => {
                console.log('Service Worker registration failed, error: ', error);
            });
    });
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    console.log('Pronto para instalar', e);
    myPrompt = e;

    pwaAlert.style.display = 'block';
});

btnPwa.addEventListener('click', () => {
    pwaAlert.style.display = 'none';
    myPrompt.prompt();
    myPrompt.userChoice.then((choiceResult => {
        if (choiceResult === 'accepted') {
            console.log('Usuário aceitou');
        } else {
            console.log('Usuário cancelou o prompt');

        }
    }))
})

document.addEventListener('deviceready', onDeviceReady.bind(this), false);

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Framework7',
    // App id
    id: 'br.com.meuapp',
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },
    // Add default routes
    routes: [
        {
            path: '/index/',
            url: 'index.html',
            on: {
                // modificar
                pageInit: function (event, page) {
                    //Chamar pagina inicial Home						
                    app.views.main.router.navigate('/login/');
                }
            }
        },

        {
            path: '/login/',
            url: 'login.html',
            on: {
                // modificar
                pageInit: function (event, page) {
                    //Chamar pagina inicial Home						
                    app.views.main.router.navigate('/login/');
                }
            }
        },

        {
            path: '/home/',
            url: 'home.html',
            on: {
                pageInit: function (event, page) {
                    //CONTEÚDO DA PÁGINA PRINCIPAL AQUI
                    app.panel.close()
                }
            }
        },

        {
            path: '/dashboard/',
            url: 'dashboard.html',
            on: {
                pageInit: function (event, page) {
                    //CONTEÚDO DA PÁGINA PRINCIPAL AQUI
                    app.panel.close()
                }
            }
        },

        {
            path: '/usuarios/',
            url: 'usuarios.html',
            on: {
                pageInit: function (event, page) {
                    //CONTEÚDO DA PÁGINA PRINCIPAL AQUI
                    app.panel.close()
                }
            }
        },

        {
            path: '/pessoas/',
            url: 'pessoas.html',
            on: {
                pageInit: function (event, page) {
                    //CONTEÚDO DA PÁGINA PRINCIPAL AQUI
                    app.panel.close()
                }
            }
        },

        {
            path: '/policiais/',
            url: 'policiais.html',
            on: {
                pageInit: function (event, page) {
                    //CONTEÚDO DA PÁGINA PRINCIPAL AQUI
                    app.panel.close()
                }
            }
        },

        {
            path: '/relatorios/',
            url: 'relatorios.html',
            on: {
                pageInit: function (event, page) {
                    //CONTEÚDO DA PÁGINA PRINCIPAL AQUI
                    app.panel.close()
                }
            }
        },

        {
            path: '/suporte/',
            url: 'suporte.html',
            on: {
                pageInit: function (event, page) {
                    //CONTEÚDO DA PÁGINA PRINCIPAL AQUI
                    app.panel.close()
                }
            }
        },

        {
            path: '/sobre/',
            url: 'sobre.html',
            on: {
                pageInit: function (event, page) {
                    //CONTEÚDO DA PÁGINA PRINCIPAL AQUI
                    app.panel.close()
                }
            }
        },

        {
            path: '/contato/',
            url: 'contato.html',
            on: {
                pageInit: function (event, page) {
                    //CONTEÚDO DA PÁGINA PRINCIPAL AQUI
                    app.panel.close()
                }
            }
        },

        {
            path: '/config/',
            url: 'config.html',
            on: {
                pageInit: function (event, page) {
                    //CONTEÚDO DA PÁGINA PRINCIPAL AQUI
                    app.panel.close()
                }
            }
        },

        {
            path: '/verificar_preso/',
            url: 'verificar_preso.html',
            on: {
                pageInit: function (event, page) {
                    //CONTEÚDO DA PÁGINA PRINCIPAL AQUI
                    app.panel.close()
                }
            }
        },

    ],
    // ... other parameters
});

// LISTAR DADOS
function listar() {
    $.ajax({
        url: "http://localhost/database/ppl.php",
        method: 'POST',
        data: $("#form").serialize(),
        dataType: "html",

        sucess: function (result) {
            $("#lista").html(result);
        }
    });
}

var $$ = Dom7;

function onDeviceReady() {

    var mainView = app.views.create('.view-main', {
        url: '/index/'
    });

    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown() {
        // variavel para pegar a rota que estamos
        var nome = app.views.main.router.url;
    }
}

// Variáveis globais
let currentFacingMode = 'environment'; // Inicia com a câmera traseira
let videoStream = null;

// Elementos do DOM
const videoElement = document.getElementById('camera');
const toggleCameraButton = document.getElementById('toggleCamera');
const capturePhotoButton = document.getElementById('capturePhoto');
const photoCanvas = document.getElementById('photoCanvas');
const capturedPhoto = document.getElementById('capturedPhoto');

document.addEventListener('DOMContentLoaded', () => {
    // Variáveis globais
    let currentFacingMode = 'environment'; // Inicia com a câmera traseira
    let videoStream = null;
  
    // Elementos do DOM
    const videoElement = document.getElementById('camera');
    const toggleCameraButton = document.getElementById('toggleCamera');
    const capturePhotoButton = document.getElementById('capturePhoto');
    const photoCanvas = document.getElementById('photoCanvas');
    const capturedPhoto = document.getElementById('capturedPhoto');
  
    // Função para iniciar a câmera
    async function startCamera(facingMode) {
      try {
        // Para o stream anterior, se existir
        if (videoStream) {
          const tracks = videoStream.getTracks();
          tracks.forEach(track => track.stop());
        }
  
        // Solicita acesso à câmera
        const constraints = {
          video: { facingMode: facingMode }
        };
  
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = videoStream;
      } catch (error) {
        console.error('Erro ao acessar a câmera:', error);
        alert('Não foi possível acessar a câmera. Verifique as permissões.');
      }
    }
  
    // Função para alternar entre as câmeras
    toggleCameraButton.addEventListener('click', () => {
      currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
      startCamera(currentFacingMode);
    });
  
    // Função para capturar a foto
    capturePhotoButton.addEventListener('click', () => {
      // Define as dimensões do canvas
      photoCanvas.width = videoElement.videoWidth;
      photoCanvas.height = videoElement.videoHeight;
  
      // Desenha o frame atual do vídeo no canvas
      const context = photoCanvas.getContext('2d');
      context.drawImage(videoElement, 0, 0, photoCanvas.width, photoCanvas.height);
  
      // Converte o canvas para uma imagem e exibe
      const imageDataUrl = photoCanvas.toDataURL('image/png');
      capturedPhoto.src = imageDataUrl;
      capturedPhoto.style.display = 'block';
  
      // Salvar a foto no IndexedDB ou enviar para o servidor, se necessário
      savePhotoToIndexedDB(imageDataUrl);
    });
  
    // Função para salvar a foto no IndexedDB
    function savePhotoToIndexedDB(photoData) {
      const dbPromise = indexedDB.open('FacePassDB', 1);
  
      dbPromise.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('photos')) {
          db.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
        }
      };
  
      dbPromise.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction('photos', 'readwrite');
        const store = transaction.objectStore('photos');
        store.add({ data: photoData, timestamp: new Date().toISOString() });
  
        transaction.oncomplete = function () {
          console.log('Foto salva no IndexedDB');
        };
      };
  
      dbPromise.onerror = function (event) {
        console.error('Erro ao acessar o IndexedDB:', event.target.error);
      };
    }
  
    // Inicializa a câmera quando a página carrega
    startCamera(currentFacingMode);
  });