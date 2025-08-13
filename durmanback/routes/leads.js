// routes/leads.js
const express = require('express')
const router = express.Router()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.post('/leads', async (req, res) => {
  const { nombre, email, empresa, telefono, mensaje } = req.body

  // Guardar en BD (opcional)
  // await db.query('INSERT INTO leads ...')

  try {
    const msg = {
      to: process.env.CORREO_DESTINO,
      from: 'logistiq@tudominio.com',
      subject: `Nuevo lead de ${nombre}`,
      html: `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${empresa}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Mensaje:</strong><br>${mensaje}</p>
      `
    }
    await sgMail.send(msg)
    res.json({ message: 'Enviado' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error al enviar el correo' })
  }
})

module.exports = router
