import type { SiteConfig, Social } from "./types";

const siteConfig: SiteConfig = {
	site: {
		title: "Government Polytechnic Kashipur Previous Year Question Papers (GP Kashipur PYQs)",
		description:
			"Download Government Polytechnic Kashipur previous year question papers (PYQs) for Diploma Pharmacy, CSE, Mechanical, Civil, IT, Electronics, Chemical and other branches. Mid sem, end sem and back papers available free.",
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
			name: "ADNAN",
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