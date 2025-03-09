import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchUser } from "@/utils/user";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Menu, User } from "lucide-react";

export function Header() {
	const getUser = useServerFn(fetchUser);

	const { data: user } = useQuery({
		queryKey: ["user"],
		queryFn: () => getUser(),
	});

	return (
		<nav className="bg-white border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<div className="shrink-0 flex items-center">
							<Link to="/" className="text-xl font-bold text-gray-900">
								BracketOpia
							</Link>
						</div>
						<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
							<Link
								to="/"
								className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
							>
								Home
							</Link>
							<Link
								to="/tournaments"
								className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
							>
								Tournaments
							</Link>
						</div>
					</div>
					<div className="hidden sm:ml-6 sm:flex sm:items-center">
						{user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<User className="h-5 w-5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>My Account</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link to="/profile">Profile</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link to="/my-tournaments">My Tournaments</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link to="/logout">Logout</Link>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<div className="flex space-x-2">
								<Button variant="outline" asChild>
									<Link to="/login">Login</Link>
								</Button>
								<Button asChild>
									<Link to="/register">Register</Link>
								</Button>
							</div>
						)}
					</div>
					<div className="flex items-center sm:hidden">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<Menu className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem asChild>
									<Link to="/">Home</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link to="/tournaments">Tournaments</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								{user ? (
									<>
										<DropdownMenuItem asChild>
											<Link to="/profile">Profile</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link to="/my-tournaments">My Tournaments</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild>
											<Link to="/logout">Logout</Link>
										</DropdownMenuItem>
									</>
								) : (
									<>
										<DropdownMenuItem asChild>
											<Link to="/login">Login</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link to="/register">Register</Link>
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</nav>
	);
}
