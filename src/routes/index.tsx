import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Filter,
  GanttChartSquare,
  LayoutGrid,
  ListFilter,
  LogOut,
  Medal,
  Plus,
  RotateCw,
  Settings,
  Trophy,
  Users,
} from "lucide-react";

const FEATURES = [
  {
    title: "Dynamic Bracket Creation",
    description:
      "Our intelligent system adapts to your tournament format, whether it's single elimination, round-robin, or Swiss pairing. No more manual adjustments!",
    icon: GanttChartSquare,
    color: "text-chart-1",
  },
  {
    title: "Participant Flow",
    description:
      "From open registration to invite-only events, manage participants with our flexible system that scales from 8 to 8,000 competitors.",
    icon: Users,
    color: "text-chart-2",
  },
  {
    title: "Live Bracket Magic",
    description:
      "Watch brackets update in real-time as matches conclude. Our system automatically advances winners and updates standings instantly.",
    icon: RotateCw,
    color: "text-chart-3",
  },
  {
    title: "Smart Seeding",
    description:
      "Our algorithms analyze player ratings or randomize seeds to create perfectly balanced matchups from the start.",
    icon: Filter,
    color: "text-chart-4",
  },
  {
    title: "Custom Rule Engine",
    description:
      "Define your own scoring systems, tiebreakers, and special rules that automatically enforce your tournament's unique requirements.",
    icon: Settings,
    color: "text-chart-5",
  },
  {
    title: "Multi-Format Support",
    description:
      "Run concurrent tournaments with different formats. Mix and match brackets, pools, and leagues in a single event.",
    icon: LayoutGrid,
    color: "text-primary",
  },
];

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Esports Tournament Organizer",
    quote:
      "Bracketopia cut our setup time by 80%. We now run weekly tournaments with zero administrative headaches.",
  },
  {
    name: "Jamie Chen",
    role: "College Intramural Director",
    quote:
      "The students love the live updates. We've doubled participation since switching to Bracketopia.",
  },
  {
    name: "Morgan Kessler",
    role: "Community Chess Club",
    quote:
      "Finally, a system that understands Swiss pairings! Our tournaments run smoother than ever.",
  },
];

