'use strict';

const jimp = require('jimp');
const path = require('path');

const upload = async data => {
	try {
		const content = Buffer.from(data.content.split(',')[1], 'base64');
		const filepath = path.resolve(`${data.path}/${data.filename}.jpg`);
		const image = await jimp.read(content);

		if (data.width && data.height) {
			await image.resize(data.width, data.height);
		}

		await image.writeAsync(filepath);
		return filepath;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	upload
};
