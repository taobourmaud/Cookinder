import { supabase } from "../../../supabase"
import { LikesModel } from "../models/likes";
import { User as SupabaseUser } from '@supabase/supabase-js';
export default class ApiHandler {
    public async getUser() : Promise<SupabaseUser>{
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

    public async getData(targetTable: string) : Promise<object[] | null> {
        try {
            const retrieveData = await supabase.from(targetTable).select()
            if (!retrieveData)
                throw new Error("Data not found")
            return retrieveData.data
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