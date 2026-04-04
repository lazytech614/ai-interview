"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LANGUAGE_VERSIONS } from "@/lib/data";

type Language = keyof typeof LANGUAGE_VERSIONS;

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({
  language,
  onSelect,
}: {
  language: Language;
  onSelect: (lang: Language) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      
      {/* Label */}
      <p className="text-sm text-stone-400">Language</p>

      {/* Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="capitalize">
            {language}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-[#110c1b] border border-white/10 w-48">
          {languages.map(([lang, version]) => {
            const isActive = lang === language;

            return (
              <DropdownMenuItem
                key={lang}
                onClick={() => onSelect(lang as Language)}
                className={`flex justify-between cursor-pointer ${
                  isActive
                    ? "bg-white/10 text-blue-400"
                    : "text-stone-300"
                }`}
              >
                <span className="capitalize">{lang}</span>
                <span className="text-xs text-stone-500">
                  ({version})
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;