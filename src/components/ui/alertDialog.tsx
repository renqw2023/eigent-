import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
}

export default function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText,
	cancelText,
}: ConfirmModalProps) {
	const { t } = useTranslation();

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Background overlay */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 z-100 alert-dialog"
						onClick={onClose}
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						className="fixed max-w-md alert-dialog-wrapper rounded-xl backdrop-blur-xl  shadow-lg"
					>
						<div className="p-6">
							<h3 className="text-lg font-bold text-text-primary mb-2">
								{title || t('components.alertDialog.confirmTitle')}
							</h3>
							<p className="text-text-secondary mb-6">{message || t('components.alertDialog.confirmContent')}</p>

							<div className="flex justify-end gap-3">
								<Button variant="outline" onClick={onClose}>
									{cancelText || t('common.cancel')}
								</Button>
								<Button
									variant="cuation"
									onClick={() => {
										onConfirm();
										onClose();
									}}
								>
									{confirmText || t('common.confirm')}
								</Button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
