require("dotenv").config()
const nodemailer = require("nodemailer");

const senderEmail = process.env.MAIL_ID;
const password = process.env.PWD;
const subject = "Notification from chat"
const BASE_URL = "http://localhost:3030"

const emailBody = "<html>\n" +
    "      <head>\n" +
    "        <style>\n" +
    "          /* CSS styles for the email body */\n" +
    "          body {\n" +
    "            background-color: #f2f2f2;\n" +
    "            font-family: Arial, sans-serif;\n" +
    "            color: #333333; display: flex; justify-content: center;\n" +
    "          }\n" +
    "\n" +
    "          h1 {\n" +
    "            color: #ff0000;\n" +
    "          }\n" +
    "\n" +
    "          p {\n" +
    "            font-size: 16px;\n" +
    "          }\n" +
    "        </style>\n" +
    "      </head>\n" +
    "      <body>\n" +
    "        <h1>Automated Email Sent via my Server!</h1>\n" +
    "      </body>\n" +
    "    </html>"

const options = {
    from: senderEmail,
    to: "ruchinov@gmail.com",
    cc: [],
    bcc: [],
    subject: subject,
    html: emailBody
}

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: senderEmail,
        pass: password
    }
})

module.exports = {transporter, options}