import { defineCollection } from "astro:content";
import { filesystemLoader } from "@/lib/content/loader";
import { Pyq } from "@/lib/pyqs";

const fsEntryCollection = defineCollection({
	loader: filesystemLoader({
		root: "./public/pyqs",

		validators: {
			file: {
				".pdf": () => true,
				"*": () => true,
			},
		},
	}),
});

export const collections = {
	fs: fsEntryCollection,
};