import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function showCreditsToast() {
	const { t } = useTranslation();
	toast.dismiss();
	
	toast(
		<div>
			{t('components.creditsToast.reachedLimit')}
			<a
				className="underline cursor-pointer"
				onClick={() => (window.location.href = "https://www.eigent.ai/pricing")}
			>
				{t('components.creditsToast.upgrade')}
			</a>{" "}
			{t('components.creditsToast.yourAccount')}
			<a
				className="underline cursor-pointer"
				onClick={() => (window.location.href = "#/setting/general")}
			>
				{t('components.creditsToast.settings')}
			</a>{" "}
			.
		</div>,
		{
			duration: Infinity,
			closeButton: true,
		}
	);
}
