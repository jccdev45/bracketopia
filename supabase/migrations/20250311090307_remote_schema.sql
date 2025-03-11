

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tournament_brackets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tournament_id" "uuid" NOT NULL,
    "structure" "jsonb" NOT NULL,
    "current_round" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."tournament_brackets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tournament_matches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tournament_id" "uuid" NOT NULL,
    "bracket_id" "uuid" NOT NULL,
    "round" integer NOT NULL,
    "match_number" integer NOT NULL,
    "participant1_id" "uuid",
    "participant2_id" "uuid",
    "winner_id" "uuid",
    "status" "text" DEFAULT 'pending'::"text",
    "score_participant1" integer,
    "score_participant2" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."tournament_matches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tournament_moderators" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tournament_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."tournament_moderators" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tournament_participants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tournament_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "seed" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."tournament_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tournaments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "creator_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "max_participants" integer NOT NULL,
    "registration_open" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."tournaments" OWNER TO "postgres";


ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."tournament_brackets"
    ADD CONSTRAINT "tournament_brackets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tournament_brackets"
    ADD CONSTRAINT "tournament_brackets_tournament_id_key" UNIQUE ("tournament_id");



ALTER TABLE ONLY "public"."tournament_matches"
    ADD CONSTRAINT "tournament_matches_bracket_id_round_match_number_key" UNIQUE ("bracket_id", "round", "match_number");



ALTER TABLE ONLY "public"."tournament_matches"
    ADD CONSTRAINT "tournament_matches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tournament_moderators"
    ADD CONSTRAINT "tournament_moderators_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tournament_moderators"
    ADD CONSTRAINT "tournament_moderators_tournament_id_user_id_key" UNIQUE ("tournament_id", "user_id");



ALTER TABLE ONLY "public"."tournament_participants"
    ADD CONSTRAINT "tournament_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tournament_participants"
    ADD CONSTRAINT "tournament_participants_tournament_id_user_id_key" UNIQUE ("tournament_id", "user_id");



ALTER TABLE ONLY "public"."tournaments"
    ADD CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_brackets"
    ADD CONSTRAINT "tournament_brackets_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_matches"
    ADD CONSTRAINT "tournament_matches_bracket_id_fkey" FOREIGN KEY ("bracket_id") REFERENCES "public"."tournament_brackets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_matches"
    ADD CONSTRAINT "tournament_matches_participant1_id_fkey" FOREIGN KEY ("participant1_id") REFERENCES "public"."tournament_participants"("id");



ALTER TABLE ONLY "public"."tournament_matches"
    ADD CONSTRAINT "tournament_matches_participant2_id_fkey" FOREIGN KEY ("participant2_id") REFERENCES "public"."tournament_participants"("id");



ALTER TABLE ONLY "public"."tournament_matches"
    ADD CONSTRAINT "tournament_matches_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_matches"
    ADD CONSTRAINT "tournament_matches_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "public"."tournament_participants"("id");



