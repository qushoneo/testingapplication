import { SeverityColor } from "@/components/SeverityColor";

export const severities = [
  {
    id: null,
    name: "Not defined",
  },
  {
    id: "LOW",
    name: "Low",
  },
  {
    id: "MEDIUM",
    name: "Medium",
  },
  {
    id: "HIGH",
    name: "High",
  },
];

export const severityIcons = [
  { id: null, icon: <SeverityColor value={null} /> },
  { id: "LOW", icon: <SeverityColor value="LOW" /> },
  { id: "MEDIUM", icon: <SeverityColor value="MEDIUM" /> },
  { id: "HIGH", icon: <SeverityColor value="HIGH" /> },
];
