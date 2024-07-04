const { promisify } = require('util')

const sgMail = require('@sendgrid/mail')
const jwt = require('jsonwebtoken')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const signToken = promisify(jwt.sign)
const verifyToken = promisify(jwt.verify)

const options = {
  from: 'ceitl.simon@gmail.com', // Change to your verified sender
  subject: 'Please Verify Your Email',
}

const sendVerificationEmail = async (email) => {
  const token = await signToken({ email }, process.env.JWT_SECRET, {
    expiresIn: '2h'
  })

  const html = `<p>Please click the following link to verify your email:</p><p><a href="${process.env.HOST}/verify?token=${token}">Verify Email</a></p>`

  const msg = {
    to: email,
    html,
    ...options,
  }

  await sgMail.send(msg).then(() => console.log('Email sent'))
}

const parseToken = async (token) => {
  const decoded = await verifyToken(token, process.env.JWT_SECRET)
  return decoded.email
}

module.exports = {
  sendVerificationEmail,
  parseToken,
}