ALTER TABLE ONLY "public"."tournament_moderators"
    ADD CONSTRAINT "tournament_moderators_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_moderators"
    ADD CONSTRAINT "tournament_moderators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_moderators"
    ADD CONSTRAINT "tournament_moderators_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_participants"
    ADD CONSTRAINT "tournament_participants_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_participants"
    ADD CONSTRAINT "tournament_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_participants"
    ADD CONSTRAINT "tournament_participants_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournaments"
    ADD CONSTRAINT "tournaments_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."tournaments"
    ADD CONSTRAINT "tournaments_creator_id_fkey1" FOREIGN KEY ("creator_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



CREATE POLICY "Brackets are viewable by everyone" ON "public"."tournament_brackets" FOR SELECT USING (true);



CREATE POLICY "Matches are viewable by everyone" ON "public"."tournament_matches" FOR SELECT USING (true);



CREATE POLICY "Moderators are viewable by everyone" ON "public"."tournament_moderators" FOR SELECT USING (true);



CREATE POLICY "Participants are viewable by everyone" ON "public"."tournament_participants" FOR SELECT USING (true);



CREATE POLICY "Public profiles are viewable by everyone" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Tournament creators and moderators can manage brackets" ON "public"."tournament_brackets" USING (((EXISTS ( SELECT 1
   FROM "public"."tournaments" "t"
  WHERE (("t"."id" = "tournament_brackets"."tournament_id") AND ("t"."creator_id" = "auth"."uid"())))) OR (EXISTS ( SELECT 1
   FROM "public"."tournament_moderators" "m"
  WHERE (("m"."tournament_id" = "m"."tournament_id") AND ("m"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Tournament creators and moderators can manage matches" ON "public"."tournament_matches" USING (((EXISTS ( SELECT 1
   FROM "public"."tournaments" "t"
  WHERE (("t"."id" = "tournament_matches"."tournament_id") AND ("t"."creator_id" = "auth"."uid"())))) OR (EXISTS ( SELECT 1
   FROM "public"."tournament_moderators" "m"
  WHERE (("m"."tournament_id" = "m"."tournament_id") AND ("m"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Tournament creators and moderators can update participants" ON "public"."tournament_participants" FOR UPDATE USING (((EXISTS ( SELECT 1
   FROM "public"."tournaments" "t"
  WHERE (("t"."id" = "tournament_participants"."tournament_id") AND ("t"."creator_id" = "auth"."uid"())))) OR (EXISTS ( SELECT 1
   FROM "public"."tournament_moderators" "m"
  WHERE (("m"."tournament_id" = "m"."tournament_id") AND ("m"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Tournament creators can delete" ON "public"."tournaments" FOR DELETE USING (("auth"."uid"() = "creator_id"));



CREATE POLICY "Tournament creators can insert" ON "public"."tournaments" FOR INSERT WITH CHECK (("auth"."uid"() = "creator_id"));



CREATE POLICY "Tournament creators can manage moderators" ON "public"."tournament_moderators" USING ((EXISTS ( SELECT 1
   FROM "public"."tournaments" "t"
  WHERE (("t"."id" = "tournament_moderators"."tournament_id") AND ("t"."creator_id" = "auth"."uid"())))));



CREATE POLICY "Tournament creators can update" ON "public"."tournaments" FOR UPDATE USING (("auth"."uid"() = "creator_id"));



CREATE POLICY "Tournaments are viewable by everyone" ON "public"."tournaments" FOR SELECT USING (true);



CREATE POLICY "Users can apply to tournaments" ON "public"."tournament_participants" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND ( SELECT "tournaments"."registration_open"
   FROM "public"."tournaments"
  WHERE ("tournaments"."id" = "tournament_participants"."tournament_id"))));



CREATE POLICY "Users can update their own applications" ON "public"."tournament_participants" FOR UPDATE USING ((("auth"."uid"() = "user_id") AND ("status" = 'pending'::"text")));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tournament_brackets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tournament_matches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tournament_moderators" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tournament_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tournaments" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."tournament_brackets" TO "anon";
GRANT ALL ON TABLE "public"."tournament_brackets" TO "authenticated";
GRANT ALL ON TABLE "public"."tournament_brackets" TO "service_role";



GRANT ALL ON TABLE "public"."tournament_matches" TO "anon";
GRANT ALL ON TABLE "public"."tournament_matches" TO "authenticated";
GRANT ALL ON TABLE "public"."tournament_matches" TO "service_role";



GRANT ALL ON TABLE "public"."tournament_moderators" TO "anon";
GRANT ALL ON TABLE "public"."tournament_moderators" TO "authenticated";
GRANT ALL ON TABLE "public"."tournament_moderators" TO "service_role";



GRANT ALL ON TABLE "public"."tournament_participants" TO "anon";
GRANT ALL ON TABLE "public"."tournament_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."tournament_participants" TO "service_role";



GRANT ALL ON TABLE "public"."tournaments" TO "anon";
GRANT ALL ON TABLE "public"."tournaments" TO "authenticated";
GRANT ALL ON TABLE "public"."tournaments" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
