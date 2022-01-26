const app = {

    apiRootUrl: 'http://localhost:8080',

    init: function()
    {
        console.log('app.init()');

        // On appelle la méthode s'occupant d'ajouter les EventListener sur les éléments déjà dans le DOM
        app.addAllEventListeners();

        // On appelle la méthode s'occupant de charger tous les jeux vidéo
        app.loadVideoGames();
    },

    addAllEventListeners: function()
    {
        // On récupère l'élément <select> des jeux vidéo
        let selectVideogame = document.getElementById("videogameId");

        // On ajoute l'écouteur pour l'event "change", et on l'attache à la méthode app.handleVideogameSelected
        selectVideogame.addEventListener("change", app.handleVideogameSelected);

        // On récupère le bouton pour ajouter un jeu vidéo
        const addVideogameButtonElement = document.getElementById('btnAddVideogame');

        // On ajoute l'écouteur pour l'event "click"
        addVideogameButtonElement.addEventListener('click', app.handleClickToAddVideogame);

        // on récupère le formulaire d'ajout de jeu
        const addVideogameFormElement = document.getElementById('addVideogameForm');

        // on pose un capteur sur le formulaire
        addVideogameFormElement.addEventListener("submit", app.handleFormSubmit);
    },

    handleVideogameSelected: function(evt)
    {
        // Récupérer la valeur du <select> (id du videogame)
        let videogameId = evt.currentTarget.value;

        // on récupère les données du jeu auprès de l'API
        let fetchOptions = {
            methode:'GET',
            mode:   'cors',
            cache:  'no-cache'
        };

        // on lance notre requête pour récupérer les reviews du jeu sélectionné et on stocke la réponse dans un array
        fetch(app.apiRootUrl + '/videogames/' + videogameId + '/reviews', fetchOptions)
            .then(response => response.json())
            .then(data => {

                    // Vider le contenu de div#review
                    document.getElementById('review').textContent = "";

                    // on crée une template pour chaque review du jeu
                    for (let review of data) {
                        // charger les données pour ce videogame
                        // Dupliquer la template #reviewTemplate et personnaliser son contenu avec les données
                        let reviewTemplate = document.getElementById('reviewTemplate').content.cloneNode(true);

                        reviewTemplate.querySelector('.reviewTitle').textContent        = review.title;
                        reviewTemplate.querySelector('.reviewText').textContent         = review.text;
                        reviewTemplate.querySelector('.reviewAuthor').textContent       = review.author;
                        reviewTemplate.querySelector('.reviewPublication').textContent  = review.publication_date;
                        reviewTemplate.querySelector('.reviewDisplay').textContent      = review.display_note;
                        reviewTemplate.querySelector('.reviewGameplay').textContent     = review.gameplay_note;
                        reviewTemplate.querySelector('.reviewGameplay').textContent     = review.gameplay_note;
                        reviewTemplate.querySelector('.reviewScenario').textContent     = review.scenario_note;
                        reviewTemplate.querySelector('.reviewLifetime').textContent     = review.lifetime_note;
                        reviewTemplate.querySelector('.reviewVideogame').textContent    = review.videogame.name;
                        reviewTemplate.querySelector('.reviewEditor').textContent       = review.videogame.editor;
                        reviewTemplate.querySelector('.reviewPlatform').textContent     = review.platform.name;
    
                        // Ajouter dans le DOM
                        document.getElementById('review').appendChild(reviewTemplate);
                    }             
                });
    },        

    handleClickToAddVideogame: function(evt)
    {
        // https://getbootstrap.com/docs/4.4/components/modal/#modalshow
        // jQuery obligatoire ici
        $('#addVideogameModal').modal('show');
    },

    loadVideoGames: function()
    {
        // Charger toutes les données des videogames
        let fetchOptions = {
            methode:'GET',
            mode:   'cors',
            cache:  'no-cache'
        };

        fetch(app.apiRootUrl + '/videogames', fetchOptions)
            .then(response => response.json())
            .then(videogamesList => {

                // on récupère le select
                let select = document.getElementById('videogameId');

                // pour chaxun des jeux de la liste :
                for (let videogame of videogamesList)
                {
                    // on crée notre option avec la méthode createOptionElement
                    let optionElement = app.createOptionElement(videogame);

                    // on insère l'élément dans le DOM comme option du select
                    select.appendChild(optionElement);                    
                }
            }
        );
    },

    handleFormSubmit: function(event)
    {
        // on annule la soumission par défaut du formulaire
        event.preventDefault();

        // on récupère notre formulaire courant
        const currentForm = event.currentTarget;

        // on récupère la valeur des champs de notre formulaire
        const newVideogameName = currentForm.querySelector('#inputName').value;
        const newVideogameEditor = currentForm.querySelector('#inputEditor').value;

        // on prépare les données à envoyer à notre API
        const data = {
            name: newVideogameName,
            editor: newVideogameEditor
        };

        // on déclare les en-têtes de notre requête
        const httpHeaders = new Headers();
        httpHeaders.append("Content-type", "application/json");

        const fetchOptions = {
            method: 'POST',
            mode:   'cors',
            cache:  'no-cache',
            headers:httpHeaders,
            body:   JSON.stringify(data)
        };

        // on déclare une variable pour trasmettre le status de la réponse
        let statusCode;

        // on fetch en post vers l'endpoint /videogames de notre API
        fetch(app.apiRootUrl + '/videogames', fetchOptions)
            .then(response => {
                if (response.status === 201)
                {
                    statusCode = "success";
                }
                else
                {
                    statusCode = "danger";
                }
                return response.json();
            })
            .then(response => {

                // on ferme la fenêtre 'modal' de Bootstrap
                $('#addVideogameModal').modal('hide');

                // on appelle la méthode pour afficher le message post insertion
                app.displayAddingMessage(statusCode);
                
                // si l'insertion a réussi :
                if (statusCode === "success")
                {
                    // on ajoute notre jeu au menu select pour le rendre disponible sans rechargement de la page
                    app.addNewVideogameIntoSelectElement(response);
                }
            }
        );
    },

    displayAddingMessage: function(statusCode)
    {
        // on crée un nouvel élément pour afficher le message après l'ajout d'un jeu
        const div = document.createElement('div');

        // on lui ajoute des classe Bootstrap
        div.className = "alert alert-" + statusCode;

        // on ajoute un attribut Bootstrap
        div.setAttribute('role', 'alert');

        // on détermine le contenu et la couleur du message en fonction du code réponse de l'API
        if (statusCode === 'success')
        {
            div.textContent = "Ajout d'une nouvelle entrée à la liste des jeux.";
        }
        else
        {
            div.textContent = "Problème lors de l'insertion du nouveau jeu.";
        }

        // on vide l'élément review avant d'afficher le message
        const review = document.getElementById('review');
        review.textContent = "";

        // on lui ajoute la nouvelle div
        review.appendChild(div);
    },

    addNewVideogameIntoSelectElement: function(videogame)
    {
        // on récupère le select
        let select = document.getElementById('videogameId');

        // on crée notre option avec la méthode createOptionElement
        let optionElement = app.createOptionElement(videogame);

        // on insère l'élément dans le DOM comme option du select
        select.appendChild(optionElement);
    },

    createOptionElement: function(videogame)
    {
        // Ajouter une balise <option> par videogame
        let optionElement = document.createElement('option');

        // on lui ajoute en contenu le nom du jeu
        optionElement.textContent = videogame.name;

        // on lui affecte en value l'id du jeu
        optionElement.value = videogame.id;

        // on retourne l'option créée
        return optionElement;
    }
};

document.addEventListener('DOMContentLoaded', app.init);