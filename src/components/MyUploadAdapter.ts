class MyUploadAdapter {
	loader: any;

	constructor(loader: any) {
		this.loader = loader;
	}

	// Start the upload process
	upload() {
		return new Promise(async (resolve, reject) => {
			try {
				// Get the file from the loader
				const file = await this.loader.file;
				if (!(file instanceof Blob)) {
					console.error("Selected file is not of type Blob", file);
					reject("Selected file is not of type Blob");
					return;
				}
				console.log("File selected:", file);

				// Generate a temporary URL for preview
				const tempUrl = URL.createObjectURL(file);
				resolve({
					default: tempUrl, // Provide the local URL for previewing the image
				});
			} catch (error) {
				console.error("Error during file handling:", error);
				reject(error);
			}
		});
	}

	abort() {
		console.log("Upload aborted");
	}
}

export default MyUploadAdapter;
