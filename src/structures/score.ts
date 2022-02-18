import { avaliation, history } from "../@types/mongoRequestType"
import ScoreTypes from "../@types/scoreTypes"

export default class Score {

    protected user: ScoreTypes.requestUser
    protected scoreTable: ScoreTypes.scoreTable
    protected scoreCoefficients: ScoreTypes.scoreCoefficients

    constructor(user: ScoreTypes.requestUser){
        this.user = user

        this.scoreTable = {
            great: 1.25,
            good: 1,
            regular: 0,
            bad: -1
        }

        this.scoreCoefficients = [
            {value: 157.5, name: 'bad'},
            {value: 257.5, name: 'suggested'},
            {value: 350, name: 'great'},
            {value: 481.25, name: 'exceptional'},
        ]
        
    }

    public getUserScore(): ScoreTypes.score {
        const previousMonth = this.getPreviousMonthResult()
        const currentMonth = this.getActualMonthResult()

        return {
            previousMonth,
            currentMonth,
        }
    }

    private getPreviousMonthResult(): ScoreTypes.monthResult | null {
        const currentMonth = ( new Date().getMonth() + 1 )
        const isThereAPreviousMonth = this.user.history
            .find(avaliation => currentMonth - avaliation.fromMonth === 1)

        if(!isThereAPreviousMonth) return null

        const numberOfServices = this.getNumberOfServices<avaliation>(this.user.avaliations)
        const avarage = this.getAverage(numberOfServices)   
        const points = this.getPoints(numberOfServices)

        return {
            numberOfServices,
            avarage,
            points,
        }
    }

    private getActualMonthResult(): ScoreTypes.monthResult {
        const numberOfServices = this.getNumberOfServices<history>(this.user.history)
        const avarage = this.getAverage(numberOfServices)   
        const points = this.getPoints(numberOfServices)

        return {
            numberOfServices,
            avarage,
            points,
        }
    }

    private getNumberOfServices<T extends {feedbackRate: string}>(array: T[]) {

        const numberOfASpecificService = (feedbackRate: string) =>(
            array.filter(service => service.feedbackRate === feedbackRate).length
        )
        
        let numberOfServices: ScoreTypes.numberOfServices = {
            total: this.user.history.length,
            bad: numberOfASpecificService('bad'),
            regular: numberOfASpecificService('regular'),
            good: numberOfASpecificService('good'),
            great: numberOfASpecificService('great'),
        }

        return numberOfServices
    }

    private getAverage(numberOfServices: ScoreTypes.numberOfServices): ScoreTypes.avarage {
        const {
            great,
            good,
            regular,
            bad,
            total
        } = numberOfServices

        const avarage = (avalationNumber: number) => ((avalationNumber/total) * 100)

        return {
            bad: avarage(bad),
            regular: avarage(regular),
            good: avarage(good),
            great: avarage(great),
        }
    }

    private getPoints(numberOfServices: ScoreTypes.numberOfServices): ScoreTypes.points {
        const suggestedPoints = 237.5 * (numberOfServices.total/5)
        const actualPoints = this.getPointsOfServices(numberOfServices)   
        const classification = this.getClassification(actualPoints, numberOfServices.total)
        
        return {
            suggestedPoints,
            actualPoints,
            classification,
        }
    }

    private getPointsOfServices(numberOfServices: ScoreTypes.numberOfServices): number {
        const indexes: ScoreTypes.servicesIndexes = ['great','good','regular','bad']

        const points = indexes.map(
            index => numberOfServices[index] * this.scoreTable[index]
        )
        .reduce(
            (accumulator, current) => accumulator + current
        )

        return (points * 100)
    }

    private getClassification(actualpoints: number, numberOfServices: number): ScoreTypes.points['classification'] {
        const valueOfFittableCoefficient = this.scoreCoefficients
            .filter(
                coefficient => (coefficient.value * numberOfServices)/5 <= actualpoints
                    ? true
                    : false
            )
            .reduce(
                (accumulator, actualCoefficient) => Math.max(accumulator, actualCoefficient.value), 0
            )

        const classification = valueOfFittableCoefficient > 0
            ? this.scoreCoefficients
                .find(coefficient => coefficient.value === valueOfFittableCoefficient)
                ?.name
            : 'bad'

        return classification!
    }
}