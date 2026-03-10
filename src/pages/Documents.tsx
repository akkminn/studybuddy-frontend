import { FileText, Upload } from "lucide-react";
import {
	type ChangeEvent,
	type FormEvent,
	useCallback,
	useEffect,
	useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import DocumentService from "@/services/documentService";
import type { DocumentMetadata, DocumentStatus } from "@/types/type";

const allowedExtensions = [".pdf", ".docx", ".pptx", ".txt", ".md"];

const statusBadgeStyles: Record<DocumentStatus, string> = {
	pending: "border-amber-500/40 bg-amber-500/10 text-amber-700",
	processing: "border-sky-500/40 bg-sky-500/10 text-sky-700",
	completed: "border-emerald-500/40 bg-emerald-500/15 text-emerald-700",
	failed: "border-destructive/40 bg-destructive/10 text-destructive",
};

const statusLabel: Record<DocumentStatus, string> = {
	pending: "Pending",
	processing: "Processing",
	completed: "Ready",
	failed: "Failed",
};

function hasAllowedExtension(fileName: string) {
	const lowerCasedName = fileName.toLowerCase();
	return allowedExtensions.some((extension) =>
		lowerCasedName.endsWith(extension),
	);
}

export default function Documents() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [validationError, setValidationError] = useState<string | null>(null);
	const [statusMessage, setStatusMessage] = useState(
		"Choose a PDF, DOCX, PPTX, TXT, or MD file to upload.",
	);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
	const [isListLoading, setIsListLoading] = useState(true);
	const [listError, setListError] = useState<string | null>(null);

	const isUploadDisabled =
		isUploading || !selectedFile || Boolean(validationError);

	const fetchDocuments = useCallback(async (mode: "load" | "refresh" = "load") => {
		setIsListLoading(true);
		setListError(null);

		try {
			const response = await DocumentService.list();
			setDocuments(response.documents);
			return true;
		} catch {
			setListError(
				mode === "refresh"
					? "We couldn't refresh your knowledge base."
					: "We couldn't load your knowledge base right now.",
			);
			return false;
		} finally {
			setIsListLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchDocuments();
	}, [fetchDocuments]);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] ?? null;

		if (!file) {
			setSelectedFile(null);
			setValidationError(null);
			setUploadError(null);
			setStatusMessage("Choose a PDF, DOCX, PPTX, TXT, or MD file to upload.");
			return;
		}

		if (!hasAllowedExtension(file.name)) {
			event.target.value = "";
			setSelectedFile(null);
			setValidationError(
				"That file type isn't supported. Choose a PDF, DOCX, PPTX, TXT, or MD file.",
			);
			setUploadError(null);
			setStatusMessage("That file type isn't supported.");
			return;
		}

		setSelectedFile(file);
		setValidationError(null);
		setUploadError(null);
		setStatusMessage(`Ready to upload ${file.name}.`);
	};

	const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!selectedFile || validationError) {
			return;
		}

		setIsUploading(true);
		setUploadError(null);
		setStatusMessage(`Uploading ${selectedFile.name}...`);

		try {
			const response = await DocumentService.upload(selectedFile);
			const uploadedFileName = response.document.filename;
			const refreshSucceeded = await fetchDocuments("refresh");

			if (refreshSucceeded) {
				setStatusMessage(
					`Uploaded ${uploadedFileName}. Document ID: ${response.id}.`,
				);
			} else {
				setStatusMessage(`Uploaded ${uploadedFileName}.`);
				setUploadError("Uploaded, but we couldn't refresh the list.");
			}
		} catch {
			setUploadError("Upload failed. Try again in a moment.");
			setStatusMessage("Upload didn't complete.");
		} finally {
			setIsUploading(false);
		}
	};

	const formatCreatedAt = (createdAt: string) => {
		const parsedDate = new Date(createdAt);
		if (Number.isNaN(parsedDate.getTime())) {
			return createdAt;
		}

		return parsedDate.toLocaleString();
	};

	return (
		<main className="w-full space-y-6">
			<header className="space-y-1">
				<h1 className="flex items-center gap-2 text-2xl font-semibold">
					<FileText className="h-5 w-5 text-primary" />
					Knowledge Base
				</h1>
				<p className="text-sm text-muted-foreground">
					Upload materials to improve StudyBuddy&apos;s answers.
				</p>
			</header>

			<section className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Upload materials</CardTitle>
						<CardDescription>
							Add files to expand your knowledge base.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form className="space-y-6" onSubmit={handleUpload}>
							<section className="space-y-2">
								<h2 className="text-sm font-medium">Choose a file</h2>
								<Input
									type="file"
									accept=".pdf,.docx,.pptx,.txt,.md"
									onChange={handleFileChange}
									data-testid="documents-file-input"
								/>
								<p className="text-xs text-muted-foreground">
									Accepted formats: PDF, DOCX, PPTX, TXT, MD
								</p>
							</section>

							<section>
								<Button
									type="submit"
									disabled={isUploadDisabled}
									data-testid="documents-upload-btn"
								>
									{isUploading ? (
										<Spinner className="h-4 w-4" />
									) : (
										<Upload className="h-4 w-4" />
									)}
									{isUploading ? "Uploading..." : "Upload"}
								</Button>
							</section>

							{isUploading ? (
								<section className="space-y-2">
									<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
										<div className="h-full w-1/2 animate-pulse rounded-full bg-primary/70" />
									</div>
									<p className="text-xs text-muted-foreground">
										Uploading... keep this tab open.
									</p>
								</section>
							) : null}

							<section>
								<output
									className={`text-sm ${validationError || uploadError ? "text-destructive" : "text-muted-foreground"}`}
									aria-live="polite"
									data-testid="documents-status-msg"
								>
									{validationError ?? uploadError ?? statusMessage}
								</output>
							</section>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Knowledge base files</CardTitle>
						<CardDescription>
							Track processing status and recent uploads.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<section
							className="min-h-36 rounded-md border border-dashed bg-muted/20 p-4"
							data-testid="documents-list"
						>
							{isListLoading ? (
								<p className="text-sm text-muted-foreground">
									Loading your files...
								</p>
							) : listError ? (
								<div className="space-y-2">
									<p className="text-sm text-destructive">{listError}</p>
									<Button
										type="button"
										size="sm"
										variant="outline"
										onClick={() => {
											void fetchDocuments("load");
										}}
									>
										Try again
									</Button>
								</div>
							) : documents.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									No files yet. Upload materials to get started.
								</p>
							) : (
								<ul className="space-y-2">
									{documents.map((document) => (
										<li
											key={document.id}
											className="rounded-md border bg-background/80 p-3"
										>
											<div className="flex flex-wrap items-start justify-between gap-2">
												<div className="space-y-1">
													<p className="text-sm font-medium leading-tight">
														{document.filename}
													</p>
													<p className="text-xs text-muted-foreground">
														Type: {document.file_type.toUpperCase()} · Added:{" "}
														{formatCreatedAt(document.created_at)}
													</p>
												</div>
												<span
													className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${statusBadgeStyles[document.status]}`}
												>
													{statusLabel[document.status]}
												</span>
											</div>
										</li>
									))}
								</ul>
							)}
						</section>
					</CardContent>
				</Card>
			</section>
		</main>
	);
}
