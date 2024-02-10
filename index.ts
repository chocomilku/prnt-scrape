import { argv } from "node:process";
import { validateURL } from "./src/validateURL";
import { parseImg } from "./src/parseImg";
import { fetchHTML } from "./src/fetchHTML";

const siteArg = argv[2];

const main = async () => {
	const isURLValid = validateURL(siteArg);
	if (!isURLValid) {
		console.error("Invalid URL");
		process.exit(1);
	}
	const site = new URL(siteArg);

	const fetchSite = await fetchHTML(site);
	if (fetchSite.status !== 200) {
		console.error(`Error: ${fetchSite.error}`);
		process.exit(1);
	}

	const imgSrc = parseImg(fetchSite.html);
	if (!imgSrc) {
		console.error("Error: Could not find image");
		process.exit(1);
	}

	console.log(imgSrc);
};

main();
