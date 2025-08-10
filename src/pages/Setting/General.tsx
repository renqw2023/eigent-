import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Settings, Check } from "lucide-react";
import light from "@/assets/light.png";
import dark from "@/assets/dark.png";
import transparent from "@/assets/transparent.png";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { proxyFetchPut, proxyFetchGet } from "@/api/http";
import { createRef, RefObject } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function SettingGeneral() {
	const { t } = useTranslation();
	const authStore = useAuthStore();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const setAppearance = authStore.setAppearance;
	const language = authStore.language;
	const setLanguage = authStore.setLanguage;
	const appearance = authStore.appearance;
	const fullNameRef: RefObject<HTMLInputElement> = createRef();
	const nickNameRef: RefObject<HTMLInputElement> = createRef();
	const workDescRef: RefObject<HTMLInputElement> = createRef();


	
	const [themeList, setThemeList] = useState<any>([
		{
			img: light,
			label: "components.setting.light",
			value: "light",
		},
		{
			img: transparent,
			label: "components.setting.transparent",
			value: "transparent",
		},
	]);
	useEffect(() => {
		const platform = window.electronAPI.getPlatform();
		console.log(platform);
		if (platform === "darwin") {
			setThemeList([
				{
					img: light,
					label: "components.setting.light",
					value: "light",
				},
				{
					img: transparent,
					label: "components.setting.transparent",
					value: "transparent",
				},
			]);
		} else {
			setThemeList([
				{
					img: light,
					label: "components.setting.light",
					value: "light",
				},
			]);
		}
	}, []);

	return (
		<div className="space-y-8">
			<div className="px-6 py-4 bg-surface-secondary rounded-2xl">
				<div className="text-base font-bold leading-12 text-text-body">
					{t('components.setting.account')}
				</div>
				<div className="text-sm leading-13 mb-4">
					{t('components.setting.youAreCurrentlySignedInWith')} {authStore.email}
				</div>
				<div className="flex items-center gap-sm">
					<Button
						onClick={() => {
							window.location.href = `https://www.eigent.ai/dashboard`;
						}}
						variant="primary"
						size="xs"
					>
						<Settings className="w-4 h-4 text-button-primary-icon-default" />
						{t('components.setting.manage')}
					</Button>
					<Button
						variant="outline"
						size="xs"
						onClick={() => {
							authStore.logout();
							navigate("/login");
						}}
					>
						<LogOut className="w-4 h-4 text-button-tertiery-text-default" />
						{t('components.setting.logout')}
					</Button>
				</div>
			</div>
			{/* <div className="px-6 py-4 bg-surface-secondary rounded-2xl">
				<div className="text-base font-bold leading-12 text-text-primary">
					Language
				</div>
				<div className="mt-md">
					<Select value={language} onValueChange={setLanguage}>
						<SelectTrigger>
							<SelectValue placeholder="Select a fruit" />
						</SelectTrigger>
						<SelectContent className="bg-input-bg-default border">
							<SelectGroup>
								<SelectItem value="system">System Default</SelectItem>
								<SelectItem value="zh-cn">简体中文</SelectItem>
								<SelectItem value="en">English</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div> */}
			<div className="px-6 py-4 bg-surface-secondary rounded-2xl">
				<div className="text-base font-bold leading-12 text-text-primary">
					{t('components.setting.appearance')}
				</div>
				<div className="flex items-center gap-md mt-md">
					{themeList.map((item: any) => (
						<div
							key={item.label}
							className="hover:cursor-pointer group flex flex-col items-center gap-sm "
							onClick={() => setAppearance(item.value)}
						>
							<img
								src={item.img}
								className={`rounded-lg transition-all h-[91.67px] aspect-[183/91.67] border border-solid border-transparent group-hover:border-bg-fill-info-primary ${
									item.value == appearance ? "border-bg-fill-info-primary" : ""
								}`}
								alt=""
							/>
							<div
								className={`text-sm leading-13 text-text-primary group-hover:underline ${
									item.value == appearance ? "underline" : ""
								}`}
							>
								{t(item.label)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
