import meaningOfTheAvaliation from "../utils/meaningOfAvaliation"
import User from "../structures/user"

const handleAvaliationButton = async(request: any, response: any) => {
    
    const feedbackRate = meaningOfTheAvaliation(request.body.value)

    const user = new User(request.body.userId)

    const isThereAnAvaliation = await user.isThereAvaliationOf(feedbackRate)

    if(isThereAnAvaliation)
        await user.updateTotalOf(feedbackRate)
    
    else 
        await user.submitNewAvaliation(feedbackRate)
    
    response.send('received')
}

export default handleAvaliationButton