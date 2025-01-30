export function classNames(...classes: unknown[]): string {
	return classes.filter(Boolean).join(" ");
}

export const createQueryURLFrom = (
	url: Location | URL | string,
	host: string,
	path: string,
) => {
	const base = new URL(host);
	// Seems like the most reliable way to reuse query params
	// Using u.search and constructing a new URL causes encoding issues
	const u = new URL(url.toString());
	u.host = base.host;
	u.pathname = path;

	return u;
};

export const downloadAsFile = (
	text: string,
	filename: string,
	type = "text/plain;charset=utf-8",
) => {
	const blob = new Blob([text], { type });
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};
