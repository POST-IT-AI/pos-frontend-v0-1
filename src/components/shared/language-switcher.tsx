import { useUIStore } from "@/store/ui";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { language, setLanguage } = useUIStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center rounded-md p-1.5 hover:bg-muted">
        <Languages className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLanguage("th")}
          className={language === "th" ? "bg-accent" : ""}
        >
          TH ไทย
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={language === "en" ? "bg-accent" : ""}
        >
          EN English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
