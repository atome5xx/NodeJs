async function deleteMovie(movieId) {
    try {
        const response = await fetch(`movies/${movieId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du film.');
        }

        alert('Film supprimé avec succès.');
        window.location.reload();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la suppression du film.');
    }
}

async function updateMovie(id, title, rating, year, actors) {
    const data = {
        id: id,
        title: title,
        rating: rating,
        year: year,
        actors: actors
    };
    try {
        const response = await fetch(`/movies/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du film.');
        }

        alert('Film modifié avec succès.');
        window.location.href = `/movies/${id}`;
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la mise à jour du film.');
    }
}

function removeActor(button) {
    const actorGroup = button.parentElement;
    actorGroup.remove();
}

function addActor() {
    const container = document.getElementById('actorsContainer');
    const actorGroup = document.createElement('div');
    actorGroup.className = 'actor-group';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'actors[]';
    input.placeholder = "Nom de l'acteur";
    input.required = true;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-actor-btn';
    removeButton.textContent = 'Supprimer';
    removeButton.onclick = function () {
        container.removeChild(actorGroup);
    };

    actorGroup.appendChild(input);
    actorGroup.appendChild(removeButton);
    container.appendChild(actorGroup);
}