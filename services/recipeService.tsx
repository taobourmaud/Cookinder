import { supabase } from '../supabase';

export const getLikedRecipes = async (userId) => {

    try {
        const { data, error } = await supabase
            .from('likes')
            .select(`*`)
            .eq('user_id', userId);

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des recettes likées :', error.message);
        return [];
    }
};
