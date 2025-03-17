export class RequestFilter {
    id: string
    values: string[] | number[] | string | number

    constructor(id: string, values: string[] | number[]) {
        this.id = id
        this.values = values
    }
}