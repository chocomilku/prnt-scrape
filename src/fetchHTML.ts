import axios, { AxiosError, isAxiosError } from "axios";

interface FetchHTMLResponse {
	html: string;
	status: number;
	error: string | null;
}

export const fetchHTML = async (url: string): Promise<FetchHTMLResponse> => {
	try {
		const response = await axios.get<string>(url, {
			headers: {
				"User-Agent": "Mozilla/5.0",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Encoding": "gzip, deflate, br",
				"Accept-Language": "en-US,en;q=0.5",
				Connection: "keep-alive",
			},
		});
		const data = { html: response.data, status: response.status, error: null };

		return data;
	} catch (err) {
		if (!isAxiosError(err)) {
			console.error(err);
			process.exit(1);
		}

		const data = {
			html: "",
			status: (err as AxiosError).response?.status ?? 500,
			error:
				(err as AxiosError).response?.statusText ?? "Unknown error occured",
		};

		return data;
	}
};
