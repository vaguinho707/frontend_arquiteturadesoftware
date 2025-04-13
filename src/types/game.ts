export interface Game {
  id: number;
  label: string;
  creation_date: string;
  cost: number;
  location: string;
  game_date: string;
  duration_minutes: number;
}

export interface Location {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface GameFormData {
  label: string;
  cost: number;
  cep: string;
  game_date: string;
  duration_minutes: number;
  location: Location;
}