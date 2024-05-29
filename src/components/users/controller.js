import { response } from '../../network/response.js'
import { consults } from '../../db/consults_users.js'
import { packagesConsults } from '../../db/consults_package.js'
import { consultsBuys } from '../../db/buy_package.js'
import {
  buildPdf,
  generatePdfPath,
  sendEmailWithPdf
} from '../../utils/pdf/pdf.js'

export const getUserByEmail = async (req, res) => {
  try {
    console.log('Entre aqui')
    const { email } = req.params
    console.log(email)
    const user = await consults.getUser(email)
    console.log(user.data)

    response.success(res, 200, user)
  } catch (error) {
    response.error(res, 'Not found', 404)
  }
}

export const getUserAll = async (req, res) => {
  try {
    const users = await consults.getUserAll()
    const data = users.map((user) => {
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
    response.error(res, 'Internal error', 500)
  }
}

export const getFilterByRol = async (req, res) => {
  const { rol } = req.params
  try {
    const users = await consults.getFilterByRol(rol)
    const data = users.map((user) => {
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
    response.error(res, 'Internal error', 500)
  }
}
export const getFilterByUsername = async (req, res) => {
  const { name } = req.params
  try {
    const users = await consults.getFilterByUsername(name)
    const data = users.map((user) => {
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
    response.error(res, 'Internal error', 500)
  }
}

export const updateUser = async (req, res) => {
  const { id } = req.params
  const userData = req.body
  try {
    const user = await consults.updateUser(id, userData)
    response.success(res, 200, user)
  } catch (error) {
    response.error(res, 'Internal error', 500)
  }
}

export const buysPackage = async (req, res) => {
  const data = req.body

  try {
    const infoPackage = await consultsBuys.buysPackage(data)
    console.log('infoPackage:', infoPackage)
    const { filepath, filename } = generatePdfPath()
    await buildPdf(filepath, infoPackage)

    // Enviar el PDF por correo electrónico
    sendEmailWithPdf(infoPackage[0].email, filepath, filename, (err, info) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error sending email',
          error: err.message
        })
      }

      res.status(200).json({
        success: true,
        message: 'Package bought and email sent',
        buyIdPackage: infoPackage[0].id_buy_package,
        pdfUrl: `../../utils/pdf/pdfs/${filename}`
      })
    })
  } catch (error) {
    console.error('[controller] Error al comprar paquete:', error.message)
    res.status(500).json({
      success: false,
      message: 'Internal error',
      error: error.message
    })
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    await consults.deleteUser(id)
    response.success(res, 'User deleted: ', id, 200)
  } catch (error) {
    response.error(res, 'Internal error', 500)
  }
}

export const createPackageController = async (req, res) => {
  const packageInfo = req.query
  try {
    const createPackeg = await consults.createPackage(packageInfo)
    response.success(res, 'Paquete aptualizado con exito', createPackeg, 200)
  } catch (error) {
    response.error(res, 'Internal error', 500)
  }
}

export const deletePackageController = async (req, res) => {
  const { id } = req.params
  console.log(id)
  try {
    const deletePac = await packagesConsults.deletePackage(id)
    response.success(res, 'paquete eliminado con exito: ', deletePac, 200)
  } catch (error) {
    response.error(res, 'Internal error', 500)
  }
}

export const updatePackageController = async (req, res) => {
  const { idHotels, idRestaurant, idAttraction, idAttraction2, pricePackage } =
    req.query
  const { id } = req.params
  try {
    const updatePac = await consults.updatePackage(
      id,
      idHotels,
      idRestaurant,
      idAttraction,
      idAttraction2,
      pricePackage
    )
    response.success(res, 'Update package: ', updatePac, 200)
  } catch (error) {
    response.success(res, 'Internal error', 500)
  }
}

export const getHistoryController = async (req, res) => {
  const { id } = req.params
  try {
    const deletedUser = await consults.getHistoryBuy(id)
    res.json(deletedUser)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al eliminar usuario', error: error.message })
  }
}
