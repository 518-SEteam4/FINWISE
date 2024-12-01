const express = require("express");
const User = require("../Models/User");
var nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
const formidable = require("formidable");
const UserInfoRoutesV2 = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const fs = require("fs");
const crypto = require('crypto');
const { default: axios } = require("axios");
require("dotenv").config();
const maxAge = 30 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});
AWS.config.update({
  accessKeyId: process.env.AWSACCESSKEYID,
  secretAccessKey: process.env.AWSSECRETACCESSKEY,
});
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.OTP_EMAIL,
    pass: process.env.OTP_EMAIL_PASSWORD,
  },
  port: 465,
});

const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("./Views"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./Views"),
  extName: ".handlebars",
};

transporter.use("compile", hbs(handlebarOptions));

const authenticateToken = (req, res, next) => {
  // Get the Authorization heade
  console.log(req.headers);
  const authHeader = req.headers["authorization"];

  console.log(authHeader);
  // Check if the Authorization header is present and starts with 'Bearer'
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  // Verify the token using your secret keß
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ error: "Token is invalid" });
    }

    const user = await User.findById(decodedToken.id);
    // Extract user ID from the token and attach it to the request object
    req.userId = user.id;

    // Call the next middleware or route handler
    next();
  });
};
const SendMail = async (req, res, require, username = "") => {
  var otp = Math.floor(Math.random() * 9000 + 1000);
  const mailData = {
    from: process.env.OTP_EMAIL,
    to: req.body.m,
    subject: otp + "- Verify Otp",
    template: "email",
    context: {
      name: "",
      code: otp,
      mail: req.body.m,
    },
  };
  transporter.sendMail(mailData, async function (err, info) {
    if (err) {
      console.log(err);
      res.json({
        message: err,
      });
    } else {
      if (require) {
        const user = await User.findOne({ m: req.body.m.toLowerCase() });
        user.otp = otp;
        await user.save();
      } else {
        const userinfo = new User({
          ...req.body,
          m: req.body.m.toLowerCase(),
          username: username,
        });
        userinfo.otp = otp;
        await userinfo.save();
      }
      res.json({
        status: true,
        navigate: "otp",
        message: "OTP sent to " + req.body.m,
      });
    }
  });
};

UserInfoRoutesV2.post("/Sendmail", async (req, res) => {
  try {
    const user = await User.findOne({ m: req.body.m.toLowerCase() });
    if (user) {
      SendMail(req, res, true);
    } else {
      res.json({
        status: false,
        message: "No account found with this mail",
      });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
UserInfoRoutesV2.post("/auth", async (req, res) => {
  try {
    console.log(req.body);
    var m = req.body.m.toLowerCase();
    const checkuser = await User.findOne({ m: m });

    console.log(checkuser);
    if (checkuser) {
      const token = createToken(checkuser._id);
      res.json({
        status: true,
        navigate: "login",
        Token: token,
      });
    } else {
      const userinfo = new User({
        ...req.body,
        m: req.body.m.toLowerCase(),
        username: req.body.username,
      });

      userinfo.save();

      const token = createToken(userinfo._id);
      res.json({
        status: true,
        navigate: "login",
        Token: token,
      });
      //  if(checkuser){
      //     await SendMail(req, res, true,"")
      //  }else{
      //     await SendMail(req, res, false,req.body.username)
      //  }
    }
  } catch (err) {
    res.send(err);
  }
});
UserInfoRoutesV2.post("/continue", async (req, res) => {
  try {
    console.log(req.body);
    var m = req.body.m.toLowerCase();
    const checkuser = await User.findOne({ m: m });

    console.log(checkuser);
    if (checkuser && checkuser.isverified) {
      if (await checkuser.comparePassword(req.body.p)) {
        console.log("came");
        const token = createToken(checkuser._id);
        res.json({
          status: true,
          navigate: "login",
          Token: token,
        });
      } else {
        console.log("came here");
        res.json({
          status: false,
          navigate: "login",
        });
      }
    } else {
      if (checkuser) {
        await SendMail(req, res, true, "");
      } else {
        await SendMail(req, res, false, req.body.username);
      }
    }
  } catch (err) {
    res.send(err);
  }
});

UserInfoRoutesV2.post("/userinfo", async (req, res) => {
  try {
    var m = req.body.m.toLowerCase();
    const checkuser = await User.findOne({ m: m });
    if (checkuser && checkuser.isverified) {
      res.send({
        error: "m",
        message: req.body.m + " already registered with careersstudio",
      });
    } else if (checkuser && !checkuser.isverified) {
      await User.deleteOne({ _id: checkuser._id });
      SendMail(req, res, false);
    } else {
      SendMail(req, res, false);
    }
  } catch (err) {
    res.send(err);
  }
});
UserInfoRoutesV2.post("/verifyotp", async (req, res) => {
  try {
    const user = await User.findOne({ m: req.body.m.toLowerCase() });

    console.log(req.body.otp, user.otp);
    if (Number(req.body.otp) === user.otp) {
      user.isverified = true;
      user.otp = "";
      user.save();
      const token = createToken(user._id);
      res.send({
        verified: true,
        message: "successfully verified otp",
        Token: token,
      });
    } else {
      res.send({
        verified: false,
        message: "entered incorrect otp",
      });
    }
  } catch (err) {
    res.send(err);
  }
});

UserInfoRoutesV2.post("/comparepassword", async (req, res) => {
  try {
    var m = req.body.m.toLowerCase();
    const checkuser = await User.findOne({ m: m });
    if (!checkuser || !checkuser.isverified) {
      res.send({
        error: "m",
        message: "Didnt find an careersstudio account with this mail",
      });
    } else {
      if (req.body.p === checkuser.p) {
        const token = createToken(checkuser._id);
        res.send({
          verified: true,
          Token: token,
        });
      } else {
        res.send({
          verified: false,
          message: "invaild Login Details",
        });
      }
    }
  } catch (err) {
    res.send(err);
  }
});

UserInfoRoutesV2.post("/VerifyUser/:Token", (req, res, next) => {
  const token = req.params.Token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        if (user)
          res.json({
            status: true,
            user: user.m,
            id: user._id,
            username: user.username,
          });
        else res.json({ status: false });
        next();
      }
    });
  } else {
    res.json({ status: false });
    next();
  }
});

