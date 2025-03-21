import { supabase } from "../../../supabase"
import { DifficultiesModel } from "../models/difficulties";
import { DishesModel } from "../models/dishes";
import { DishesTagModel } from "../models/dishes_tag";
import { LikesModel } from "../models/likes";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { RequestFilter } from "../models/requestFilter";
import { TagsModel } from "../models/tags";

export default class ApiHandler {
    public async getUser() : Promise<SupabaseUser>{
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (!user) {
                throw new Error("User not found");
            }
            if (error) {
                throw new Error(`Error during user recovery data : ${error.message}`)
            }
            return user
        } catch (error: Error | any) {
            throw new Error(error.message)
        }
    }

    public async getData({targetTable, targetColumn = null, conditionsEq = null, conditionsIn = null}: {targetTable: string, targetColumn?: string | null, conditionsEq?: RequestFilter | null, conditionsIn?: RequestFilter | null, conditionsNotIn?: RequestFilter | null}) : Promise<DifficultiesModel[] | DishesTagModel[] | DishesModel[] | LikesModel[] | TagsModel[] | []> {
        try {
            let dataFetch = supabase.from(targetTable).select();
            if (conditionsIn !== null) {
                dataFetch = dataFetch.in(conditionsIn.id, conditionsIn.values as (number[] | string[]) )
            }
            if (conditionsEq !== null) {
                dataFetch = dataFetch.eq(conditionsEq.id, conditionsEq.values)
            }
            
            const {data, error} = await dataFetch
            if (error) {
                throw new Error(error.message)
            }

            if (!data)
                throw new Error("Data not found")
            
            return data
        } catch (error: Error | any) {
            throw new Error(error.message)
        }
    }

    public async postData(targetTable: string, newData: LikesModel | DishesModel | object) {
        try {
            const { data, error } = await supabase.from(targetTable).insert(newData).select()
            if (error) {
                throw new Error(`Error during insert data : ${error.message}`)
            }
            return data
        } catch (error: Error | any) {
            throw new Error(error.message)
        }
    }

    public async uploadImage(fileName: string, imageUri: string) {
        try {
            const { data: imageUploaded, error: uploadError } = await supabase.storage
            .from('dishes_images')
            .upload(fileName, {
              uri: imageUri,
              type: 'image/jpeg',
              name: fileName,
            });
      
          if (uploadError) {
            throw new Error(`Error during upload image : ${uploadError.message}`)
          }

          return imageUploaded
        } catch (error: Error | any) {
            throw new Error(error.message)
        }  
    }

    public async deleteDishByUser (table: string, dishId: string, userId: string) {
        try {
            const { data: existingDish, error: fetchError } = await supabase
                .from(table)
                .select('id')
                .eq(`${table === 'dishes' ? 'id' : 'dish_id'}`, dishId)
                .eq('user_id', userId)
                .single();
    
            if (fetchError) throw fetchError;
    
            if (!existingDish) {
                console.warn(`Aucun élément trouvé dans '${table}' pour cet utilisateur.`);
                return { success: false, message: `Aucun élément trouvé.` };
            }
    
            const { error: deleteError } = await supabase
                .from(table)
                .delete()
                .eq('id', existingDish.id);
    
            if (deleteError) throw new Error(deleteError.message);
    
            return { success: true, message: "Élément supprimé avec succès." };
        } catch (error: Error | any) {
            throw new Error(error.message)
        }
    }; 

    public async getLikesDishesByUser(userId: string) {
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
                        created_at,
                        user_id,
                        username
                    )
                `)
                .eq('user_id', userId);
    
            if (error) 
                throw new Error(error.message);
    
            return data;
        } catch (error: Error | any) {
            throw new Error(error.message);
        }
    }

    public async getTagsOfDish(dishId: string) {
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
            if (error) 
                throw new Error(error.message);
    
            return data?data.map(tag => tag.tags.title) : [];
        } catch (error: Error | any) {
            throw new Error(error.message);
        }
    }
} 