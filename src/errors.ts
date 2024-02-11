export class BaseError extends Error {
	public dangerous: boolean;

	constructor(message?: string) {
		super(message);
		this.name = this.constructor.name;
		this.dangerous = false;
	}
}

export class FetchError extends BaseError {}
export class ScrapeError extends BaseError {}
export class ResourceError extends BaseError {}
