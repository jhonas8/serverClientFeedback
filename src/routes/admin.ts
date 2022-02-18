import { Router } from 'express'
import { history, user } from '../@types/mongoRequestType'
import getAvaliation from '../API/getAvaliation'
import getUserDataAndScore from '../API/getUserDataAndScore'
import Score from '../structures/score'
import User from '../structures/user'
import AvaliationModel from "../Schemas/Avaliation"
import HistoryModel from "../Schemas/AvaliationHistory"
import UserModel from "../Schemas/UserSchema"
import ScoreTypes from '../@types/scoreTypes'

const route = Router()

route.get('/', getAvaliation)

route.post('/search', async(request, response)=>{
    type usersAndAvaliationsType = {
        segment: string,
        name: string,
        id: string,
        avaliations: Array<{rate: string, total:number}>
    } 

    const { username } = request.body

    const users = await User.usersWithNameOf(username)

    const usersAndAvaliations: usersAndAvaliationsType[] = await 
        Promise.all(
            users.map(
                async(user: user): Promise<usersAndAvaliationsType> => {
                    
                    const userInstance = new User(user['_id']!)
                    
                    let avaliation = await userInstance.allAvaliations()

                    return {
                        segment: user.segment,
                        name: user.employeeName!,
                        avaliations: avaliation,
                        id: user._id!
                    }
                }
            )
        )

    return response.send(usersAndAvaliations)
})

route.post('/userpage', getUserDataAndScore)

route.post('/ranking', async(request, response)=>{
    const users = await UserModel.find().exec()

        const rankingMap = await Promise.all(users
            .filter(user => user.segment === 'Recepção')
            .map(async(user)=> {

                const history = await HistoryModel
                     .find({userId: user._id})
                     .exec()
 
                 const avaliations = await AvaliationModel
                     .find({userId: user._id})
                     .exec()
 
                 const instance = new Score({user, history, avaliations})
                 
                 const points = instance.getUserScore().currentMonth.points.actualPoints
 
                 return { points, name: user.employeeName, userId: user._id}
             })
            )

        response.send(
            rankingMap.sort((a,b) => a.points < b.points ? 1 : -1)
        )
})


route.get('/charts', async(request, response)=>{
    const currentMonth = new Date().getMonth() + 1
    const currentHistory = await HistoryModel
        .find({fromMonth: currentMonth})
        .exec() as history[]
    
    const previousHistory = await HistoryModel
        .find({fromMonth: currentMonth - 1})
        .exec()
    
    const totalOfFeedbacksOfCurrentMonth = currentHistory.length
    const totalOfFeedbacksOfPreviousMonth = previousHistory.length

    const NumberOfSpecifFeedbacks = [
        {
            value:currentHistory.filter(avaliation => avaliation.feedbackRate === 'bad').length,
            name: 'bad'
        },
        {
            value:currentHistory.filter(avaliation => avaliation.feedbackRate === 'regular').length,
            name: 'regular'
        },
        {
            value:currentHistory.filter(avaliation => avaliation.feedbackRate === 'great').length,
            name: 'great'
        },
        {
            value:currentHistory.filter(avaliation => avaliation.feedbackRate === 'good').length,
            name: 'good'
        },
    ]

    const NumberOfSpecifPreviousFeedbacks = previousHistory.length
     ?[
        {
            value:previousHistory.filter(avaliation => avaliation.feedbackRate === 'bad').length,
            name: 'bad'
        },
        {
            value:previousHistory.filter(avaliation => avaliation.feedbackRate === 'regular').length,
            name: 'regular'
        },
        {
            value:previousHistory.filter(avaliation => avaliation.feedbackRate === 'great').length,
            name: 'great'
        },
        {
            value:previousHistory.filter(avaliation => avaliation.feedbackRate === 'good').length,
            name: 'good'
        },
    ]
    :null

    const currentAvarages = NumberOfSpecifFeedbacks.map(number => ({
        value: (number.value/totalOfFeedbacksOfCurrentMonth)*100,
        name: number.name
    }))

    const previousAvarages = !NumberOfSpecifPreviousFeedbacks
        ? 0
        :NumberOfSpecifPreviousFeedbacks.map(number => ({
            value: (number.value/totalOfFeedbacksOfPreviousMonth)*100,
            name: number.name
        }))

    const users = await UserModel.find().exec()

    const rankingMap = await Promise.all(users
        .filter(user => user.segment === 'Recepção')
        .map(async(user)=> {

            const requestUser = await new User(user._id).getPublicData() as ScoreTypes.requestUser

            const userScore = new Score(requestUser).getUserScore() as ScoreTypes.score

            const points = {actual: userScore.currentMonth.points.actualPoints, 
                suggested:userScore.currentMonth.points.suggestedPoints}

            const userAndHistory = {history: requestUser.history, name: requestUser.user.employeeName}

             return { points, userAndHistory }
         })
        )

    const companyScore = rankingMap.reduce(
        (acc, value) => acc + value.points.actual
    , 0)

    const suggestedScore = rankingMap.reduce(
        (acc, value) => acc + value.points.suggested
    , 0)

    const userAndHistory = rankingMap.map(user=> user.userAndHistory)

    response.send({
        currentAvarages,
        previousAvarages,
        companyScore,
        suggestedScore,
        userAndHistory,
    })
})

module.exports = route