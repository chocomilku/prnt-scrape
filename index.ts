import { validateURL } from "./src/validateURL";
import { parseImg } from "./src/parseImg";
import { fetchHTML } from "./src/fetchHTML";
import * as clack from "@clack/prompts";
import pc from "picocolors";
import { getVersion } from "./utils/getVersion";

const main = async () => {
	console.clear();

	const group = await clack.group(
		{
			intro: () =>
				clack.intro(
					`${pc.bgWhite(pc.black(pc.bold(`prnt-scrape v${getVersion()}`)))}`
				),
			siteArgument: () =>
				clack.text({
					message: "Enter a prnt.sc URL:",
					placeholder: "https://prnt.sc/________",
					validate(value) {
						const validationResults = validateURL(value);
						const invalidResults = validationResults.filter((result) => {
							return result.isValid == false;
						});
						if (invalidResults.length != 0) {
							return invalidResults[0].errorMessage;
						}
					},
				}),
		},
		{
			onCancel() {
				clack.cancel("Process Stopped.");
				process.exit(0);
			},
		}
	);

	const spin = clack.spinner();
	spin.start(pc.magenta(`Fetching ${group.siteArgument}`));

	const fetchSite = await fetchHTML(group.siteArgument);
	if (fetchSite.status !== 200) {
		spin.stop(pc.red("Fetching Error: ${fetchSite.error}"), 2);
		process.exit(1);
	}

	const imgSrc = parseImg(fetchSite.html);
	if (!imgSrc) {
		spin.stop(pc.red("Scraping Error: Could not find image."), 2);
		process.exit(1);
	}

	// st.prntscr.com is the domain of an image telling the screenshot was removed.
	if (imgSrc.includes("st.prntscr.com")) {
		spin.stop(pc.red("Screenshot has been removed."), 2);
		process.exit(1);
	}

	spin.stop(pc.blue("Successfully scraped direct link"));
	clack.note(`${pc.green(pc.bold(pc.underline(imgSrc)))}`);
};

main();
