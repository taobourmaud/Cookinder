export class DishesModel {
    id?: string;
    title?: string;
    description?: string;
    image_url?: string;
    created_at?: Date;
    cooking_time?: number;
    number_persons?: number;
    ingredients?: string[];
    instructions?: string[];
    difficulty?: number;
    username?: string;

    constructor(title?: string, description?: string, image_url?: string, cooking_time?: number, number_persons?: number, ingredients?: string[], instructions?: string[], difficulty?: number, username?: string) {
        this.title = title;
        this.description = description;
        this.image_url = image_url;
        this.cooking_time = cooking_time;
        this.number_persons = number_persons;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.difficulty = difficulty;
        this.username = username;
        this.created_at = new Date();
    }
}