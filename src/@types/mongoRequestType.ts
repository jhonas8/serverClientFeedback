export type avaliationRate = {
    feedbackRate: string,
    total: number
    userId: string
}

export type user = {
    name: string,
    password: string,
    segment: string
    employeeName?: string
    __v?: number
    _id?: string
}

export type avaliation = {
    feedbackRate: string,
    total: number,
    userId: string,
    __v: number,
    _id: string,
}

export type history = {
    date: string,
    feedbackRate: string,
    hour: string,
    userId: string,
    fromMonth: number,
    __v: number,
    _id: string,
}