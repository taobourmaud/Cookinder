export class DishesTagModel {
    id?: string
    dish_id?: string
    tag_id?: number

    constructor(dish_id?: string, tag_id?: number) {
        this.dish_id = dish_id
        this.tag_id = tag_id
    }
}