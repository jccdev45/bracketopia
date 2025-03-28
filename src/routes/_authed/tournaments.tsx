import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_authed/tournaments")({
  component: TournamentsLayout,
});

function TournamentsLayout() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6 px-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-bold text-3xl">Tournaments</h1>
          <div className="relative w-full max-w-md">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tournaments..."
              className="w-full rounded-lg border bg-background py-2 pr-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
