import axios from 'axios';
import { Game, GameFormData, Location } from '../types/game';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

const viaCepApi = axios.create({
  baseURL: 'https://viacep.com.br/ws'
});

export const getGames = async (): Promise<Game[]> => {
  const response = await api.get('/game');
  return response.data.games;
};

export const createGame = async (data: GameFormData): Promise<Game> => {
//   const cepResponse = await getCepData(data.cep);
  const location = `${data.location.logradouro}, ${data.location.numero}, ${data.location.bairro}, ${data.location.localidade} - ${data.location.uf}`;
  
  const response = await api.post('/game', {
    id: Math.floor(Math.random() * 1000),
    label: data.label,
    cost: parseFloat(data.cost.toString()),
    location: location,
    game_date: new Date(data.game_date).toISOString(),
    duration_minutes: parseInt(data.duration_minutes.toString()),
    creation_date: new Date().toISOString()
  });
  
  return response.data;
};

export const deleteGame = async (id: number): Promise<void> => {
  const deleteResponse = await api.delete('/game', { 
    data: { 
      id: id  // This matches the GameSearchSchema structure
    } 
  });
    return deleteResponse.data;
};

export const getCepData = async (cep: string): Promise<Location> => {
  const formattedCep = cep.replace(/\D/g, '');
  const response = await viaCepApi.get(`/${formattedCep}/json`);
  return response.data;
};