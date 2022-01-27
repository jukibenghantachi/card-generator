import { createCanvas, GlobalFonts, Image } from '@napi-rs/canvas';
import { readFileSync } from 'fs';
import { join } from 'path';
import axios from 'axios';

export async function instagram(username: string): Promise<Buffer | boolean> {
	try {
		const { data } = await axios.get(`https://www.instagram.com/${username}?__a=1`);
		const bufferAvatar = await axios.get(data.graphql.user.profile_pic_url_hd, {
			responseType: 'arraybuffer'
		});

		const file = readFileSync(join(__dirname, '../../../public/images/instagram/template.png'));
		GlobalFonts.registerFromPath(
			join(__dirname, '../../../public/fonts/Poppins/Poppins-Bold.ttf'),
			'Poppins Bold'
		);
		GlobalFonts.registerFromPath(
			join(__dirname, '../../../public/fonts/Poppins/Poppins-Regular.ttf'),
			'Poppins'
		);

		const result = {
			fullName: data.graphql.user.full_name,
			avatar: bufferAvatar.data,
			post: data.graphql.user.edge_owner_to_timeline_media.count,
			followers: data.graphql.user.edge_followed_by.count,
			following: data.graphql.user.edge_follow.count,
			count: (number: string) =>
				Number(number)
					.toString()
					.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
		};

		const image = new Image();
		image.src = file;
		const avatar = new Image();
		avatar.src = result.avatar;

		const canvas = createCanvas(400, 150);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);

		ctx.font = '15px "Poppins Bold"';
		ctx.fillStyle = '#F2F1F0';
		ctx.fillText(result.fullName, 93, 55);

		ctx.font = '8px "Poppins"';
		ctx.fillStyle = '#F2F1F0';
		ctx.textAlign = 'center';
		ctx.fillText(result.count(result.post), 50, 113);

		ctx.font = '8px "Poppins"';
		ctx.fillStyle = '#F2F1F0';
		ctx.textAlign = 'center';
		ctx.fillText(result.count(result.followers), 200, 113);

		ctx.font = '8px "Poppins"';
		ctx.fillStyle = '#F2F1F0';
		ctx.textAlign = 'center';
		ctx.fillText(result.count(result.following), 350, 113);

		ctx.beginPath();
		ctx.arc(50.3, 49.5, 30, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(avatar, 13, 12, 75, 75);

		return canvas.toBuffer('image/png');
	} catch (err: any) {
		console.log(err);
		return false;
	}
}
