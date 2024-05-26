import { response } from '../../network/response.js'
import { hashPassword } from '../../utils/bcrypt/hashPassword.js'
import { consults } from '../../db/consults_users.js'

const registryUserClient = async (req, res) => {
  try {
    const { password, password_conf: passwordConf, email, id_country } = req.body;

    if (password !== passwordConf) {
      return response.error(
        res,
        'Password and password confirmation do not match',
        400
      );
    }

    const hashedPassword = await hashPassword(password);
    const responseDB = await consults.getUser(email);

    if (responseDB.length === 1) {
      return response.error(res, 'User already exists', 400);
    }

    await consults.createUserClient(email, hashedPassword, id_country);

    response.success(res, 'User created successfully', { email , hashedPassword });
  } catch (error) {
    response.error(res, error.message);
  }
};


const registryOtherUserType = async (req, res) => {
  try {
    const {
      username,
      name_user,
      lastname_user,
      id_country,
      email,
      password,
      phone,
      address,
      id_rol
    } = req.body

    const hashedPassword = await hashPassword(password)
    const responseDB = await consults.getUser(email)

    if (responseDB.length === 1) {
      return response.error(res, 'User already exists', 400)
    }

    await consults.createUserOtherType(
      username,
      name_user,
      lastname_user,
      id_country,
      email,
      hashedPassword,
      phone,
      address,
      id_rol
    )
    response.success(res, 'Password hashed', { hashedPassword, email })
  } catch (error) {
    response.error(res, error.message)
  }
}

export { registryUserClient, registryOtherUserType }
