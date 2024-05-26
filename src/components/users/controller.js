import { response } from '../../network/response.js'
import { consults } from '../../db/consults_users.js'
import { consultsBuys } from '../../db/buy_package.js'
import {buildPdf, generatePdfPath } from '../../utils/pdf/pdf.js'


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

export const updateUser = async (req, res) => {
    const { id } = req.params
    const userData = req.body
    try {
        const user = await consults.updateUser(id, userData)
        response.success(res, 200, user)
    } catch (error) {
        response.error(res, 500, 'Internal error', error)
    }
}


export const buysPackage = async (req, res) => {
    const data = req.body;

    try {
        const buyIdPackage = await consultsBuys.buysPackage(data);
        console.log('[controller] Buy package created', buyIdPackage);

        const { filepath, filename } = generatePdfPath();
        buildPdf(filepath, () => {
            res.status(200).json({
                success: true,
                message: 'Package bought',
                buyIdPackage,
                pdfUrl: `../../utils/pdf/pdfs/${filename}`
            });
        });
    } catch (error) {
        console.error('[controller] Error al comprar paquete:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal error',
            error: error.message
        });
    }
};


export const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        await consults.deleteUser(id)
        response.success(res, 200, 'User deleted')
    } catch (error) {
        response.error(res, 500, 'Internal error', error)
    }
}
