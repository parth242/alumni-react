import Button from "components/ui/common/Button";
import { Input } from "components/ui/common/Input";
import Select from "components/ui/common/Select";
import Textarea from "components/ui/common/Textarea";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "utils/icon";
import { useMutation } from "react-query";
import { ErrorToastMessage, SuccessToastMessage, useUploadImage } from "api/services/user";
import { getEmailTemplate,createEmailTemplate } from "api/services/emailtemplateService";
import { useNavigate, useParams } from "react-router-dom";
import { HTTPError } from "ky";
import { TEmailTemplateFormData,IEmailTemplate, TSelect} from "utils/datatypes";
import { allowedFiles, fileInvalid, filesExt, filesLimit, filesSize } from "utils/consts";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import MyUploadAdapter from "../components/MyUploadAdapter";
import axios from "axios";

function MyCustomUploadAdapterPlugin(editor: any) {
	editor.plugins.get("FileRepository").createUploadAdapter = (
		loader: any,
	) => {
		return new MyUploadAdapter(loader); // Create an instance of MyUploadAdapter
	};
}


function EmailTemplates() {
	const navigate = useNavigate();
	
	
	const schema = yup.object().shape({
		id: yup
			.string()
			.optional(),
			
		
	});

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileChanged, setFileChanged] = useState<boolean>(false);
	const [fileControl, setFileControl] = useState<FileList | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>();
	const [editorData, setEditorData] = useState("");
	const [editorAdminData, setEditorAdminData] = useState("");
	const [alumniEditorData, setAlumniEditorData] = useState("");
	const [resetPasswordEditorData, setResetPasswordEditorData] = useState("");
	const [eventEditorData, setEventEditorData] = useState("");
	const [jobEditorData, setJobEditorData] = useState("");
	const [jobstatusEditorData, setJobstatusEditorData] = useState("");
	const [jobreferEditorData, setJobreferEditorData] = useState("");

	const {
		trigger,
		register,
		setValue,
		getValues,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TEmailTemplateFormData>({
		resolver: yupResolver(schema)		
	});

	
	let {
		isLoading,
		data: emailtemplateDetails,
		refetch: fetchEmailTemplates,
		isFetching: isFetchingEmailTemplates,
		remove,
	} = getEmailTemplate({
		enabled: true,		
	}) || [];
	
	useEffect(() => {	
		setEditorAdminData(emailtemplateDetails?.data.alumni_register_mail_admin || "");
		setEditorData(emailtemplateDetails?.data.alumni_register_mail || "");
		setAlumniEditorData(emailtemplateDetails?.data.alumni_confirm_mail || "");	
		setResetPasswordEditorData(emailtemplateDetails?.data.alumni_reset_password_mail || "");
		setEventEditorData(emailtemplateDetails?.data.new_event_mail || "");		
		setJobEditorData(emailtemplateDetails?.data.new_job_mail || "");		
		setJobstatusEditorData(emailtemplateDetails?.data.update_job_status || "");		
		setJobreferEditorData(emailtemplateDetails?.data.refer_job_friend || "");	
		reset(emailtemplateDetails?.data);
		trigger();		
	}, [emailtemplateDetails?.data]);

	useEffect(() => {		
		fetchEmailTemplates();
	}, []);

	console.log("emailtemplateDetails", emailtemplateDetails);

	const { mutate } = useMutation(createEmailTemplate, {
		onSuccess: async () => {
			SuccessToastMessage({
				title: "EmailTemplate Created Successfully",
				id: "create_emailtemplate_success",
			});
			navigate("/admin/emailtemplates");
		},
		onError: async (e: HTTPError) => {
			// const error = await e.response.text();
			// console.log("error", error);
			ErrorToastMessage({ error: e, id: "create_emailtemplate" });
		},
	});
	const onSubmit = (data: TEmailTemplateFormData) => {
		
		
			// If no image is uploaded, just call mutate
			mutate(data);
		
		
	};

	

	const parseEditorContent = (content: string) => {
		// No need to manipulate the content anymore. Just pass it as it is.
		return content; // Return the raw HTML (including <img> tags)
	};

	const handleCancel = () => {
		reset(); // Resets the form fields to their initial values
		navigate("/admin/emailtemplates");
	  };

	
	return (
		<div className="">
			

			<form className="mt-5" onSubmit={handleSubmit(onSubmit)}>	

			<div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-6 mt-10">
					<label
							htmlFor="title"
							className="block font-medium text-gray-700">
							Alumni Register Email For Admin
						</label>
				<div className="custom-editor-main min-h-[200px] border-2 border-[#440178] rounded-lg p-2.5 shadow-lg">
						<CKEditor
							editor={ClassicEditor as any}
							data={editorAdminData}
							config={{
								extraPlugins: [MyCustomUploadAdapterPlugin],
								placeholder: "Type here to start your discussion... Feel free to share your thoughts and ideas!", 
								toolbar: [
								"heading",
								"|",
								"bold",
								"italic",
								"link",
								"bulletedList",
								"numberedList",
								"blockQuote",
								"|",
								"insertTable",
								"mediaEmbed",
								"undo",
								"redo",
								"imageUpload",															
								],
							}}
							onChange={async (event, editor) => {
								const data = editor.getData();
								const textContent = parseEditorContent(data);
								setEditorAdminData(data);
								setValue("alumni_register_mail_admin", textContent);
							}}
						/>
							<input type="hidden" {...register("alumni_register_mail_admin")} />

							{/* Display error message */}
							{errors.alumni_register_mail_admin && (
								<span className="text-xs text-red-500">
									{errors.alumni_register_mail_admin.message as string}
								</span>
							)}
						</div>
			
				</div>			

				<div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-6 mt-10">
					<label
							htmlFor="title"
							className="block font-medium text-gray-700">
							Alumni Register Email For User
						</label>
				<div className="custom-editor-main min-h-[200px] border-2 border-[#440178] rounded-lg p-2.5 shadow-lg">
							<CKEditor
								editor={ClassicEditor as any}
								data={editorData}
								config={{
									extraPlugins: [MyCustomUploadAdapterPlugin],
									placeholder:
										"Type here to start your discussion... Feel free to share your thoughts and ideas!", // Placeholder text
									toolbar: [														
										"heading",
										"|",
										"bold",
										"italic",
										"link",
										"bulletedList",
										"numberedList",
										"blockQuote",
										"|",
										"insertTable",
										"mediaEmbed",
										"undo",
										"redo",
										"imageUpload",
									],
								}}
								onChange={async (event, editor) => {
									const data = editor.getData();
									const textContent =
										parseEditorContent(data); // No need to strip out images now
									setEditorData(data); // Save full HTML content
									setValue("alumni_register_mail", textContent); // Set description to full content
								}}
							/>
							<input type="hidden" {...register("alumni_register_mail")} />

							{/* Display error message */}
							{errors.alumni_register_mail && (
								<span className="text-xs text-red-500">
									{errors.alumni_register_mail.message as string}
								</span>
							)}
						</div>
			
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-6 mt-10">
					<label
							htmlFor="title"
							className="block font-medium text-gray-700">
							Alumni Confirm Email Body
						</label>
				<div className="custom-editor-main min-h-[200px] border-2 border-[#440178] rounded-lg p-2.5 shadow-lg">
							<CKEditor
								editor={ClassicEditor as any}
								data={alumniEditorData}
								config={{
									extraPlugins: [MyCustomUploadAdapterPlugin],
									placeholder:
										"Type here to start your discussion... Feel free to share your thoughts and ideas!", // Placeholder text
									toolbar: [
										"heading",
										"|",
										"bold",
										"italic",
										"link",
										"bulletedList",
										"numberedList",
										"blockQuote",
										"|",
										"insertTable",
										"mediaEmbed",
										"undo",
										"redo",
										"imageUpload",
									],
								}}
								onChange={async (event, editor) => {
									const data = editor.getData();
									const textContent =
										parseEditorContent(data); // No need to strip out images now
										setAlumniEditorData(data); // Save full HTML content
									setValue("alumni_confirm_mail", textContent); // Set description to full content
								}}
							/>
							<input type="hidden" {...register("alumni_confirm_mail")} />

							{/* Display error message */}
							{errors.alumni_confirm_mail && (
								<span className="text-xs text-red-500">
									{errors.alumni_confirm_mail.message as string}
								</span>
							)}
						</div>
			
				</div>	

				<div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-6 mt-10">
					<label
							htmlFor="title"
							className="block font-medium text-gray-700">
							Alumni Reset Password Email Body
						</label>
				<div className="custom-editor-main min-h-[200px] border-2 border-[#440178] rounded-lg p-2.5 shadow-lg">
							<CKEditor
								editor={ClassicEditor as any}
								data={resetPasswordEditorData}
								config={{
									extraPlugins: [MyCustomUploadAdapterPlugin],
									placeholder:
										"Type here to start your discussion... Feel free to share your thoughts and ideas!", // Placeholder text
									toolbar: [
										"heading",
										"|",
										"bold",
										"italic",
										"link",
										"bulletedList",
										"numberedList",
										"blockQuote",
										"|",
										"insertTable",
										"mediaEmbed",
										"undo",
										"redo",
										"imageUpload",
									],
								}}
								onChange={async (event, editor) => {
									const data = editor.getData();
									const textContent =
										parseEditorContent(data); // No need to strip out images now
										setResetPasswordEditorData(data); // Save full HTML content
									setValue("alumni_reset_password_mail", textContent); // Set description to full content
								}}
							/>
							<input type="hidden" {...register("alumni_reset_password_mail")} />

							{/* Display error message */}
							{errors.alumni_reset_password_mail && (
								<span className="text-xs text-red-500">
									{errors.alumni_reset_password_mail.message as string}
								</span>
							)}
						</div>
			
				</div>

				<div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-6 mt-10">
					<label
							htmlFor="title"
							className="block font-medium text-gray-700">
							New Event Create
						</label>
				<div className="custom-editor-main min-h-[200px] border-2 border-[#440178] rounded-lg p-2.5 shadow-lg">
							<CKEditor
								editor={ClassicEditor as any}
								data={eventEditorData}
								config={{
									extraPlugins: [MyCustomUploadAdapterPlugin],
									placeholder:
										"Type here to start your discussion... Feel free to share your thoughts and ideas!", // Placeholder text
									toolbar: [														
										"heading",
										"|",
										"bold",
										"italic",
										"link",
										"bulletedList",
										"numberedList",
										"blockQuote",
										"|",
										"insertTable",
										"mediaEmbed",
										"undo",
										"redo",
										"imageUpload",
									],
								}}
								onChange={async (event, editor) => {
									const data = editor.getData();
									const textContent =
										parseEditorContent(data); // No need to strip out images now
									setEventEditorData(data); // Save full HTML content
									setValue("new_event_mail", textContent); // Set description to full content
								}}
							/>
							<input type="hidden" {...register("new_event_mail")} />

							{/* Display error message */}
							{errors.new_event_mail && (
								<span className="text-xs text-red-500">
									{errors.new_event_mail.message as string}
								</span>
							)}
						</div>
			
				</div>		

				<div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-6 mt-10">
					<label
							htmlFor="title"
							className="block font-medium text-gray-700">
							New Job Create
						</label>
				<div className="custom-editor-main min-h-[200px] border-2 border-[#440178] rounded-lg p-2.5 shadow-lg">
							<CKEditor
								editor={ClassicEditor as any}
								data={jobEditorData}
								config={{
									extraPlugins: [MyCustomUploadAdapterPlugin],
									placeholder:
										"Type here to start your discussion... Feel free to share your thoughts and ideas!", // Placeholder text
									toolbar: [														
										"heading",
										"|",
										"bold",
										"italic",
										"link",
										"bulletedList",
										"numberedList",
										"blockQuote",
										"|",
										"insertTable",
										"mediaEmbed",
										"undo",
										"redo",
										"imageUpload",
									],
								}}
								onChange={async (event, editor) => {
									const data = editor.getData();
									const textContent =
										parseEditorContent(data); // No need to strip out images now
									setJobEditorData(data); // Save full HTML content
									setValue("new_job_mail", textContent); // Set description to full content
								}}
							/>
							<input type="hidden" {...register("new_job_mail")} />

							{/* Display error message */}
							{errors.new_job_mail && (
								<span className="text-xs text-red-500">
									{errors.new_job_mail.message as string}
								</span>
							)}
						</div>
			
				</div>	

				<div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-6 mt-10">
					<label
							htmlFor="title"
							className="block font-medium text-gray-700">
							Update Job Status
						</label>
				<div className="custom-editor-main min-h-[200px] border-2 border-[#440178] rounded-lg p-2.5 shadow-lg">
							<CKEditor
								editor={ClassicEditor as any}
								data={jobstatusEditorData}
								config={{
									extraPlugins: [MyCustomUploadAdapterPlugin],
									placeholder:
										"Type here to start your discussion... Feel free to share your thoughts and ideas!", // Placeholder text
									toolbar: [														
										"heading",
										"|",
										"bold",
										"italic",
										"link",
										"bulletedList",
										"numberedList",
										"blockQuote",
										"|",
										"insertTable",
										"mediaEmbed",
										"undo",
										"redo",
										"imageUpload",
									],
								}}
								onChange={async (event, editor) => {
									const data = editor.getData();
									const textContent =
										parseEditorContent(data); // No need to strip out images now
									setJobstatusEditorData(data); // Save full HTML content
									setValue("update_job_status", textContent); // Set description to full content
								}}
							/>
							<input type="hidden" {...register("update_job_status")} />

							{/* Display error message */}
							{errors.update_job_status && (
								<span className="text-xs text-red-500">
									{errors.update_job_status.message as string}
								</span>
							)}
						</div>
			
				</div>

				<div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-6 mt-10">
					<label
							htmlFor="title"
							className="block font-medium text-gray-700">
							Job Refere to Friend
						</label>
				<div className="custom-editor-main min-h-[200px] border-2 border-[#440178] rounded-lg p-2.5 shadow-lg">
							<CKEditor
								editor={ClassicEditor as any}
								data={jobreferEditorData}
								config={{
									extraPlugins: [MyCustomUploadAdapterPlugin],
									placeholder:
										"Type here to start your discussion... Feel free to share your thoughts and ideas!", // Placeholder text
									toolbar: [														
										"heading",
										"|",
										"bold",
										"italic",
										"link",
										"bulletedList",
										"numberedList",
										"blockQuote",
										"|",
										"insertTable",
										"mediaEmbed",
										"undo",
										"redo",
										"imageUpload",
									],
								}}
								onChange={async (event, editor) => {
									const data = editor.getData();
									const textContent =
										parseEditorContent(data); // No need to strip out images now
									setJobreferEditorData(data); // Save full HTML content
									setValue("refer_job_friend", textContent); // Set description to full content
								}}
							/>
							<input type="hidden" {...register("refer_job_friend")} />

							{/* Display error message */}
							{errors.refer_job_friend && (
								<span className="text-xs text-red-500">
									{errors.refer_job_friend.message as string}
								</span>
							)}
						</div>
			
				</div>
				
				<div className="mt-6">
					<Button className="!transition-colors !duration-700 text-lg font-medium text-white shadow-sm hover:!bg-blue-700 focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 py-3 px-10">
						Save
					</Button>
					<Button
						type="button"
						onClick={handleCancel}
						className="transition-colors duration-700 text-lg font-medium text-black bg-white border border-black hover:bg-gray-100 focus:outline-none focus:ring-0 py-3 px-10 ml-4"
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
}

export default EmailTemplates;
