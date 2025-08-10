import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function showStorageToast() {
	const { t } = useTranslation();
	toast.dismiss();

	toast(
		<div>
			{t('components.storageToast.storageLimitReached')}
			<a
				className="underline cursor-pointer"
				onClick={() =>
					(window.location.href = "https://www.eigent.ai/pricing")
				}
			>
				{t('components.storageToast.upgradeAccount')}
			</a>{" "}
			{t('components.storageToast.yourAccountOrStoreLocally')}
		</div>,
		{
			duration: Infinity,
			closeButton: true,
		}
	);
}
