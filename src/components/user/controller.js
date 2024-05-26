import { consults } from "../../db/consultsUser.js"


// Mostrar información del usuario según su ID
const getUserController = async (req, res) => {
  const { id } = req.query
  try {
    const user = await consults.getConfigUser(id)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message })
  }
}

// Actualizar información del usuario
const updateUserController = async (req, res) => {
  const { id } = req.query
  const userData = req.body
  try {
    const updatedUser = await consults.updateUser(id, userData)
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message })
  }
}

// Eliminar usuario
const deleteUserController = async (req, res) => {
  const { id } = req.query
  try {
    const deletedUser = await consults.deleteUser(id)
    res.json(deletedUser)
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message })
  }
}


const favoritoController = async (req, res) => {
  const {idUser, idPackage} = req.query;
  try {
    const setFavorite = await consults.favoriteUser(idUser, idPackage);
    res.json(setFavorite)
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar a Favoritos', error: error.message })
  }
}

const getHistoryController = async (req, res) => {
  const { idUser } = req.query;
  try {
    const deletedUser = await consults.getAllCheckOut(idUser)
    res.json(deletedUser)
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message })
  }
}

export { getUserController, updateUserController, deleteUserController, favoritoController, getHistoryController }