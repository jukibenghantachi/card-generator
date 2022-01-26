import { createCanvas, loadImage, registerFont } from 'canvas';
import axios from 'axios';
import path from 'path';

export async function instagram(username: string): Promise<Buffer | boolean> {
	try {
		const { data } = await axios.get(`https://www.instagram.com/${username}?__a=1`);

		const canvas = createCanvas(400, 150);
		const ctx = canvas.getContext('2d');

		const result = {
			fullName: data.graphql.user.full_name,
			avatar: data.graphql.user.profile_pic_url_hd,
			post: Number(data.graphql.user.edge_owner_to_timeline_media.count)
				.toString()
				.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
			followers: Number(data.graphql.user.edge_followed_by.count)
				.toString()
				.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'),
			following: Number(data.graphql.user.edge_follow.count)
				.toString()
				.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
		};

		const template = await loadImage(
			path.join(__dirname, '../../../public/images/instagram/template.png')
		);
		const avatar = await loadImage(result.avatar);

		registerFont(path.join(__dirname, '../../../public/fonts/Poppins/Poppins-Bold.ttf'), {
			family: 'Poppins Bold'
		});

		ctx.drawImage(template, 0, 0);

		ctx.font = '15px "Poppins Bold"';
		ctx.fillStyle = '#F2F1F0';
		ctx.fillText(result.fullName, 93, 55);

		ctx.font = '8px "Poppins Bold"';
		ctx.fillStyle = '#F2F1F0';
		ctx.textAlign = 'center';
		ctx.fillText(result.post, 50, 113);

		ctx.font = '8px "Poppins Bold"';
		ctx.fillStyle = '#F2F1F0';
		ctx.textAlign = 'center';
		ctx.fillText(result.followers, 200, 113);

		ctx.font = '8px "Poppins Bold"';
		ctx.fillStyle = '#F2F1F0';
		ctx.textAlign = 'center';
		ctx.fillText(result.following, 350, 113);

		ctx.beginPath();
		ctx.arc(50.3, 49.5, 30, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(avatar, 13, 12, 75, 75);

		return canvas.toBuffer('image/png');
	} catch (err: any) {
		return false;
	}
}
