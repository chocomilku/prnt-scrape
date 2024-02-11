import { validateURL } from "./src/validateURL";
import { parseImg } from "./src/parseImg";
import { fetchHTML } from "./src/fetchHTML";
import * as clack from "@clack/prompts";

const main = async () => {
	const group = await clack.group(
		{
			intro: () => clack.intro("prnt.sc scraper"),
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
	spin.start(`Fetching ${group.siteArgument}`);

	const fetchSite = await fetchHTML(group.siteArgument);
	if (fetchSite.status !== 200) {
		console.error(`Error: ${fetchSite.error}`);
		process.exit(1);
	}

	const imgSrc = parseImg(fetchSite.html);
	if (!imgSrc) {
		spin.stop(`Error: Could not find image`);
		process.exit(1);
	}

	// st.prntscr.com is the domain of an image telling the screenshot was removed.
	if (imgSrc.includes("st.prntscr.com")) {
		spin.stop("Error: This screenshot was removed.");
		process.exit(1);
	}

	spin.stop(`Successfully scraped direct link`);
	console.log(imgSrc);
};

main();
