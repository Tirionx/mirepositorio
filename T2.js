const axios = require('axios');

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

async function fetchPokemonByNumber(number) {
    try {
        const url = `${BASE_URL}${number}/`;

        const response = await axios.get(url);
        const data = response.data;

        console.log(`ID: ${data.id}`);
        console.log(`Name: ${data.name}`);
        console.log(`Height: ${data.height}`);
        console.log(`Weight: ${data.weight}`);
        console.log(`Types: ${data.types.map(typeInfo => typeInfo.type.name).join(', ')}`);
        console.log(`Abilities: ${data.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}`);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchPokemonByNumber(7);
