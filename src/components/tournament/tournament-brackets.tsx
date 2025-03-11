import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TournamentBracket } from "@/types/tournament.types";

interface TournamentBracketsProps {
  brackets: TournamentBracket[];
}

export function TournamentBrackets({ brackets }: TournamentBracketsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Brackets</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {brackets.map((bracket) => (
            <AccordionItem key={bracket.id} value={bracket.id}>
              <AccordionTrigger>
                <div className="flex items-center space-x-4">
                  <span>Bracket (Round {bracket.current_round})</span>
                  <Badge variant="outline">
                    {bracket.structure.rounds} Rounds
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <pre>{JSON.stringify(bracket.structure.matches, null, 2)}</pre>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
