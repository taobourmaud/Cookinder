export class DishesModel {
    id?: string
    title?: string
    description?: string
    image_url?: string
    created_at?: Date
    user_id?: string
    cooking_time?: number
    number_persons?: number
    ingredients?: string[]
    instructions?: string[]
    difficulty?: number

}