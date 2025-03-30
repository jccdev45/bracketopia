import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { participantMutationOptions } from "@/utils/queries/participants";
import { profileQueryOptions } from "@/utils/queries/profiles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AssignParticipantProps {
  tournamentId: string;
  existingParticipantIds?: string[];
  onAssigned?: () => void;
}

export function AssignParticipant({
  tournamentId,
  existingParticipantIds = [],
  onAssigned,
}: AssignParticipantProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: profiles = [] } = useQuery({
    ...profileQueryOptions.search(search, existingParticipantIds),
  });

  const assignMutation = useMutation({
    ...participantMutationOptions.assign(),
    onSuccess: () => {
      setOpen(false);
      setSearch("");
      queryClient.invalidateQueries({
        queryKey: ["participants", tournamentId],
      });
      onAssigned?.();
      toast.success("Participant assigned successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <necessary>
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <UserPlus className="mr-2 size-4" />
          Assign Participant
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search profiles..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No profiles found.</CommandEmpty>
            <CommandGroup>
              {profiles.map((profile) => (
                <CommandItem
                  key={profile.id}
                  value={profile.username}
                  onSelect={() => {
                    assignMutation.mutate({
                      tournamentId,
                      userId: profile.id,
                    });
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src={profile.avatar_url || ""} />
                      <AvatarFallback>
                        {profile.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{profile.username}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto size-4",
                      existingParticipantIds.includes(profile.id)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
