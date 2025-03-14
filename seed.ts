import { copycat } from "@snaplet/copycat";
import { createSeedClient } from "@snaplet/seed";

const generateRandomColor = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
};

const main = async () => {
  const seed = await createSeedClient({
    // dryRun: true,
  });
  await seed.$resetDatabase();

  const profilesStore = await seed.profiles((x) =>
    x(10, ({ seed }) => {
      const email = copycat.email(seed);
      const username = copycat.username(seed);
      const avatar_url = `https://placehold.co/100/${generateRandomColor()}?text=${username.charAt(0)}`;

      return {
        username,
        avatar_url,
        users: () => {
          return {
            email,
            raw_user_meta_data: {
              avatar_url,
              username,
              display_name: username,
            },
          };
        },
      };
    })
  );
  const { profiles } = profilesStore;

  const successfulUsers = profiles.filter((user) => user !== null);
  const userIds = successfulUsers
    .map((user) => user?.id)
    .filter((id) => id !== undefined);

  await seed.tournaments(
    (x) =>
      x(12, ({ seed, index }) => ({
        title: `Tournament ${index + 1}`,
        description: copycat.words(seed, { min: 3, max: 10 }),
        max_participants: 8,
        registration_open: copycat.bool(seed),
        // creator_id: userIds[index % userIds.length],
        tournament_brackets: (x) =>
          x(1, () => ({
            structure: {
              rounds: 3,
              matches: [],
            },
            current_round: 1,
          })),
        tournament_matches: (x) =>
          x(Math.min(10, 8 * 2), () => ({
            round: 1,
            match_number: index + 1,
            status: "pending",
          })),
        tournament_moderators: (x) =>
          x(2, () => ({ user_id: copycat.oneOf(seed, userIds) })),
        tournament_participants: (x) =>
          x(8, () => ({ user_id: copycat.oneOf(seed, userIds) })),
      })),
    { connect: profilesStore }
  );

  process.exit();
};

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
