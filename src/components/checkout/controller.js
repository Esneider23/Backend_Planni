import { consults } from "../../db/consultsCheckout.js"


// Mostrar información del usuario según su ID
const setCheckoutController = async (req, res) => {
  const { idPackage, idUser } = req.query
  try {
    const setCheckout = await consults.checkout(idPackage, idUser)
    res.json(setCheckout)
  } catch (error) {
    res.status(500).json({ message: 'Error al finilizar la compra', error: error.message })
  }
}


export { setCheckoutController }