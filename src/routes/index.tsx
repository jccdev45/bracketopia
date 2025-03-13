// index.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES } from "@/constants/data";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { user } = Route.useRouteContext();

  return (
    <div className="relative isolate">
      {/* Hero Section */}
      <section className="relative bg-primary dark:bg-primary/30">
        <div className="-z-10 absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-br from-indigo-300/30 via-purple-300/30 to-pink-300/30 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_70%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center text-primary-foreground">
            <div className="mb-6 flex items-center justify-center">
              <Trophy className="h-12 w-12 animate-float text-primary-foreground" />
            </div>
            <h1 className="animate-gradient bg-gradient-to-r from-violet-300/50 to-violet-600/90 bg-clip-text font-bold text-4xl text-transparent tracking-tight sm:text-6xl">
              BracketOpia
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/75 leading-8">
              Create and manage tournament brackets with ease. Organize
              competitions, approve participants, and track results all in one
              place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <Button asChild size="lg" variant="secondary" className="group">
                  <Link to="/tournaments">
                    Browse Tournaments
                    <ArrowRight className="ml-2 h-4 w-4 text-accent-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="group"
                  >
                    <Link to="/register">
                      <span className="text-primary-foreground">
                        Get Started
                      </span>
                      <ArrowRight className="ml-2 h-4 w-4 text-primary-foreground transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    size="lg"
                    className="text-primary-foreground"
                  >
                    <Link to="/login">
                      <span className="text-primary-foreground">Login</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="animate-gradient bg-gradient-to-r from-primary/70 to-primary/90 bg-clip-text font-bold text-3xl text-transparent tracking-tight sm:text-4xl">
            Effortless Tournament Management
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed to make running tournaments simple and
            fun.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:max-w-none lg:grid-cols-2">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="transition-colors duration-100 ease-in-out hover:bg-muted/50"
            >
              <CardContent className="p-6">
                <feature.icon className="mb-4 h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                <h3 className="mb-2 font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate mt-16 bg-secondary dark:bg-secondary/10">
        <div
          className="-z-10 absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_70%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center text-secondary-foreground">
            <h2 className="animate-gradient bg-gradient-to-r from-primary/70 to-primary/90 bg-clip-text font-bold text-3xl text-transparent tracking-tight sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-secondary-foreground/75">
              BracketOpia is trusted by thousands of organizers to run smooth,
              fair, and memorable tournaments. Join the community today!
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-x-6">
              <Button
                asChild
                size="lg"
                className="group w-full bg-primary text-primary-foreground transition-all duration-200 ease-in-out sm:w-auto"
              >
                <Link to="/register">
                  <span className="text-primary-foreground">
                    Create a Tournament Now
                  </span>
                  <ArrowRight className="ml-2 h-4 w-4 text-primary-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-secondary text-secondary-foreground transition-colors duration-200 ease-in-out sm:w-auto"
                asChild
              >
                <Link to="/login">
                  <span className="text-secondary-foreground">
                    Login to Manage Your Tournaments
                  </span>
                </Link>
              </Button>
            </div>
            <div className="mt-8">
              <p className="text-base text-secondary-foreground/75">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-secondary-foreground/90 underline transition-colors duration-200 ease-in-out hover:text-secondary-foreground"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
