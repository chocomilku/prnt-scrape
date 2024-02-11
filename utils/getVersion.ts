import { version } from "./version";

export const getVersion = () => {
	const npmEnv = process.env.npm_package_version;
	if (npmEnv == undefined) return version;
	return npmEnv;
};
