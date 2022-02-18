import { user } from '../@types/mongoRequestType'
import User from '../structures/user'

export default async function handleRegistration(request: any, response: any): Promise<void>{
    const { name , password, segment, employeeName }: user = request.body

    const existingUser = await User.registration({name, password, segment, employeeName})

    if(existingUser) return response.send('Usuário já existe!')

    response.send('Usuário registrado')
}