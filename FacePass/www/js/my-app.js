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
                    app.views.main.router.navigate('/home/');
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