UserInfoRoutesV2.get("/account/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const response = {
      m: user.m,
      fn: user.fn,
      ln: user.ln,
      l: user.l,
      Resumes: user.Resumes,
    };
    console.log(response);
    res.send(response);
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});
UserInfoRoutesV2.post("/updatepassword", async (req, res) => {
  try {
    const user = await User.findOne({ m: req.body.m });
    user.p = req.body.p;
    await user.save();
    res.send("Successfully updated Password");
  } catch (err) {
    res.send(err);
  }
});

const s3 = new AWS.S3();

UserInfoRoutesV2.post("/uploadimage", async (request, response) => {
  const form = new formidable.IncomingForm();

  const [fields, files] = await form.parse(request);
  console.log("came", files);

  // try {

  //     const originalFilename = request.file.originalname
  //     const type = originalFilename.split(".").pop()

  //     const fileName = `${Date.now().toString()}`;
  //     const data = await uploadFile(request.file.buffer, fileName, type);
  //     console.log(data)
  //     data.Location = "https://resumes.careersstudio.in/" + fileName + "." + type

  //     const ResumeUser = await User.findOne({ m: request.body.mail })

  //     if (ResumeUser.Resumes) {
  //         ResumeUser.Resumes.push({
  //             name: request.file.originalname,
  //             resume: data.Location
  //         })
  //     }

  //     ResumeUser.save()
  //     return response.status(200).send(data);
  // } catch (err) {
  //     console.log(err)
  //     return response.status(500).send(err);
  // }
});

UserInfoRoutesV2.post("/DeleteResume", async (req, res) => {
  try {
    const user = await User.findOne({ m: req.body.m });
    const Resumes = user.Resumes;
    const UpdatedResumes = Resumes.filter(
      (resume) => resume.resume != req.body.resume
    );
    user.Resumes = UpdatedResumes;

    user.save();

    res.send("done");
  } catch (err) {
    res.send(err);
  }
});

UserInfoRoutesV2.get("/places/:input", async (req, res) => {
  await axios
    .get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
        req.params.input +
        "&types=(cities)&components=country:in&key=AIzaSyDj4xadEEkLNPW21POkLuNqFWrsPEvUX6A"
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

UserInfoRoutesV2.post("/Preference/recomend", async (req, res) => {
  try {
    console.log(req.body);
    var user = await User.findById(req.body.id);
    console.log(user);
    user.Preference.recomend = {
      JobsYouWant: req.body.JobsYouWant,
      Year: req.body.Year,
      Experience: req.body.Experience,
    };
    console.log(user.Preference);
    user.save();
    res.send("Successfullly saved Preference");
  } catch (err) {
    console.log(err);
    res.send("Network Error");
  }
});
UserInfoRoutesV2.post("/forgotpassword", async (req, res) => {
  try {
    var user = await User.findOne({ m: req.body.m.toLowerCase() });
    if (user && user.isverified) {
      SendMail(req, res, true);
    } else {
      res.send({
        error: "m",
        message: req.body.m + " didn't find account",
      });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
UserInfoRoutesV2.post("/verifyotpforgot", async (req, res) => {
  try {
    console.log(req.body);
    var user = await User.findOne({ m: req.body.m.toLowerCase() });
    if (user.otp === req.body.otp) {
      user.p = req.body.p;
      user.save();
      console.log(user);
      res.send({
        verified: true,
        message: "successfully changed Password",
      });
    } else {
      res.send({
        verified: false,
        message: "entered incorrect otp",
      });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

UserInfoRoutesV2.post("/googlesignin", async (req, res) => {
  try {
    console.log(req.body);
    var user = await User.findOne({ m: req.body.m.toLowerCase() });
    if (user) {
      const token = createToken(user._id);
      res.send({
        verified: true,
        Token: token,
      });
    } else {
      const newuser = new User({
        p: "default",
        m: req.body.m.toLowerCase(),
        isverified: true,
      });
      await newuser.save();
      const token = createToken(newuser._id);
      res.send({
        verified: true,
        Token: token,
      });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

//get user info
const encryptionKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdbd" // Replace with a securely generated key
const algorithm = "aes-256-cbc"; 
const iv = crypto.randomBytes(16);

UserInfoRoutesV2.get("/getuserinfo", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const [storedIv, encryptedData] = user.mobile.split(':');
    const decipher = crypto.createDecipheriv(algorithm, encryptionKey, Buffer.from(storedIv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    res.send({
      ...user._doc,
      mobile: decrypted
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

//edit Profile

UserInfoRoutesV2.post("/editprofile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    (user.m = req.body.m),
      (user.username = req.body.username),
      (user.mobile = req.body.mobile),
      user.save();
    res.send("Successfully updated Profile");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

//change password

UserInfoRoutesV2.post(
  "/changepassword",
  authenticateToken,
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      user.p = req.body.p;
      user.save();
      res.send("Successfully updated Password");
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
);

module.exports = UserInfoRoutesV2;
