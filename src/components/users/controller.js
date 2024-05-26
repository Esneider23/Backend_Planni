import { response } from '../../network/response.js'
import { consults } from '../../db/consults_users.js'


export const getUserAll = async (req, res) => {
    try {
        const users = await consults.getUserAll()
        const data = users.map(user => {
            return {
                id: user.id_users,
                name: user.name_user,
                username: user.username,
                email: user.email,
                role: user.name_rol,
                country: user.name_country
            }
        })
        response.success(res, 200, data)
    } catch (error) {
        response.error(res, 500, 'Internal error', error)
    }
}

export const getFilterByRol = async (req, res) => {
    const { rol } = req.params
    try {
        const users = await consults.getFilterByRol(rol)
        const data = users.map(user => {
            return {
                id: user.id_users,
                name: user.name_user,
                username: user.username,
                email: user.email,
                role: user.name_rol,
                country: user.name_country
            }
        })
        response.success(res, 200, data)
    } catch (error) {
        response.error(res, 500, 'Internal error', error)
    }

}
export const getFilterByUsername = async (req, res) => {
    const { name } = req.params
    try {
        const users = await consults.getFilterByUsername(name)
        const data = users.map(user => {
            return {
                id: user.id_users,
                name: user.name_user,
                username: user.username,
                email: user.email,
                role: user.name_rol,
                country: user.name_country
            }
        })
        response.success(res, 200, data)
    } catch (error) {
        response.error(res, 500, 'Internal error', error)
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        await consults.deleteUser(id)
        response.success(res, 200, 'User deleted')
    } catch (error) {
        response.error(res, 500, 'Internal error', error)
    }
}

