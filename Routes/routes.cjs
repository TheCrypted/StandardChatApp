const express = require('express')
const fs = require('fs')
const {transporter, options} = require("../services/emailer.cjs");
const router = express.Router()

router.post("/email", async (req, res) =>{
    const {user, message} = req.headers;

    let emailTemp = fs.readFileSync("../services/emailTemplate.html", "utf-8")
    let emailHTML = emailTemp.replace("{{user}}", user)

    transporter.sendMail(options, (err, info) =>{
        if (err) {
            console.log(err)
        } else {
            console.log(`Email sent successfully!`)
        }
    })
})

module.exports = router