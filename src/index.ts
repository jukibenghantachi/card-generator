import express, { Request, Response } from 'express';
import { instagram } from './lib/instagram';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/instagram', async (req: Request, res: Response) => {
	const { username } = req.query;
	if (!username) return res.status(400).send({ status: 400, msg: 'Missing query username' });

	const result = await instagram(username.toString());
	if (!result) return res.status(400).send({ status: 400, msg: 'Username not found.' });
	res.contentType('image/png').send(result);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
