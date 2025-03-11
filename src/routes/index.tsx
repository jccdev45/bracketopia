import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Award, Brackets, Trophy, Users, type LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const features: Feature[] = [
  {
    title: "Easy Tournament Creation",
    description: "Set up your tournament in minutes with our intuitive bracket builder",
    icon: Brackets,
  },
  {
    title: "Participant Management",
    description: "Approve and organize participants with automated seeding",
    icon: Users,
  },
  {
    title: "Real-time Updates",
    description: "Track match results and bracket progression as they happen",
    icon: Trophy,
  },
  {
    title: "Fair Competition",
    description: "Advanced algorithms ensure balanced and fair matchups",
    icon: Award,
  },
];

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { user } = Route.useRouteContext();

  return (
    <div className="relative isolate">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" 
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_70%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center mb-6">
              <Trophy className="h-12 w-12 text-primary animate-float" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              BracketOpia
            </h1>
            <p className="mt-6 text-lg leading-8 text-balance text-muted-foreground">
              Create and manage tournament brackets with ease. Organize competitions,
              approve participants, and track results all in one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <Button asChild size="lg" className="group">
                  <Link to="/tournaments">
                    Browse Tournaments
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="group">
                    <Link to="/register">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link to="/login">Login</Link>
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
            Everything you need to run successful tournaments
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed to make tournament management effortless
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:max-w-none lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="relative group overflow-hidden transition-colors hover:bg-muted/50"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardContent className="p-6">
                <feature.icon className="h-8 w-8 text-primary mb-4 transition-transform group-hover:scale-110" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-muted-foreground/10" />
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate mt-16">
        <div 
          className="absolute inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_70%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Ready to create your tournament?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of organizers who trust BracketOpia for their competitions
            </p>
            <div className="mt-10">
              {!user && (
                <Button asChild size="lg" className="group">
                  <Link to="/register">
                    Start Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
