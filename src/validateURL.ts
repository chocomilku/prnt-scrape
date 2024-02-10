const PROTOCOLS = ["http:", "https:"];
const VALID_HOSTNAME = "prnt.sc";

export const validateURL = (url: string) => {
	try {
		const testURL = new URL(url);
		if (!PROTOCOLS.includes(testURL.protocol)) return false;
		if (testURL.hostname !== VALID_HOSTNAME) return false;

		return true;
	} catch (err) {
		return false;
	}
};
