import { copycat } from "@snaplet/copycat";
import { createSeedClient } from "@snaplet/seed";
// import type { MatchStatus } from "@/types/tournament.types";

const generateRandomColor = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
};
const profilesNum = 50;
// const tournamentsNum = 12;

const main = async () => {
  const seed = await createSeedClient({
    dryRun: true,
  });
  await seed.$resetDatabase();

  await seed.profiles((x) =>
    x(profilesNum, ({ seed }) => {
      const email = copycat.email(seed);
      const username = copycat.username(seed);
      const avatar_url = `https://placehold.co/100/${generateRandomColor()}/${generateRandomColor()}?text=${username.charAt(0)}`;

      return {
        username,
        avatar_url,
        users: () => {
          return {
            email,
            password: "password",
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

  // const { profiles } = profilesStore;

  // const successfulUsers = profiles.filter((user) => user !== null);
  // const userIds = successfulUsers
  //   .map((user) => user?.id)
  //   .filter((id) => id !== undefined);

  // await seed.tournaments(
  //   (x) =>
  //     x(tournamentsNum, ({ seed, index }) => ({
  //       title: `Tournament ${index + 1}`,
  //       description: copycat.words(seed, { min: 3, max: 10 }),
  //       max_participants: copycat.int(seed, { min: 8, max: 32 }),
  //       registration_open: copycat.bool(seed),
  //       brackets: (x) =>
  //         x(1, () => ({
  //           structure: {
  //             rounds: 3,
  //             matches: [],
  //           },
  //           current_round: 1,
  //         })),
  //       matches: (x) =>
  //         x(Math.min(10, 8 * 2), () => {
  //           const statuses: MatchStatus[] = [
  //             "pending",
  //             "completed",
  //             "cancelled",
  //           ];
  //           const status = copycat.oneOf(seed, statuses) as MatchStatus;
  //           return {
  //             round: 1,
  //             match_number: index + 1,
  //             status: status,
  //             ...(status === "completed"
  //               ? {
  //                   score_participant1: copycat.int(seed, { min: 0, max: 10 }),
  //                   score_participant2: copycat.int(seed, { min: 0, max: 10 }),
  //                 }
  //               : {}),
  //           };
  //         }),
  //         moderators: (x) =>
  //           x(2, () => ({ user_id: copycat.oneOf(seed, profiles.map(p=>p.id)) })),
  //       participants: (x) =>
  //           x(8, () => ({ user_id: copycat.oneOf(seed, profiles.map(p=>p.id)) })),
  //     })),
  //   {
  //     connect: {
  //       profiles: profiles.map(({ id }) => ({ id }))
  //     },
  //   }
  // );

  process.exit();
};

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
