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