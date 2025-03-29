import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  TOURNAMENT_CATEGORIES as BASE_CATEGORIES,
  type TournamentCategory,
} from "@/constants/data";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

interface CategoryComboboxProps {
  value: TournamentCategory | string;
  onChange: (value: TournamentCategory | string) => void;
  className?: string;
  allowCustom?: boolean;
}

export function CategoryCombobox({
  value,
  onChange,
  className,
  allowCustom = true,
}: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [customCategory, setCustomCategory] = React.useState("");
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [customCategories, setCustomCategories] = React.useState<string[]>([]);

  // Combine base and custom categories
  const allCategories = [...BASE_CATEGORIES, ...customCategories];

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === "custom") {
      setShowCustomInput(true);
    } else {
      onChange(selectedValue);
      setOpen(false);
    }
  };

  const handleAddCustomCategory = () => {
    const trimmedCategory = customCategory.trim();
    if (trimmedCategory) {
      // Add to custom categories if it's new
      if (!allCategories.includes(trimmedCategory)) {
        setCustomCategories([...customCategories, trimmedCategory]);
      }
      onChange(trimmedCategory);
      setCustomCategory("");
      setShowCustomInput(false);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value || "Select category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {allCategories.map((category) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={handleSelect}
                >
                  {category}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === category ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
              {allowCustom && (
                <CommandItem value="custom" onSelect={handleSelect}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add new category
                </CommandItem>
              )}
            </CommandGroup>

            {showCustomInput && (
              <div className="border-t p-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter new category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomCategory();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={handleAddCustomCategory}
                    disabled={!customCategory.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
