import type { Database } from "@/integrations/supabase/generated.types";
import { copycat, faker } from "@snaplet/copycat";
import { createSeedClient, type profilesScalars } from "@snaplet/seed";
import { createClient } from "@supabase/supabase-js";

const main = async () => {
const seed = await createSeedClient({
  dryRun: true
});

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
const PASSWORD = "password";

// Reset database
await seed.$resetDatabase();

for (let i = 0; i < 5; i += 1) {
  // console.log(`Creating user ${i + 1}`)
  const email = copycat.email(i).toLowerCase();
  const avatar_url = faker.image.avatar();
  const username = copycat.username(i);
  await supabase.auth.signUp({
    email,
    password: PASSWORD,
    options: {
      data: {
        avatar_url,
        username,
      },
    },
  });
}

const { data: databaseProfiles } = await supabase.from("profiles").select();
const profiles: profilesScalars[] =
  databaseProfiles?.map((profile) => ({
    avatar_url: profile.avatar_url,
    id: profile.id,
    username: profile.username,
  })) ?? [];

// Create profiles
// const profiles = await seed.profiles((x) =>
//   x(3, {
//     username: (ctx) => copycat.username(ctx.seed).toLowerCase(),
//     // avatar_url: (ctx) => `https://placehold.co/100/png?text=${ctx.data.username}`,
//     // avatar_url: ({ seed }) => faker.image.avatar()
//   })
// );

// Create tournament
await seed.tournaments((x) =>
  x(1, ({ index }) => {
    return {
      tournament_brackets: (x) => x(1, {
        structure: {
          rounds: 3,
          matches: [],
        },
        current_round: 1,
      }),
      tournament_matches: (x) => x(1, ({ index }) => {
        return {
          round: 1,
          match_number: index + 1,
          status: "pending",
        }
      }),
      tournament_moderators: (x) => x(1),
      tournament_participants: (x) => x(1),
      title: `Tournament ${index + 1}`,
      description: (ctx) => copycat.words(ctx.seed, { min: 3, max: 10}),
      max_participants: (ctx) => copycat.int(ctx.seed, { min: 2, max: 16 }),
      registration_open: (ctx) => copycat.bool(ctx.seed),
      // creator_id: (ctx) => ctx.$store.profiles[Math.floor(Math.random() * ctx.$store.profiles.length)].id,
    }
  }),
  { connect: { profiles } }
);

// Create tournament participants
// const participants = await seed.tournament_participants((x) =>
//   x(3),
//   { connect: tournament }
// );

// Create tournament bracket
// await seed.tournament_brackets((x) =>
//   x(3, {
//     structure: {
//       rounds: 3,
//       matches: [],
//     },
//     current_round: 1,
//   })
// );

// Create first round matches
// await seed.tournament_matches((x) =>
//   x(3, ({ index }) => ({
//     round: 1,
//     match_number: index + 1,
//     status: "pending",
//   })),
//   { connect: participants }
// );

// Create moderators
// await seed.tournament_moderators((x) =>
//   x(profiles.profiles.length),
//   { connect: profiles }
// )

  process.exit();
};

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
