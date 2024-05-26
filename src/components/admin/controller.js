import { consults } from "../../db/consultsAdmin.js"
import { consults as consultsUser } from "../../db/consultsUser.js"
import { registryUserClient } from "../sing-up/controller.js"


// Mostrar información del usuario según su ID
const AllUsersController = async (req, res) => {
  try {
    const AllUser = await consults.getAllusers()
    res.json(AllUser)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener listado de usuario', error: error.message })
  }
}

const createUserController = async (req, res) => {
  try {
    const AllUser = await registryUserClient(req, res)
    res.json(AllUser)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear un usuario', error: error.message })
  }
}

// Actualizar información del usuario
const updateUserController = async (req, res) => {
  const { id } = req.param
  const userData = req.body
  try {
    const updatedUser = await consultsUser.updateUser(id, userData)
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message })
  }
}

// Eliminar usuario
const deleteUserController = async (req, res) => {
  const { id } = req.param;
  try {
    const deletedUser = await consultsUser.deleteUser(id)
    res.json(deletedUser)
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message })
  }
}

export { AllUsersController, createUserController, deleteUserController, updateUserController }