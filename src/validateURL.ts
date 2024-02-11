const PROTOCOLS = ["http:", "https:"];
const VALID_HOSTNAME = "prnt.sc";

export const validateURL = (
	url: string
): { isValid: boolean; errorMessage: string }[] => {
	try {
		let results: { isValid: boolean; errorMessage: string }[] = [];
		const site = new URL(url);

		results.push({
			isValid: isProtocolValid(site),
			errorMessage: `Protocol used may be spelled incorrectly or not supported. Supported protocols: ${PROTOCOLS.join(
				", "
			)}`,
		});
		results.push({
			isValid: isHostnameValid(site),
			errorMessage:
				"Invalid hostname. Only prnt.sc URLs are supported. Example: https://prnt.sc/________",
		});

		return results;
	} catch (err) {
		if (err instanceof TypeError) {
			return [
				{
					isValid: false,
					errorMessage: err.message,
				},
			];
		} else {
			return [
				{
					isValid: false,
					errorMessage: "Something went wrong.",
				},
			];
		}
	}
};

const isProtocolValid = (url: URL) => {
	return PROTOCOLS.includes(url.protocol);
};

const isHostnameValid = (url: URL) => {
	return url.hostname === VALID_HOSTNAME;
};
