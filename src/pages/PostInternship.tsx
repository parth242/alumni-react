import React, { useEffect, useState } from "react";
import LinkCommon from "components/ui/common/LinkCommon";
import { HiPlus } from "react-icons/hi";
import { useProfessionalskills } from "api/services/professionalskillService";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectMulti from "components/ui/common/SelectMulti";
import * as yup from "yup";
import {
	TJobFormData,
	IUser,
	TSelectJob,
	IProfessionalskill,	
} from "utils/datatypes";

import {
	Button,
	Col,
	DatePicker,
	Drawer,
	Form,
	Input,
	Row,
	Select,
	Space,
} from "antd";
import dayjs from "dayjs";
import { SaveOutlined } from "@ant-design/icons";

const PostInternship: React.FC = () => {
	const [open, setOpen] = React.useState(false);
	const [addInternshipForm] = Form.useForm();

	const EmailSchema = yup.object().shape({
		id: yup.string().optional(),

		job_title: yup.string().required("Job Title is required."),

		company: yup.string().required("Company is required."),

		contact_email: yup.string().required("Contact Email is required."),
		
		skill_name: yup
			.array()
			.of(yup.string().required("Job Skill is required"))
			.min(1, "At least one job skill is required") // Minimum 1 element required in the array
			.required("Job skill is required"),
	});

	const [skillList, setSkillList] = useState<TSelectJob[]>([]);
	const [selectedValuesSkill, setSelectedValuesSkill] = useState<
		TSelectJob[]
	>([]);

	const {
		data: professionalskills,
		refetch: fetchprofessionalskillListData,
		isFetching: isFetchingProfessionalskillListData,
	} = useProfessionalskills({
		enabled: true,
		filter_status: "active",
		filter_name: "",
		page_number: 1,
		page_size: 0,
	}) || [];
	useEffect(() => {
		if (professionalskills) {
			const professionalskillsList = professionalskills.data.map(
				(item: IProfessionalskill) => {
					return { text: item.skill_name, value: item.skill_name };
				},
			) as TSelectJob[];
			setSkillList([...professionalskillsList]);
		} else {
			setSkillList([]);
		}
	}, [professionalskills]);

	const handleSkill = (selectedOptions: any) => {
		setSelectedValuesSkill(selectedOptions);

		const skillNumbers = selectedOptions.map((mn: any) => {
			return mn.value;
		});

		setValue && setValue("skill_name", skillNumbers);
	};

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	const {
		trigger,
		register,
		setValue,
		handleSubmit,
		reset,
		formState: { errors },
		getValues,
	} = useForm<TJobFormData>({
		resolver: yupResolver(EmailSchema),
	});

	const submitAddInternship = () => {
		console.log("submitAddInternship");
	};

	const skills = ["Python", "Java", "C++", "JavaScript", "React", "Node.js"];
	return (
		<>
			<LinkCommon onClick={showDrawer}>
				<HiPlus /> Post Internship
			</LinkCommon>

			<Drawer
				title={<h1 className="text-2xl font-bold">Post Internship</h1>}
				width={720}
				open={open}
				onClose={onClose}
				styles={{
					body: {
						paddingBottom: 80,
					},
				}}
				placement="right">
				<Form
					form={addInternshipForm as any}
					layout="vertical"
					onFinish={submitAddInternship}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="title"
								label="Title"
								rules={[
									{
										required: true,
										message: "Please enter title",
									},
								]}>
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Please enter title"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="company_name"
								label={
									<span className="text-l font-semibold">
										Company Name
									</span>
								}
								rules={[
									{
										required: true,
										message: "Company Name is required",
									},
								]}>
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter Company Name"
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="company_website"
								label="Company Website"
								rules={[
									{
										required: true,
										message: "Company Website is required",
									},
								]}>
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter Company Website"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="duration"
								label="Duration"
								rules={[
									{
										required: true,
										message: "Duration is required",
									},
								]}>
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter Duration"
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="location"
								label="Location separated by commas"
								rules={[
									{
										required: true,
										message: "Location",
									},
								]}>
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter Location separated by commas"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="contact_email"
								label="Contact Email"
								rules={[
									{
										required: true,
										pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "Contact Email is required",
									},
								]}>
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter Contact Email"
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={8}>
							<Form.Item
								name="skill_name"
								label="Skills"
								rules={[
									{
										required: true,
										message: "Skills are required",
									},
								]}>
								<SelectMulti
								name={"skill_name"}
								items={skillList}
								register={register}
								onChange={handleSkill}
								defaultValue={selectedValuesSkill}
								setValue={setValue}
								error={errors?.skill_name?.message}
								className="rounded-md border-1 border-gray-300"
							/>
								
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label="Stipend" name="stipend">
								<Input
									className="rounded-md border-1 border-gray-300"
									placeholder="Enter Stipend"
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								label="Application Deadline"
								name="application_deadline">
								<DatePicker
									minDate={dayjs()}
									size="large"
									className="rounded-md border-1 w-full border-gray-300"
									placeholder="Select Application Deadline"
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item
								name="description"
								label="Description"
								rules={[
									{
										required: true,
										message: "Description is required",
									},
								]}>
								<Input.TextArea
									rows={4}
									placeholder="Enter Description"
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item>
								<Button
									icon={<SaveOutlined />}
									type="primary"
									size="large"
									variant="outlined"
									className="border-1 border-gray-300"
									style={{
										backgroundColor: "#fff",
										color: "#440178",
									}}
									htmlType="submit">
									Save
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Drawer>
		</>
	);
};

export default PostInternship;
