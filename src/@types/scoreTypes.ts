import { user, avaliation, history } from '../@types/mongoRequestType'

declare namespace ScoreTypes {

    export interface requestUser {
        user: user,
        avaliations: avaliation[],
        history: history[]
    }
    
    export interface responseUser extends requestUser {
        score: ScoreTypes.score
    }

    export interface avarage {
        bad: number,
        regular: number,
        good: number,
        great: number,
    }
    
    export interface numberOfServices extends avarage {
        total: number,
    }

    export interface scoreTable {
        great: 1.25
        good: 1
        regular: 0
        bad: -1
    }

    export interface points {
        suggestedPoints: number //Actually, any multiple of 287.5

        actualPoints: number

        classification: |'bad'
                        |'suggested'
                        |'great'
                        |'exceptional'
    }

    export type servicesIndexes = [
        'great',
        'good',
        'regular',
        'bad',
    ]

    export type scoreCoefficients = [
        {value: 157.5, name: 'bad'},
        {value: 257.5, name: 'suggested'},
        {value: 350, name: 'great'},
        {value: 481.25, name: 'exceptional'},
    ]

    export interface monthResult {
        avarage: avarage
        points: points
        numberOfServices: numberOfServices
    }

    export interface score {
        previousMonth: monthResult | null
        currentMonth: monthResult
    }

}

export default ScoreTypes