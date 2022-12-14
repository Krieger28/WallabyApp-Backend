const  User  = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/config");

module.exports = {
  // Login
  signIn(req, res) {
    let { email, password} = req.body;

    // Buscar usuario
    User.findOne({
        email: email,
    })
      .then((user) => {
        if (!user) {
          res
            .status(404)
            .json({ msg: "Usuario con este correo no encontrado" });
        } else {
          if (bcrypt.compareSync(password, user.password)) {
            // Creamos el token
            let token = jwt.sign({ user: user }, authConfig.secret, {
              expiresIn: authConfig.expires,
            });

            res.json({
              user: user,
              token: token,
            });
          } else {
            // Unauthorized Access
            res.status(401).json({ msg: "Contraseña incorrecta" });
          }
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Registro
  signUp(req, res) {
    // Encriptamos la contraseña
    
    let password = bcrypt.hashSync(
      req.body.password,
      authConfig.rounds
    );

    // Crear un usuario
     User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: password,
    })
      .then((user) => {
        // Creamos el token
        let token = jwt.sign({ user: user }, authConfig.secret, {
          expiresIn: authConfig.expires,
        }.then(async ()=>{
          await user.save()
        }));
       
        res.json({
          user: user,
          token: token,
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

};