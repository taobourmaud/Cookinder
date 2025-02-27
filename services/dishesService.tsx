import { supabase } from '../supabase';

export const getLikedDishesByUser = async (userId) => {

    try {
        const { data, error } = await supabase
            .from('likes')
            .select(`
                id,
                dishes: dish_id (
                    id,
                    title,
                    description,
                    ingredients,
                    instructions,
                    cooking_time,
                    number_persons,
                    difficulty: difficulties (
                        id,
                        title
                    ),
                    image_url,
                    created_at
                )
            `)
            .eq('user_id', userId);

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des recettes likées :', error.message);
        return [];
    }
};

export const getNumberOfLikesDish= async (dishId: string) => {
    try {
        const { data, error } = await supabase
            .from('likes')
            .select('id')
            .eq('dish_id', dishId);
        if (error) throw error;

        return data?.length || 0;
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre de likes :', error.message);
        return 0;
    }
};

export const getTagsOfDish= async (dishId: string) => {
    try {
        const { data, error } = await supabase
            .from('dishes_tags')
            .select(`
                tags: tag_id (
                    id,
                    title
                )
            `)
            .eq('dish_id', dishId);

        if (error) throw error;

        return data?data.map(tag => tag.tags.title) : [];
    } catch (error) {
        console.error('Erreur lors de la récupération des tags du plat :', error.message);
        return 0;
    }
};


