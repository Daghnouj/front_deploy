import { create } from 'zustand';
import axios from 'axios';

export const useGalerieStore = create((set, get) => ({
  topVideos: [],
  categoryVideos: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  localViewedVideos: new Set(),

  // Ajout de l'action pour réinitialiser la catégorie
  clearSelectedCategory: () => set({ selectedCategory: null }),

  // Récupération des vidéos populaires (top 3)
  fetchTopVideos: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get('http://localhost:5000/api/galerie/top');
      const sorted = res.data.sort((a, b) => 
        b.viewedBy.length - a.viewedBy.length || 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      set({ topVideos: sorted.slice(0, 3), isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Récupération par catégorie
  fetchCategoryVideos: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(
        `http://localhost:5000/api/galerie?categorie=${encodeURIComponent(category)}`
      );
      set({
        categoryVideos: res.data,
        selectedCategory: category,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Récupération de toutes les données (version corrigée)
  fetchAllData: async (category = null) => {
    set({ isLoading: true, error: null });
    try {
      const [allRes, categoryRes] = await Promise.all([
        axios.get('http://localhost:5000/api/galerie'),
        category 
          ? axios.get(`http://localhost:5000/api/galerie?categorie=${encodeURIComponent(category)}`)
          : null,
      ]);

      set({
        topVideos: allRes.data, // Toutes les vidéos
        categoryVideos: categoryRes?.data || [],
        selectedCategory: category, // Correction importante
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Gestion des vues (inchangé)
  incrementViews: (videoId, newViews) => {
    set((state) => ({
      topVideos: state.topVideos.map(video =>
        video._id === videoId ? { ...video, views: newViews } : video
      ),
      categoryVideos: state.categoryVideos.map(video =>
        video._id === videoId ? { ...video, views: newViews } : video
      ),
    }));
  },

  // Mise à jour des vues locales (inchangé)
  setLocalViewedVideos: (newSet) => {
    set({ localViewedVideos: newSet });
  },
}));