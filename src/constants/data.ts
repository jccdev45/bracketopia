import {
  ClockArrowDown,
  ListFilterPlus,
  Logs,
  type LucideIcon,
  Ratio,
  UserPlus,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const FEATURES: Feature[] = [
  {
    title: "Effortless Tournament Creation",
    description:
      "Design your tournament in minutes using our intuitive, drag-and-drop bracket builder.  Customize every detail to perfectly match your vision.",
    icon: ListFilterPlus,
  },
  {
    title: "Streamlined Participant Management",
    description:
      "Seamlessly add, manage, and organize participants.  Our automated seeding ensures fair and balanced matchups.",
    icon: UserPlus,
  },
  {
    title: "Real-time Results & Updates",
    description:
      "Keep everyone informed with live updates as matches are reported. View bracket progression and results in real-time.",
    icon: ClockArrowDown,
  },
  {
    title: "Fair & Balanced Matchups",
    description:
      "Advanced algorithms guarantee balanced brackets, making sure every participant has a fair chance at winning.",
    icon: Ratio,
  },
  {
    title: "Flexible Customization Options",
    description:
      "Tailor your tournament to your specific needs.  Set your own rules, scoring methods, and more.",
    icon: Logs,
  },
];

export const TOURNAMENT_CATEGORIES = [
  "General",
  "Video Games",
  "Music",
  "Sports",
  "Esports",
  "Academic",
  "Board Games",
  "Card Games",
  "Other",
] as const;

export type TournamentCategory = (typeof TOURNAMENT_CATEGORIES)[number];
