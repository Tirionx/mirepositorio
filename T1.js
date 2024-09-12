const axios = require('axios');

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
const PAGE_SIZE = 20;  // Tamaño de página

async function fetchPokemons(url = `${BASE_URL}?limit=${PAGE_SIZE}`) {
    try {
        const response = await axios.get(url);
        const data = response.data;

        // Imprime los nombres de los Pokémon obtenidos en esta página
        data.results.forEach(pokemon => console.log(pokemon.name));

        // Verifica si hay una página siguiente
        if (data.next) {
            console.log('Fetching next page...');
            await fetchPokemons(data.next);
        } else {
            console.log('All pages fetched.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Comienza a obtener los Pokémon desde la primera página
fetchPokemons();
