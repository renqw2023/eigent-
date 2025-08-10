import type { ProgressInfo } from "electron-updater";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {Progress} from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

const Update = () => {
  const { t } = useTranslation();
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const checkUpdate = async () => {
    const result = await window.ipcRenderer.invoke("check-update");
    if (result?.error) {
      toast.error(t('components.update.updateCheckFailed'), {
        description: result.error.message,
      });
    }
  };

  const onUpdateCanAvailable = useCallback(
    (_event: Electron.IpcRendererEvent, info: VersionInfo) => {

      if (info.update) {
        toast(t('components.update.newVersionAvailable'), {
          description: `v${info.version} → v${info.newVersion}`,
          action: {
            label: t('components.update.download'),
            onClick: () => {
              setIsDownloading(true);
              setDownloadProgress(0);
              window.ipcRenderer.invoke("start-download");
            },
          },
          duration: Infinity,
        });
      }
    },
    []
  );

  const onUpdateError = useCallback(
    (_event: Electron.IpcRendererEvent, err: ErrorType) => {
      toast.error(t('components.update.updateError'), {
        description: err.message,
      });
    },
    []
  );

  const onDownloadProgress = useCallback(
    (_event: Electron.IpcRendererEvent, progress: ProgressInfo) => {
      console.log('Download progress received:', progress);
      setDownloadProgress(progress.percent ?? 0);
    },
    []
  )
 
  // listen to download progress and update toast
  useEffect(() => {
    if (isDownloading) {
      toast.custom((t) => (
        <div className="bg-white-100% shadow-lg p-4 rounded-lg w-[300px]">
          <div className="text-sm font-medium mb-2">{t('components.update.downloadingUpdate')}</div>
          <Progress value={downloadProgress} className="mb-2" />
          <div className="text-xs text-gray-500">
            {Math.round(downloadProgress)}% {t('components.update.complete')}
          </div>
        </div>
      ), {
        id: "download-progress",
        duration: Infinity,
      });
    }
  }, [downloadProgress, isDownloading]);

  const onUpdateDownloaded = useCallback(
    (_event: Electron.IpcRendererEvent) => {
      toast.dismiss("download-progress");
      setIsDownloading(false);
      toast.success(t('components.update.downloadComplete'), {
        description: t('components.update.clickToInstallUpdate'),
        action: {
          label: t('components.update.install'),
          onClick: () => window.ipcRenderer.invoke("quit-and-install"),
        },
        duration: Infinity,
      });
    },
    []
  );

  useEffect(() => {
    if (sessionStorage.getItem("updateElectronShown")) {
      return;
    }
    sessionStorage.setItem("updateElectronShown", "1");

    window.ipcRenderer.on("update-can-available", onUpdateCanAvailable);
    window.ipcRenderer.on("update-error", onUpdateError);
    window.ipcRenderer.on("download-progress", onDownloadProgress);
    window.ipcRenderer.on("update-downloaded", onUpdateDownloaded);
    checkUpdate();

    return () => {
      window.ipcRenderer.off("update-can-available", onUpdateCanAvailable);
      window.ipcRenderer.off("update-error", onUpdateError);
      window.ipcRenderer.off("download-progress", onDownloadProgress);
      window.ipcRenderer.off("update-downloaded", onUpdateDownloaded);
    };
  }, []);

  return null; 
};

export default Update;
