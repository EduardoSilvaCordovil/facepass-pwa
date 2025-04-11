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
});

// Inicializa a câmera quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    startCamera(currentFacingMode);
});

/*// Elementos do DOM
const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('canvasElement');
const capturedImage = document.getElementById('capturedImage');
const captureButton = document.getElementById('captureButton');
const switchCameraButton = document.getElementById('switchCamera');

// Variáveis de estado
let currentStream = null;
let facingMode = "environment"; // Padrão: câmera traseira ("environment")

// Função para iniciar a câmera
async function startCamera() {
    // Parar o stream atual, se existir
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    
    const constraints = {
        video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
        },
        audio: false
    };
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
        currentStream = stream;
    } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
        alert("Não foi possível acessar a câmera. Por favor, verifique as permissões.");
    }
}

// Função para capturar foto
function capturePhoto() {
    if (!currentStream) return;
    
    // Ajustar o canvas para o tamanho do vídeo
    const videoSettings = currentStream.getVideoTracks()[0].getSettings();
    canvasElement.width = videoSettings.width;
    canvasElement.height = videoSettings.height;
    
    // Desenhar o frame atual do vídeo no canvas
    const context = canvasElement.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    // Converter canvas para imagem e exibir
    capturedImage.src = canvasElement.toDataURL('image/jpeg');
    capturedImage.style.display = 'block';
    
    // Aqui você pode adicionar código para salvar a foto ou processá-la
    // Por exemplo: savePhoto(canvasElement.toDataURL('image/jpeg'));
}

// Função para trocar entre câmeras
function switchCamera() {
    facingMode = facingMode === "user" ? "environment" : "user";
    startCamera();
}

// Event Listeners
captureButton.addEventListener('click', capturePhoto);
switchCameraButton.addEventListener('click', switchCamera);

// Iniciar a câmera quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    startCamera();
});

// Opcional: Verificar se a API MediaDevices é suportada
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('A API de câmera não é suportada neste navegador.');
}
*/