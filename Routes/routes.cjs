const express = require('express')
const fs = require('fs')
const {transporter, options} = require("../services/emailer.cjs");
const router = express.Router()

router.post("/email", async (req, res) =>{
    try {
        let optionsUser = options
        const {user, message, toMailer} = req.body;
        console.log(user, message, toMailer)
        let emailTemp = fs.readFileSync("./services/emailTemplate.html", "utf-8")
        let emailHTML = emailTemp.replace("{{user}}", user).replace("{{message}}", message)
        optionsUser.html = emailHTML;
        optionsUser.to = toMailer;

        await transporter.sendMail(options, (err, info) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                    message: err
                })
            } else {
                console.log(`Email sent successfully!`)
                res.status(201).json({
                    message: info
                })
            }
        })
    } catch (e) {
        console.log(e)
    }
})

module.exports = router