import { response } from '../../network/response.js'
import { hashPassword } from '../../utilis/hast.js'
import { consults } from '../../db/consults.js'

export const registryUserClient = async (req, res) => {
  try {
    const { password, password_conf, email, country } = req.body
    if (password !== password_conf) {
      response.error(
        res,
        'Password and password confirmation do not match',
        400
      )
    }
    const hashedPassword = await hashPassword(password)
    const responseDB = await consults.getUser(email)
    if (responseDB.length === 1) {
      response.error(res, 'User already exists', 400)
    }

    const responseDBCreate = await consults.createUserClient(
      email,
      hashedPassword,
      country
    )
    response.success(res, 'Password hashed', { hashedPassword, email })
  } catch (error) {
    response.error(res, error.message)
  }
}

export const registryOtherUserType = async (req, res) => {
  try {
    const {
      username,
      name_user,
      lastname_user,
      id_country,
      email,
      password,
      phone,
      addrees,
      id_rol,
    } = req.body
    const hashedPassword = await hashPassword(password)
    const responseDB = await consults.getUser(email)
    if (responseDB.length === 1) {
      response.error(res, 'User already exists', 400)
    }
    const responseDBCreate = await consults.createUserOtherType(
      username,
      name_user,
      lastname_user,
      id_country,
      email,
      hashedPassword,
      phone,
      addrees,
      id_rol
    )
    response.success(res, 'Password hashed', { hashedPassword, email })
  } catch (error) {
    response.error(res, error.message)
  }
}

export const registrySupplierUser = async (req, res) => {
  try {
    const {
      name_supplier,
      nit_supplier,
      email_supplier,
      id_country_supplier,
      addres_supplier,
      phone_supplier,
      id_type_supplier,
    } = res.body
    const responseDB = await consults.consults_supplier(name_supplier, email_supplier, nit_supplier)
    if (responseDB.length === 1) {
      response.error(res, 'Supplier already exists', 400)
    }
    const responseDBCreate = await consults.createUserSupplier(
      name_supplier,
      nit_supplier,
      email_supplier,
      id_country_supplier,
      addres_supplier,
      phone_supplier,
      id_type_supplier
    )
    response.success(res, 'Supplier created', responseDBCreate)
  } catch (error) {
    response.error(res, error.message)
  }
}
