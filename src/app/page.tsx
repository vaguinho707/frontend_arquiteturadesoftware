'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { getGames, createGame, deleteGame, updateGame, getCepData } from '../services/api';
import { Location, Game, GameFormData } from '../types/game';

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [location, setLocation] = useState<Location>();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<GameFormData>();

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    if (editingGame) {
      setValue('label', editingGame.label);
      setValue('cost', editingGame.cost);
      setValue('game_date', format(new Date(editingGame.game_date), "yyyy-MM-dd'T'HH:mm"));
      setValue('duration_minutes', editingGame.duration_minutes);
    }
  }, [editingGame, setValue]);

  const loadGames = async () => {
    try {
      const data = await getGames();
      setGames(data);
    } catch (error) {
      console.error('Error loading games:', error);
    }
  };

  const onSubmit = async (data: GameFormData) => {
    try {
      setLoading(true);
      if (editingGame) {
        await updateGame(data, editingGame.id);
      } else {
        await createGame(data, location);
      }
      await loadGames();
      setIsModalOpen(false);
      setEditingGame(null);
      reset();
    } catch (error) {
      console.error('Error saving game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteGame(id);
      await loadGames();
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingGame(null);
    reset();
  };

  const handleCepChange = async (cep: string) => {
    try {
      const cepData = await getCepData(cep);
      setLocation(cepData);
    } catch (error) {
      console.error('Error fetching CEP data:', error);
    }
  };

  return (
    <main className="main">
      <div className="container">
        <div className="header">
          <h1 className="title">Soccer Games</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="button button-green"
          >
            New Game
          </button>
        </div>

        <div className="grid">
          {games.map((game) => (
            <div key={game.id} className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">{game.label}</h2>
                  <p className="card-text">{game.location}</p>
                  <p className="card-text">
                    {format(new Date(game.game_date), 'PPP')} - {game.duration_minutes} minutes
                  </p>
                  <p className="card-text">Cost: ${game.cost}</p>
                </div>
                <div className="card-actions">
                  <button
                    onClick={() => handleEdit(game)}
                    className="button button-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(game.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2 className="modal-title">{editingGame ? 'Edit Game' : 'New Game'}</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    {...register('label', { required: true })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('cost', { required: true, min: 0 })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CEP</label>
                  <input
                    {...register('cep', { required: true })}
                    placeholder="CEP with no hyphen or dots"
                    className="form-input"
                    maxLength={9}
                    onChange={(e) => {
                      if (e.target.value.length === 8) {
                        const cep = e.target.value;
                        handleCepChange(cep);
                      }
                    }}
                  />
                </div>
                {!!location && (
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      {...register('location.estado', { required: true })}
                      className="form-input"
                      disabled
                      value={location?.estado || ''}
                    />
                    <label className="form-label">District</label>
                    <input
                      {...register('location.bairro', { required: true })}
                      className="form-input"
                      disabled
                      value={location?.bairro || ''}
                    />
                    <label className="form-label">Street</label>
                    <input
                      {...register('location.logradouro', { required: true })}
                      className="form-input"
                      disabled
                      value={location?.logradouro || ''}
                    />
                    <label className="form-label">Number</label>
                    <input
                      type="number"
                      {...register('location.numero', { required: true })}
                      className="form-input"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Game Date</label>
                  <input
                    type="datetime-local"
                    {...register('game_date', { required: true })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    {...register('duration_minutes', { required: true, min: 1 })}
                    className="form-input"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="button button-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="button button-green"
                  >
                    {loading ? 'Saving...' : editingGame ? 'Update Game' : 'Create Game'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
