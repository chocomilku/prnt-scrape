import { validateURL } from "./src/validateURL";
import { parseImg } from "./src/parseImg";
import { fetchHTML } from "./src/fetchHTML";
import * as clack from "@clack/prompts";
import pc from "picocolors";
import { getVersion } from "./utils/getVersion";
import {
	BaseError,
	FetchError,
	ResourceError,
	ScrapeError,
} from "./src/errors";

let count = 1;

const main = async () => {
	console.clear();

	const group = await clack.group(
		{
			intro: () =>
				clack.intro(
					`${pc.bgWhite(pc.black(pc.bold(`prnt-scrape v${getVersion()}`)))} ${
						count > 1 ? pc.dim(`#${count}`) : ""
					}`
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
				clack.cancel("Program Stopped.");
				process.exit(0);
			},
		}
	);

	const spin = clack.spinner();

	try {
		spin.start(pc.magenta(`Fetching ${group.siteArgument}`));

		const fetchSite = await fetchHTML(group.siteArgument);
		if (fetchSite.status !== 200)
			throw new FetchError(fetchSite.error as string | undefined);

		const imgSrc = parseImg(fetchSite.html);
		if (!imgSrc) {
			throw new ScrapeError("Could not find image.");
		}

		// TODO: implement arrays
		const ERROR_DOMAIN = "st.prntscr.com";

		// st.prntscr.com is the domain of an image telling the screenshot was removed.
		if (imgSrc.includes(ERROR_DOMAIN))
			throw new ResourceError("Screenshot has been removed.");

		spin.stop(pc.blue("Successfully scraped direct link"));
		clack.note(`${pc.green(pc.bold(pc.underline(imgSrc)))}`);
	} catch (err) {
		if (err instanceof BaseError) {
			if (err.dangerous) {
				spin.stop(
					pc.bgRed(pc.white(pc.bold(`${err.name}: ${err.message}`))),
					2
				);
				process.exit(1);
			} else {
				spin.stop(
					`${pc.bgRed(pc.white(pc.bold(err.name)))}: ${pc.red(err.message)}`,
					2
				);
			}
		} else {
			clack.log.error(
				pc.bgRed(pc.white(pc.bold("An unexpected error occurred.")))
			);
			console.error(err);
			process.exit(1);
		}
	} finally {
		count++;
		const shouldRepeat = await clack.confirm({
			message: "Scrape another?",
		});

		if (shouldRepeat.valueOf() == false) {
			clack.outro(pc.dim("Closing program..."));
			process.exit(0);
		}
		main();
	}
};

main();