const TOURNAMENT_TYPES = [
  { name: "Single Elimination", count: "1,200+ weekly" },
  { name: "Double Elimination", count: "800+ weekly" },
  { name: "Round Robin", count: "500+ weekly" },
  { name: "Swiss System", count: "300+ weekly" },
  { name: "Battle Royale", count: "200+ weekly" },
  { name: "Custom Formats", count: "400+ weekly" },
];

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { user } = Route.useRouteContext();

  return (
    <div className="relative isolate overflow-hidden">
      {/* Floating background elements */}
      <div className="-z-50 absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-1/3 bottom-1/3 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="-z-10 absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[length:60px_60px] bg-[url('/grid.svg')] opacity-5 dark:opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <div className="mb-8 flex w-fit items-center gap-x-4 rounded-full bg-accent px-4 py-2 text-accent-foreground text-sm leading-6 ring-1 ring-accent/10 dark:ring-accent/20">
              <span className="font-semibold text-primary">New</span>
              <span className="h-1 w-1 rounded-full bg-accent-foreground/50" />
              <span>Automated seeding now available</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </div>

            <h1 className="font-bold text-5xl tracking-tight sm:text-7xl">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Tournament Brackets
              </span>
              <br />
              <span className="text-foreground">Reimagined</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-8">
              Bracketopia transforms how you create, manage, and experience
              tournaments. From local gaming nights to professional esports, our
              platform adapts to your competitive vision.
            </p>

            <div className="mt-10 flex items-center gap-x-6">
              {user ? (
                <Button asChild size="lg" className="group">
                  <Link to="/tournaments">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="group">
                    <Link to="/register">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link to="/login">
                      <LogOut className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                </>
              )}
            </div>

            <div className="mt-10 flex items-center gap-x-8">
              <div className="-space-x-4 flex">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-background"
                    src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${i + 20}.jpg`}
                    alt="User avatar"
                  />
                ))}
              </div>
              <div className="text-sm leading-6">
                <p className="font-semibold text-foreground">
                  Trusted by thousands of organizers
                </p>
                <p className="text-muted-foreground">
                  Creating {Math.floor(Math.random() * 2000) + 1000} tournaments
                  this week
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <div className="relative rounded-2xl bg-muted/20 p-2 shadow-2xl ring-1 ring-muted/10 dark:ring-muted/20">
              <div className="-top-16 -z-10 -translate-x-1/2 absolute left-1/2 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl" />
              <div className="overflow-hidden rounded-xl">
                {/* Replace with your actual screenshot or illustration */}
                <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <Trophy className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
        <h2 className="text-center font-semibold text-muted-foreground text-sm leading-7">
          POWERING TOURNAMENTS FOR
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-6">
          {[
            "Esports Leagues",
            "College Sports",
            "Board Game Cafés",
            "Local Sports",
            "Chess Clubs",
            "Trivia Nights",
          ].map((name) => (
            <div
              key={name}
              className="col-span-1 flex justify-center text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="-z-10 absolute inset-0 overflow-hidden">
          <div className="-translate-x-1/2 absolute top-0 left-1/2 h-[50rem] w-[50rem] rounded-full bg-gradient-to-b from-primary/10 to-transparent opacity-30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tournament
            </span>{" "}
            Features That Shine
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to run flawless competitions, plus innovations
            you didn't know you needed.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="-z-10 absolute inset-0 bg-gradient-to-br from-background to-muted/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tournament Types Section */}
      <section className="relative bg-accent dark:bg-accent/10">
        <div className="-z-10 absolute inset-0 overflow-hidden">
          <div className="-translate-x-1/2 absolute top-0 left-1/2 h-[50rem] w-[50rem] rounded-full bg-gradient-to-b from-secondary/10 to-transparent opacity-30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
              Formats for{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Every Competition
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you're running a casual event or professional
              championship, we've got you covered.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {TOURNAMENT_TYPES.map((type) => (
                <div
                  key={type.name}
                  className="flex flex-col items-center justify-center"
                >
                  <dt className="flex items-center gap-x-3 font-semibold text-base text-foreground leading-7">
                    <Medal className="h-5 w-5 text-primary" />
                    {type.name}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base text-muted-foreground leading-7">
                    <p className="flex-auto">{type.count}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="-z-10 absolute inset-0 overflow-hidden">
          <div className="-translate-x-1/2 absolute top-0 left-1/2 h-[50rem] w-[50rem] rounded-full bg-gradient-to-b from-accent/10 to-transparent opacity-30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Organizers
            </span>{" "}
            Love Bracketopia
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Don't just take our word for it—here's what our community says.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.name} className="relative overflow-hidden">
              <div className="-right-10 -top-10 absolute h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
              <CardContent className="relative pt-8">
                <blockquote className="text-lg text-muted-foreground leading-7">
                  <p>"{testimonial.quote}"</p>
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="font-bold text-primary">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </figcaption>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-primary/10 to-secondary/10">
        <div className="-z-10 absolute inset-0 overflow-hidden">
          <div className="-translate-x-1/2 absolute top-0 left-1/2 h-[50rem] w-[50rem] rounded-full bg-gradient-to-b from-primary/20 to-transparent opacity-30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
              Ready to Transform Your Tournaments?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-8">
              Join thousands of organizers who trust Bracketopia for their
              competitive events.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-x-6">
              <Button asChild size="lg" className="group w-full sm:w-auto">
                <Link to={user ? "/tournaments/create" : "/register"}>
                  <span>Start Creating</span>
                  <Plus className="ml-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                asChild
              >
                <Link to="/tournaments">
                  <span>Browse Tournaments</span>
                  <ListFilter className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
