import { supabase } from "../../../supabase"
import { DifficultiesModel } from "../models/difficulties";
import { DishesModel } from "../models/dishes";
import { DishesTagModel } from "../models/dishes_tag";
import { LikesModel } from "../models/likes";
import { RequestFilter } from "../models/requestFilter";
import { TagsModel } from "../models/tags";

export default class ApiHandler {
    public async getUser() : Promise<object>{
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error("User not found");
            }
            return user
        } catch (error: Error | any) {
            throw new Error(error.message)
        }
    }

    public async getData({targetTable, conditionsEq = null, conditionsIn = null}: {targetTable: string, conditionsEq?: RequestFilter | null, conditionsIn?: RequestFilter | null, conditionsNotIn?: RequestFilter | null}) : Promise<DifficultiesModel[] | DishesTagModel[] | DishesModel[] | LikesModel[] | TagsModel[] | []> {
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

    public async postData(targetTable: string, newData: Promise<LikesModel | object>) {
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

    public async deleteData(targetTable: string, id: string) {
        try {
            const response = await supabase.from(targetTable).delete().eq('id', id)
            if (response.status !== 204) {
                throw new Error(`Error during delete data : ${response.statusText}`)
            }
            return
        } catch (error: Error | any) {
            throw new Error(error.message)
        }
    }
} 