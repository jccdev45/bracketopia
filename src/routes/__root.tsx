import { DefaultCatchBoundary } from "@/components/default-catch-boundary";
import { Toaster } from "@/components/ui/sonner";
import { seo } from "@/utils/seo";
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/Header";
import TanstackQueryLayout from "../integrations/tanstack-query/layout";
import TanstackQueryProvider from "../integrations/tanstack-query/provider";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			...seo({
				title: "Bracketopia",
				description: `Create and manage tournament brackets with ease. Organize
            competitions, approve participants, and track results all in one
            place.`,
			}),
		],
		// TODO: Add icons
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{ rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
			{ rel: "icon", href: "/favicon.ico" },
		],
	}),
	errorComponent: (props) => {
		return (
			<RootDocument>
				<DefaultCatchBoundary {...props} />
			</RootDocument>
		);
	},
	component: () => (
		<RootDocument>
			<TanstackQueryProvider>
				<Toaster />
				<Header />

				<Outlet />
				<TanStackRouterDevtools />

				<TanstackQueryLayout />
			</TanstackQueryProvider>
		</RootDocument>
	),
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en-US">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
