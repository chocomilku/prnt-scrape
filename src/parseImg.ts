import * as cheerio from "cheerio";

export const parseImg = (html: string) => {
	const $ = cheerio.load(html);
	const imgSrc = $("#screenshot-image").attr("src");
	return imgSrc;
};
