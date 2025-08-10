import { useSidebarStore } from "@/store/sidebarStore";
import { motion, AnimatePresence } from "framer-motion";
import {
	ArrowLeft,
	Bird,
	CodeXml,
	FileText,
	GalleryVerticalEnd,
	Globe,
	Plus,
	Image,
	ChevronDown,
	Ellipsis,
	Share,
	SquarePlay,
	Trash2,
	Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { useGlobalStore } from "@/store/globalStore";
import folderIcon from "@/assets/Folder-1.svg";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { generateUniqueId } from "@/lib";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverClose,
} from "../ui/popover";
import AlertDialog from "../ui/alertDialog";
import { proxyFetchGet, proxyFetchDelete, proxyFetchPost } from "@/api/http";
import { Tag } from "../ui/tag";
import { share } from "@/lib/share";
import { useTranslation } from "react-i18next";

export default function HistorySidebar() {
	const { isOpen, close } = useSidebarStore();
	const navigate = useNavigate();
	const chatStore = useChatStore();
	const getTokens = chatStore.getTokens;
	const { history_type, toggleHistoryType } = useGlobalStore();
	const [searchValue, setSearchValue] = useState("");
	const [historyOpen, setHistoryOpen] = useState(true);
	const [historyTasks, setHistoryTasks] = useState<any[]>([]);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [curHistoryId, setCurHistoryId] = useState("");
	const { t } = useTranslation();

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value) {
			setHistoryOpen(true);
		}
		setSearchValue(e.target.value);
	};

	const toggleOpenHistory = async () => {
		if (!historyOpen) {
			await fetchHistoryTasks();
		}
		setHistoryOpen(!historyOpen);
	};

	const createChat = () => {
		close();
		const taskId = Object.keys(chatStore.tasks).find((taskId) => {
			console.log(chatStore.tasks[taskId].messages.length);
			return chatStore.tasks[taskId].messages.length === 0;
		});
		if (taskId) {
			chatStore.setActiveTaskId(taskId);
			navigate(`/`);
			return;
		}
		if (
			chatStore.tasks[chatStore.activeTaskId as string] &&
			chatStore.tasks[chatStore.activeTaskId as string].messages.length === 0
		) {
		}
		chatStore.create();
		navigate("/");
	};

	const agentMap = {
		developer_agent: {
			name: "Developer Agent",
			textColor: "text-text-developer",
			bgColor: "bg-bg-fill-coding-active",
			shapeColor: "bg-bg-fill-coding-default",
			borderColor: "border-bg-fill-coding-active",
			bgColorLight: "bg-emerald-200",
		},
		search_agent: {
			name: "Search Agent",

			textColor: "text-blue-700",
			bgColor: "bg-bg-fill-browser-active",
			shapeColor: "bg-bg-fill-browser-default",
			borderColor: "border-bg-fill-browser-active",
			bgColorLight: "bg-blue-200",
		},
		document_agent: {
			name: "Document Agent",

			textColor: "text-yellow-700",
			bgColor: "bg-bg-fill-writing-active",
			shapeColor: "bg-bg-fill-writing-default",
			borderColor: "border-bg-fill-writing-active",
			bgColorLight: "bg-yellow-200",
		},
		multi_modal_agent: {
			name: "Multi Modal Agent",

			textColor: "text-fuchsia-700",
			bgColor: "bg-bg-fill-multimodal-active",
			shapeColor: "bg-bg-fill-multimodal-default",
			borderColor: "border-bg-fill-multimodal-active",
			bgColorLight: "bg-fuchsia-200",
		},
		social_medium_agent: {
			name: "Social Media Agent",

			textColor: "text-purple-700",
			bgColor: "bg-violet-700",
			shapeColor: "bg-violet-300",
			borderColor: "border-violet-700",
			bgColorLight: "bg-purple-50",
		},
	};

	const handleClickAgent = (taskId: string, agent_id: string) => {
		chatStore.setActiveTaskId(taskId);
		chatStore.setActiveWorkSpace(taskId, "workflow");
		chatStore.setActiveAgent(taskId, agent_id);
		navigate(`/`);
	};

	const fetchHistoryTasks = async () => {
		try {
			const res = await proxyFetchGet(`/api/chat/histories`);
			setHistoryTasks(res.items);
		} catch (error) {
			console.error("Failed to fetch history tasks:", error);
		}
	};

	useEffect(() => {
		fetchHistoryTasks();
	}, [chatStore.updateCount]);

	const handleReplay = async (taskId: string, question: string) => {
		close();
		chatStore.replay(taskId, question, 0);
		navigate({ pathname: "/" });
	};

	const handleDelete = (id: string) => {
		console.log("Delete task:", id);
		setCurHistoryId(id);
		setDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		await deleteHistoryTask();
		setHistoryTasks((list) => list.filter((item) => item.id !== curHistoryId));
		setCurHistoryId("");
		setDeleteModalOpen(false);
	};

	const deleteHistoryTask = async () => {
		try {
			const res = await proxyFetchDelete(`/api/chat/history/${curHistoryId}`);
			console.log(res);
		} catch (error) {
			console.error("Failed to delete history task:", error);
		}
	};

	const handleShare = async (taskId: string) => {
		close();
		share(taskId);
	};

	const handleSetActive = (taskId: string, question: string) => {
		const task = chatStore.tasks[taskId];
		if (task) {
			// if there is record, show result
			chatStore.setActiveTaskId(taskId);
			navigate(`/`);
			close();
		} else {
			// if there is no record, execute replay
			handleReplay(taskId, question);
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* alert dialog */}
					<AlertDialog
						isOpen={deleteModalOpen}
						onClose={() => setDeleteModalOpen(false)}
						onConfirm={confirmDelete}
						title={t('components.historySidebar.deleteTask')}
						message={t('components.historySidebar.areYouSureYouWantToDeleteThisTask')}
						confirmText={t('common.delete')}
						cancelText={t('common.cancel')}
					/>
					{/* background cover */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-transparent z-40 "
						onClick={close}
					/>
					{/* sideBar */}
					<motion.div
						initial={{ x: "-100%" }}
						animate={{ x: 0 }}
						exit={{ x: "-100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						onMouseLeave={close}
						className="backdrop-blur-xl flex flex-col fixed left-2 bottom-2 pb-4 top-[40px] h-full w-[316px] bg-bg-surface-tertiary rounded-xl p-sm pl-0 z-50"
					>
						<div className="flex items-center justify-between px-sm">
														<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									close();
									navigate("/history");
								}}
								className="flex items-center gap-1 cursor-pointer"
							>
								<ArrowLeft size={16} />
								<span className="text-text-primary text-sm font-bold leading-13">
									{t('components.historySidebar.dashboard')}
								</span>
							</Button>
							<Button
								onClick={() => toggleHistoryType()}
								variant="ghost"
								size="icon"
							>
								<GalleryVerticalEnd className="h-4 w-4" />
							</Button>
						</div>
						<div className="pt-4 pb-2  px-sm ">
							{/* Search */}
							<SearchInput value={searchValue} onChange={handleSearch} />
						</div>
						<div className="mb-4 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
							<div className="px-sm flex flex-col  gap-2">
								{/* new Project */}
								<div
									onClick={createChat}
									className="cursor-pointer select-none  rounded-md p-3 h-16 flex items-center justify-start gap-md transition-all duration-300 group"
								>
									<Plus className="w-8 h-8 text-icon-tertiary group-hover:text-icon-primary transition-all duration-300" />
									<span className="text-text-tertiary font-bold text-[14px] leading-9 group-hover:text-text-body transition-all duration-300">
										{t('components.historySidebar.newProject')}
									</span>
								</div>
								{history_type === "table" ? (
									// Table
									<div className="flex justify-start items-center flex-wrap gap-2">
										{Object.keys(chatStore.tasks)
											.reverse()
											.map((taskId) => {
												const task = chatStore.tasks[taskId];
												return task.status != "finished" && !task.type ? (
													<div
														key={taskId}
														onClick={() => {
															chatStore.setActiveTaskId(taskId);
															navigate(`/`);
															close();
														}}
														className={`${
															chatStore.activeTaskId === taskId
																? "!bg-white-100%"
																: ""
														} max-w-full relative cursor-pointer transition-all duration-300 bg-white-30% hover:bg-white-100% rounded-3xl backdrop-blur-xl w-[316px] h-[180px]`}
													>
														<div className="px-6 flex justify-between items-center gap-md w-[284px] h-[180px]">
															<div className="w-[122px] py-md h-full flex flex-col gap-1">
																<div className="flex-1 flex justify-start items-end">
																	<img
																		className="w-[60px] h-[60px]"
																		src={folderIcon}
																		alt="folder-icon"
																	/>
																</div>
																<div className="text-left text-[14px] text-text-primary font-bold leading-9 overflow-hidden text-ellipsis break-words line-clamp-3">
																	{task?.messages[0]?.content || "New Project"}
																</div>
																<div className="w-full">
																	<Progress
																		value={task.progressValue}
																		className="h-[2px] w-full"
																	/>
																</div>
															</div>
															<div className="w-[122px] pt-md h-full flex flex-col gap-sm">
																<div className="flex justify-between items-center ">
																	<div className="text-xs leading-17 font-medium text-text-secondary">
																		TASKS
																	</div>
																	<div className="text-xs leading-17 font-medium text-text-tertiary">
																		{task.taskRunning?.filter(
																			(taskItem) =>
																				taskItem.status === "completed" ||
																				taskItem.status === "failed"
																		).length || 0}
																		/{task.taskRunning?.length || 0}
																	</div>
																</div>
																<div className="w-[133px] h-full overflow-y-auto scrollbar-hide  flex flex-col gap-sm">
																	{task.taskAssigning.map(
																		(taskAssigning) =>
																			taskAssigning.status === "running" && (
																				<div
																					key={taskAssigning.agent_id}
																					onClick={() =>
																						handleClickAgent(
																							taskId,
																							taskAssigning.agent_id as AgentNameType
																						)
																					}
																					className={`transition-all duration-300 flex justify-start items-center gap-1 px-sm py-xs bg-menutabs-bg-default hover:bg-white-100% rounded-lg border border-solid border-white-100% shadow-history-item ${
																						agentMap[
																							taskAssigning.type as keyof typeof agentMap
																						].borderColor
																					}`}
																				>
																					<Bot
																						className={`w-3 h-3 ${
																							agentMap[
																								taskAssigning.type as keyof typeof agentMap
																							].textColor
																						}`}
																					/>
																					<div
																						className={`${
																							agentMap[
																								taskAssigning.type as keyof typeof agentMap
																							].textColor
																						} text-xs leading-17 font-medium`}
																					>
																						{taskAssigning.name}
																					</div>
																				</div>
																			)
																	)}
																</div>
															</div>
														</div>
													</div>
												) : (
													""
												);
											})}
									</div>
								) : (
									// List
									<div className=" flex flex-col justify-start items-center gap-2 ">
										{Object.keys(chatStore.tasks)
											.reverse()
											.map((taskId) => {
												const task = chatStore.tasks[taskId];
												return task.status != "finished" && !task.type ? (
													<div
														key={taskId}
														onClick={() => {
															chatStore.setActiveTaskId(taskId);
															navigate(`/`);
															close();
														}}
														className={`${
															chatStore.activeTaskId === taskId
																? "!bg-white-100%"
																: ""
														} max-w-full flex w-full items-center border-radius-2xl bg-white-30% box-sizing-border-box p-3 relative h-14 gap-2 transition-all duration-300 hover:bg-white-100% rounded-2xl`}
													>
														<img
															className="w-8 h-8"
															src={folderIcon}
															alt="folder-icon"
														/>
														<div className="flex-1 overflow-hidden text-text-body text-ellipsis font-inter text-[13px] font-bold leading-8 whitespace-nowrap overflow-hidden text-ellipsis">
															<Tooltip>
																<TooltipTrigger asChild>
																	<span>
																		{task?.messages[0]?.content ||
																			"New Project"}
																	</span>
																</TooltipTrigger>
																<TooltipContent className="w-[200px] bg-white-100% p-2 text-wrap break-words text-xs select-text pointer-events-auto !fixed ">
																	<p>
																		{task?.messages[0]?.content ||
																			"New Project"}
																	</p>
																</TooltipContent>
															</Tooltip>
														</div>
													</div>
												) : (
													""
												);
											})}
									</div>
								)}
							</div>
							<div className="px-sm py-4 flex flex-col gap-2">
								<div className="flex justify-between items-center">
																<div className="text-text-primary text-base font-bold leading-9">
									{t('components.historySidebar.projectArchives')}
								</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => toggleOpenHistory()}
									>
										<ChevronDown
											size={24}
											className={`transition-transform duration-200 ${
												historyOpen ? "rotate-180" : ""
											}`}
										/>
									</Button>
								</div>
								<AnimatePresence>
									{historyOpen && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											className=" flex-1"
										>
											{history_type === "table" ? (
												// Table
												<div className="flex justify-start items-center flex-wrap gap-2 ">
													{historyTasks
														.filter((task) =>
															task.question
																?.toLowerCase()
																.includes(searchValue.toLowerCase())
														)
														.map((task) => {
															return (
																<div
																	onClick={() =>
																		handleSetActive(task.task_id, task.question)
																	}
																	key={task.task_id}
																	className={`${
																		chatStore.activeTaskId === task.task_id
																			? "!bg-white-100%"
																			: ""
																	} max-w-full relative cursor-pointer transition-all duration-300 bg-white-30% hover:bg-white-100% rounded-3xl w-[316px] h-[180px] p-6 shadow-history-item`}
																>
																	<div className="absolute h-[calc(100%+2px)] w-14 border border-solid border-[rgba(154,154,162,0.3)] border-t-transparent border-b-transparent rounded-3xl pointer-events-none top-[-1px] left-[-1px] border-r-transparent"></div>
																	<div className="absolute h-[calc(100%+2px)] w-14 border border-solid border-[rgba(154,154,162,0.3)] border-t-transparent border-b-transparent rounded-3xl pointer-events-none top-[-1px] right-[-1px] border-l-transparent"></div>
																	<div className="flex justify-between items-end gap-1">
																		<img
																			className="w-[60px] h-[60px] mt-2"
																			src={folderIcon}
																			alt="folder-icon"
																		/>
																				<Tag variant="primary">
																			{t('components.historySidebar.token')} {task.tokens || 0}
																		</Tag>
																	</div>

																	<div className="text-[14px] text-text-primary font-bold leading-9 overflow-hidden text-ellipsis whitespace-nowrap">
																		{task?.question.split("|")[0] ||
																			"New Project"}
																	</div>
																	<div className="text-xs text-black leading-17  overflow-hidden text-ellipsis break-words line-clamp-2">
																		{task?.question.split("|")[1] ||
																			"New Project"}
																	</div>
																</div>
															);
														})}
												</div>
											) : (
												// List
												<div className=" flex flex-col justify-start items-center gap-4 ">
													{historyTasks.map((task) => {
														return (
															<div
																onClick={() => {
																	handleSetActive(task.task_id, task.question);
																}}
																key={task.task_id}
																className={`${
																	chatStore.activeTaskId === task.task_id
																		? "!bg-white-100%"
																		: ""
																} max-w-full relative cursor-pointer transition-all duration-300 bg-white-30% hover:bg-white-100% rounded-2xl flex justify-between items-center gap-md w-full p-3 h-14 shadow-history-item border border-solid border-border-disabled`}
															>
																<img className="w-8 h-8" src={folderIcon} alt="folder-icon" />
	
																<div className="w-full text-[14px] text-text-primary font-bold leading-9 overflow-hidden text-ellipsis whitespace-nowrap">
																	<Tooltip>
																		<TooltipTrigger asChild>
																						<div>
																				{" "}
																				{task?.question.split("|")[0] || t('components.historySidebar.newProject')}
																			</div>
																		</TooltipTrigger>
																		<TooltipContent
																			align="start"
																			className="w-[800px] bg-white-100% p-2 text-wrap break-words text-xs select-text pointer-events-auto"
																		>
																			<div>
																				{" "}
																				{task?.question.split("|")[0] || "New Project"}
																			</div>
																		</TooltipContent>
																	</Tooltip>
																</div>
																		<Tag
																		variant="primary"
																		className="text-xs leading-17 font-medium text-nowrap"
																	>
																		{t('components.historySidebar.token')} {task.tokens || 0}
																	</Tag>
	
																<Popover>
																	<PopoverTrigger asChild>
																		<Button
																			size="icon"
																			onClick={(e) => e.stopPropagation()}
																			variant="ghost"
																		>
																			<Ellipsis size={16} className="text-text-primary" />
																		</Button>
																	</PopoverTrigger>
																	<PopoverContent className=" w-[98px] p-sm rounded-[12px] bg-dropdown-bg border border-solid border-dropdown-border">
																		<div className="space-y-1">
																			<PopoverClose asChild>
																				<Button
																					onClick={(e) => {
																						e.stopPropagation();
																						handleShare(task.task_id);
																					}}
																					variant="ghost"
																					size="sm"
																					className="w-full flex justify-start items-center gap-2 h-8 px-sm py-xs text-text-primary hover:bg-bg-fill-quaternary group"
																				>
																					<Share size={16} />
																					{t('components.historySidebar.share')}
																				</Button>
																			</PopoverClose>

																			<PopoverClose asChild>
																				<Button
																					onClick={(e) => {
																						e.stopPropagation();
																						handleDelete(task.task_id);
																					}}
																					variant="ghost"
																					size="sm"
																					className="w-full flex justify-start items-center gap-2 h-8 px-sm py-xs text-text-primary hover:bg-bg-fill-quaternary group"
																				>
																					<Trash2
																						size={16}
																						className="text-icon-primary group-hover:text-icon-cuation"
																					/>
																					{t('components.historySidebar.delete')}
																				</Button>
																			</PopoverClose>
																		</div>
																	</PopoverContent>
																</Popover>
															</div>
														);
													})}
												</div>
											)}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}