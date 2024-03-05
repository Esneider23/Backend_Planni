import { response } from '../../network/response.js'
import { hashPassword } from '../../utils/bcrypt/hashPassword.js'
import { consults } from '../../db/consults.js'

const registryUserClient = async (req, res) => {
  try {
    const { password, password_conf: passwordConf, email, country } = req.body

    if (password !== passwordConf) {
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

    await consults.createUserClient(email, hashedPassword, country)

    response.success(res, 'Password hashed', { hashedPassword, email })
  } catch (error) {
    response.error(res, error.message)
  }
}

const registryOtherUserType = async (req, res) => {
  try {
    const {
      username,
      name_user: nameUser,
      lastname_user: lastnameUser,
      id_country: idCountry,
      email,
      password,
      phone,
      addrees,
      id_rol: idRol
    } = req.body

    const hashedPassword = await hashPassword(password)
    const responseDB = await consults.getUser(email)

    if (responseDB.length === 1) {
      response.error(res, 'User already exists', 400)
    }

    await consults.createUserOtherType(
      username,
      nameUser,
      lastnameUser,
      idCountry,
      email,
      hashedPassword,
      phone,
      addrees,
      idRol
    )

    response.success(res, 'Password hashed', { hashedPassword, email })
  } catch (error) {
    response.error(res, error.message)
  }
}

const registrySupplierUser = async (req, res) => {
  try {
    const {
      name_supplier: nameSupplier,
      nit_supplier: nitSupplier,
      email_supplier: emailSupplier,
      id_country_supplier: idCountrySupplier,
      addres_supplier: addresSupplier,
      phone_supplier: phoneSupplier,
      id_type_supplier: idTypeSupplier
    } = res.body

    const responseDB = await consults.consults_supplier(
      nameSupplier,
      emailSupplier,
      nitSupplier
    )

    if (responseDB.length === 1) {
      response.error(res, 'Supplier already exists', 400)
    }

    const responseDBCreate = await consults.createUserSupplier(
      nameSupplier,
      nitSupplier,
      emailSupplier,
      idCountrySupplier,
      addresSupplier,
      phoneSupplier,
      idTypeSupplier
    )

    response.success(res, 'Supplier created', responseDBCreate)
  } catch (error) {
    response.error(res, error.message)
  }
}

export { registryUserClient, registryOtherUserType, registrySupplierUser }
