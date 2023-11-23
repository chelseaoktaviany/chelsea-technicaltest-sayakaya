const nodemailer = require("nodemailer");

module.exports = class Email {
  constructor(user, code) {
    this.to = user.email;
    this.code = code;
    this.from = `<testadmin@mail.com>`;
  }

  newTransport() {
    // dev
    const createTransporter = (userEtherealData) => {
      let transporter = nodemailer.createTransport({
        host: userEtherealData.smtp.host,
        port: userEtherealData.smtp.port,
        secure: userEtherealData.smtp.secure,
        logger: true,
        auth: {
          user: userEtherealData.user,
          pass: userEtherealData.pass,
        },
      });
    };

    return nodemailer.createTestAccount((err, account) => {
      if (err) {
        console.error("Failed to create a testing account", err.message);
        return process.exit(1);
      } else {
        console.log("Credentials obtained, sending the message..");
        createTransporter(account);
      }
    });
  }

  async send(template, subject, body) {
    // mengirim e-mail yang asli
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text,
    };

    // membuat transport dan mengirim e-mail
    await this.newTransport().sendMail(mailOptions);
  }
};
