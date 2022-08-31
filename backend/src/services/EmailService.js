'use strict';

const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, body) => {
	const transporter = nodemailer.createTransport({
		service: process.env.MAIL_SERVICE,
		auth: {
			user: process.env.MAIL_USERNAME,
			pass: process.env.MAIL_PASSWORD
		}
	});

	const mailOptions = {
		from: process.env.MAIL_FROM,
		to: to,
		subject: subject,
		html: body
	};

	return await new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				reject(err);
			} else {
				resolve(info);
			}
		});
	});
};

module.exports = {
	sendEmail
};
