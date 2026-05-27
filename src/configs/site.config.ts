import type { SiteConfig, Social } from "./types";

const siteConfig: SiteConfig = {
	site: {
		title: "Government Polytechnic Kashipur PYQs",
		description:
			"A collection of student contributed previous year question papers for Government Polytechnic Kashipur semester/year examinations.",
		url: "https://gpkashipur.in/pvqs",
		githubRepo: "adnanis78612/gpkashipur-pyqs",
		logo: "/logo.png",
		favicon: "/favicon.ico",
		timezone: "Asia/Kolkata",
	},

	header: {
		links: [
			{
				type: "internal",
				name: "Contribute",
				url: "/contribute",
			},
			{
				type: "internal",
				name: "About",
				url: "/about",
			},
		],
	},

	footer: {
		maintainer: {
			name: "Mohd ADNAN",
			designation: "Government Polytechnic Kashipur",
		},

		links: [
			{
				type: "internal",
				name: "Contribute",
				url: "/contribute",
			},
			{
				type: "internal",
				name: "About",
				url: "/about",
			},
		],
	},
};

export default siteConfig;

export const SOCIALS: Social[] = [];