import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function showTrafficToast() {
	const { t } = useTranslation();
	toast.dismiss();
	
	toast(
		<div>
			{t('components.trafficToast.highTraffic')}
		</div>,
		{
			duration: 5000,
			closeButton: true,
		}
	);
}
