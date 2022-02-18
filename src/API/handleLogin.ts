import User from '../structures/user'

const loginAuthentication = async(request: any, response: any) => {
    const { username, password, segmentation } = request.body

    if(!username || !password) return

    const user = { 
            name: username as string,
            password: password as string,
            segmentation: segmentation as string 
        }

    const existingUser = await User.exists(user)

    if(!existingUser) return response.send(false)

    return response.send(existingUser)
}

export default loginAuthentication