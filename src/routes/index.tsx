import { Button } from "@/components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const { user } = Route.useRouteContext();

	return (
		<div className="relative isolate px-6 pt-14 lg:px-8">
			<div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
						BracketOpia
					</h1>
					<p className="mt-6 text-lg leading-8 text-balance">
						Create and manage tournament brackets with ease. Organize
						competitions, approve participants, and track results all in one
						place.
					</p>
					<div className="mt-10 flex items-center justify-center gap-x-6">
						{user ? (
							<Button asChild size="lg">
								<Link to="/tournaments">Browse Tournaments</Link>
							</Button>
						) : (
							<>
								<Button asChild size="lg">
									<Link to="/register">Get Started</Link>
								</Button>
								<Button variant="outline" asChild size="lg">
									<Link to="/login">Login</Link>
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
