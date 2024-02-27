const nodemailer = require('nodemailer');
const hbs = require("hbs");
const path = require("path");
const fs = require('fs');
const template_path = path.join(__dirname, "../templates/views"); //for templates files(hbs)
// const source = fs.readFileSync(path.join(template_path, 'resetPassword.hbs'), 'utf8');
// const template = hbs.compile(source);

const sendMail = async (userData,randomuuid) => {
    try {
        const { email, firstName, lastName } = userData;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: process.env.HOST_NODEMAILER,
            port: process.env.PORT_NODEMAILER,
            secure: true,
            auth: {
                user: process.env.FORM_EMAIL_NODEMAILER,
                pass: process.env.FORM_PASS_NODEMAILER,
            },
        });

        // Sending the mail to users:
        const mailOptions = {
            from: process.env.FORM_EMAIL_NODEMAILER,
            to: email,
            subject: 'Your Link For Reset Password',
            html: template({ firstName, lastName,randomuuid }),
            text: `Your Link For Reset Password`
        };

        const sendingMail = await transporter.sendMail(mailOptions);
        return sendingMail; // Optionally, you can return the result if needed.
    } catch (error) {
        console.error("Error in sendMail function:", error);
        throw error; // Throw the error to handle it in the calling function.
    }
};

module.exports = sendMail;
