export class LikesModel {
    id?: string
    user_id: string
    dish_id: string
    created_at?: Date

    constructor(user_id: string, dish_id: string) {
        this.user_id = user_id
        this.dish_id = dish_id
    }
}