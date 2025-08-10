import { Button } from "@/components/ui/button";
import type { MCPUserItem } from "./types";
import { useTranslation } from "react-i18next";

interface MCPDeleteDialogProps {
  open: boolean;
  target: MCPUserItem | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function MCPDeleteDialog({ open, target, onCancel, onConfirm, loading }: MCPDeleteDialogProps) {
  const { t } = useTranslation();
  if (!open || !target) return null;
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30">
      <div className="bg-white-100% rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw]">
        <div className="font-bold mb-2 text-red-600">{t('components.mcpDeleteDialog.confirmDelete')}</div>
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: t('components.mcpDeleteDialog.areYouSureYouWantToDelete', { name: target.mcp_name }) }}></div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>{t('components.mcpDeleteDialog.cancel')}</Button>
          <Button variant="primary" onClick={onConfirm} disabled={loading}>
            {loading ? t('components.mcpDeleteDialog.deleting') : t('components.mcpDeleteDialog.delete')}
          </Button>
        </div>
      </div>
    </div>
  );
} 