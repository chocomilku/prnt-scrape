import { argv } from "node:process";
import axios from "axios";
import * as cheerio from "cheerio";

const site = argv[2];

const fetchSite = async (url: string) => {
	const response = await axios(url);
	const body = await response.data;
	return body;
};

const parseImg = (body: unknown) => {
	const $ = cheerio.load(body as string);
	const h = $("#screenshot-image").attr("src");
	console.log(h);
};

const the = async () => {
	const res = await fetchSite(site);
	parseImg(res);
};

the();
