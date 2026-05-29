import { toTitleCase } from "@/utils/string";
import type { FsEntry } from "./content/schema";

const months = [
	"jan",
	"feb",
	"mar",
	"apr",
	"may",
	"jun",
	"jul",
	"aug",
	"sep",
	"oct",
	"nov",
	"dec",
];

class Pyq {
	static $pattern =
		/^(?<subjects>(?:(?:[a-z]+[A-Z0-9]+)_(?:(?:[A-Z0-9]+)_)?)+)(?<type>(?:midsem)|(?:endsem)|(?:sessional))_(?:(?<no>[0-9])_)?(?:(?<back>back)_)?(?<year>20[0-9]{2})(?:_(?<month>(?:jan)|(?:feb)|(?:mar)|(?:apr)|(?:may)|(?:jun)|(?:jul)|(?:aug)|(?:sep)|(?:oct)|(?:nov)|(?:dec)))?(?:_(?<date>[0-9]{1,2}))?(?:_set(?<set>[A-Z0-9]+))?$/;

	data: {
		subjects: {
			subject_code: string;
			specialization_code: string | null;
		}[];
		type: string;
		no: number | null;
		back: boolean;
		year: number;
		month: number | null;
		date: number | null;
		set: string | null;
	};

	entry: FsEntry<"file">;

	constructor(entry: FsEntry<"file">) {
		const match = Pyq.$pattern.exec(entry.name);

		// SAFE FALLBACK
		if (!match || !match.groups) {
			this.entry = entry;

			this.data = {
				subjects: [],
				type: "unknown",
				no: null,
				back: false,
				year: 2025,
				month: null,
				date: null,
				set: null,
			};

			return;
		}

		this.entry = entry;

		this.data = {
			subjects:
				match.groups?.subjects
					?.match(/([a-z]+[A-Z0-9]+)_(?:(?:[A-Z0-9]+)_)?/g)
					?.map((subject) => {
						const [subject_code, specialization_code] =
							subject.split("_");

						return {
							subject_code,
							specialization_code:
								specialization_code || null,
						};
					})
					.sort((a, b) =>
						a.subject_code.localeCompare(
							b.subject_code
						)
					) || [],

			type: match.groups?.type || "",

			no: match.groups?.no
				? Number.parseInt(match.groups.no, 10)
				: null,

			back: match.groups?.back !== undefined,

			year: Number.parseInt(
				match.groups?.year || "2025",
				10
			),

			month: match.groups?.month
				? months.indexOf(match.groups.month) + 1
				: null,

			date: match.groups?.date
				? Number.parseInt(match.groups.date, 10)
				: null,

			set: match.groups?.set || null,
		};
	}

	// ALWAYS ALLOW PDF
	static validator(entry: FsEntry<"file">): boolean {
		return true;
	}

	toString(): string {
		return this.title;
	}

	get title(): string {
		// SAFE TITLE FOR RANDOM PDFs
		if (this.data.type === "unknown") {
			return this.entry.name
				.replaceAll("_", " ")
				.replace(".pdf", "");
		}

		return (
			this.data.subjects
				.map((subject) => {
					return (
						subject.subject_code.toUpperCase() +
						" " +
						(subject.specialization_code
							? `- ${subject.specialization_code?.toUpperCase()} `
							: "")
					);
				})
				.join(" • ") +
			" • " +
			(this.data.set
				? `Set ${this.data.set} • `
				: "") +
			(this.data.type === "midsem"
				? "Mid Sem"
				: this.data.type === "endsem"
					? "End Sem"
					: "Sessional") +
			" " +
			(this.data.no ? `${this.data.no} ` : "") +
			(this.data.back ? "BACK " : "")
		);
	}

	get dateString(): string {
		if (this.data.type === "unknown") {
			return "";
		}

		return (
			this.data.year +
			(this.data.month
				? ` ${toTitleCase(
						months[this.data.month - 1]
					)}`
				: "") +
			(this.data.date
				? ` ${this.data.date}`
				: "")
		);
	}

	compareTo(other: Pyq): number {
		try {
			// Compare year
			if (this.data.year !== other.data.year) {
				return this.data.year - other.data.year;
			}

			// Compare month
			if (
				this.data.month !== null &&
				other.data.month !== null
			) {
				if (this.data.month !== other.data.month) {
					return (
						this.data.month -
						other.data.month
					);
				}

				if (
					this.data.date !== null &&
					other.data.date !== null
				) {
					return (
						this.data.date -
						other.data.date
					);
				}

				if (this.data.date === null) {
					return -1;
				}

				if (other.data.date === null) {
					return 1;
				}
			}

			if (this.data.month === null) {
				return -1;
			}

			if (other.data.month === null) {
				return 1;
			}

			return 0;
		} catch {
			return 0;
		}
	}
}

export { Pyq };