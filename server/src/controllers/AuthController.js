const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const user = require('../../models/user.js');
const profile = require('../../models/profile.js');

async function register(req, res) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "1",
      message: error.details[0].message
    });
  }

  try {
    const userData = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userData) {
      return res.status(400).send({
        status: "1",
        message: "Email is already registered"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await user.create({
      email: req.body.email,
      password: hashPassword,
      status: "USER"
    });

   await profile.create({
      idUser : newUser.id
    })

    const dataToken = { id: newUser.id };
    const token = jwt.sign(dataToken, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "0",
      message: "Registration Success",
      data: {}
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Processing Error"
    });
  }
}

async function login(req, res) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "1",
      message: error.details[0].message
    });
  }

  try {
    const userData = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!userData) {
      return res.status(400).send({
        status: "1",
        message: "Invalid Username/Password"
      });
    }

    const validPassword = await bcrypt.compare(req.body.password, userData.password);

    if (!validPassword) {
      return res.status(400).send({
        status: "1",
        message: "Invalid Username/Password"
      });
    }

    const dataToken = { id: userData.id,status: userData.status};
    const token = jwt.sign(dataToken, process.env.TOKEN_KEY, { expiresIn: '30m' });

    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      maxAge: 1800, // Durasi cookie dalam detik (contoh: 30 menit)
      sameSite: 'none', // Memungkinkan pengiriman lintas situs
      path: '/', // Path di mana cookie tersedia
      secure: true // Hanya kirim cookie melalui HTTPS (untuk production)
  }));

    res.status(200)
       .setHeader('Location', userData.status == 'USER' ? '/form' : '/') 
       .send({
         status: "0",
         message: "Login Success",
         data: {}
       });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "1",
      message: "Server Processing Error"
    });
  }
}

async function checkAuth(req, res) {
  try {
    const id = req.user.id;

    const dataUser = await user.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"]
      }
    });

    if (!dataUser) {
      return res.status(404).setHeader('Location', '/login').send({
        status: "1",
        message: "Unauthorized: Invalid token"
      });
    }

    const responseData = {
      email: dataUser.email,
    }

    res.status(200).setHeader('Location', dataUser.status == 'USER' ? '/form' : '/').send({
      status: "0",
      data: responseData
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "1",
      message: "Server Processing Error"
    });
  }
}

async function logout(req,res){
  const token = cookie.parse(req.headers.cookie || '');
  console.log(token)
  if (!token) {
    return res.status(401).send({
      status: "1",
      message: "Unauthorized: No token found"
    });
  }

  res.setHeader('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    maxAge: -1,
    sameSite: 'strict',
    path: '/'
  }));

  res.status(200).send({
    status: "0",
    message: "Logout successful"
  });

}

module.exports = { register, login, checkAuth, logout };
