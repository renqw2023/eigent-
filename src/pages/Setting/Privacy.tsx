import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { proxyFetchGet, proxyFetchPut } from "@/api/http";
import { useTranslation } from "react-i18next";

export default function SettingPrivacy() {
  const { t } = useTranslation();
  const API_FIELDS = [
    "take_screenshot",
    "access_local_software",
    "access_your_address",
    "password_storage",
  ];
  const [settings, setSettings] = useState([
    {
      title: "components.setting.allowAgentToTakeScreenshots",
      description:
        "components.setting.allowAgentToTakeScreenshotsDesc",
      checked: false,
    },
    {
      title: "components.setting.allowAgentToAccessLocalSoftware",
      description:
        "components.setting.allowAgentToAccessLocalSoftwareDesc",
      checked: false,
    },
    {
      title: "components.setting.allowAgentToAccessYourAddress",
      description:
        "components.setting.allowAgentToAccessYourAddressDesc",
      checked: false,
    },
    {
      title: "components.setting.passwordStorage",
      description:
        "components.setting.passwordStorageDesc",
      checked: false,
    },
  ]);

  useEffect(() => {
    proxyFetchGet("/api/user/privacy")
      .then((res) => {
        setSettings((prev) =>
          prev.map((item, index) => ({
            ...item,
            checked: res[API_FIELDS[index]] || false,
          }))
        );
      })
      .catch((err) => console.error("Failed to fetch settings:", err));
  }, []);

  const handleToggle = (index: number) => {
    setSettings((prev) => {
      const newSettings = [...prev];
      newSettings[index] = {
        ...newSettings[index],
        checked: !newSettings[index].checked,
      };
      return newSettings;
    });

    const requestData = {
      [API_FIELDS[0]]: settings[0].checked,
      [API_FIELDS[1]]: settings[1].checked,
      [API_FIELDS[2]]: settings[2].checked,
      [API_FIELDS[3]]: settings[3].checked,
    };

    requestData[API_FIELDS[index]] = !settings[index].checked;

    proxyFetchPut("/api/user/privacy", requestData).catch((err) =>
      console.error("Failed to update settings:", err)
    );
  };
  return (
    <div className="space-y-8">
      {settings.map((item, index) => (
        <div className="px-6 py-4 bg-surface-secondary rounded-2xl" key={item.title}>
          <div className="flex gap-md">
            <div>
              <div className="text-base font-bold leading-12 text-text-primary">
                {t(item.title)}
              </div>
              <div className="text-sm leading-13">{t(item.description)}</div>
            </div>
            <div>
              <Switch
                checked={item.checked}
                onCheckedChange={() => handleToggle(index)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
