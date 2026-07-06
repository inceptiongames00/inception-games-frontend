import { Monitor, Smartphone, Gamepad2 } from "lucide-react";

export default function PlatformDisplay({ platform }) {
  const normalizedPlatform = platform?.toLowerCase().trim();

  let Icon, label, brandColor;

  switch (normalizedPlatform) {
    case "pc":
    case "pc only":
      Icon = Monitor;
      label = "PC";
      brandColor = "text-blue-400";
      break;
    case "mobile":
    case "mobile only":
      Icon = Smartphone;
      label = "Mobile";
      brandColor = "text-pink-400";
      break;
    case "console":
    case "console only":
      Icon = Gamepad2;
      label = "Console";
      brandColor = "text-orange-400";
      break;
    case "cross-platform":
    case "all platforms":
    case "cross platform":
      Icon = Monitor;
      label = "Cross Platform";
      brandColor = "text-purple-400";
      break;
    default:
      Icon = Monitor;
      label = "All Platforms";
      brandColor = "text-gray-400";
  }

  return (
    <div className="flex items-center gap-2">
      <Icon
        size={16}
        className={`${brandColor} font-bold`}
        strokeWidth={2.5}
      />
      <span className={`${brandColor} font-bold`}>{label}</span>
    </div>
  );
}
