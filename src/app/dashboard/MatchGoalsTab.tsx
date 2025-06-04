interface Event {
  type: string;
  team: { logo: string; name: string };
  player?: { name: string };
  assist?: { name: string };
  time: { elapsed: number };
  detail?: string;
}

interface MatchGoalsTabProps {
  match: any;
  events?: { [fixtureId: number]: Event[] };
  loadingEvents?: { [fixtureId: number]: boolean };
}

export default function MatchGoalsTab({
  match,
  events = {},
  loadingEvents = {},
}: MatchGoalsTabProps) {
  const fixtureId = match.fixture.id;
  const loading = loadingEvents[fixtureId];
  const eventsList = events[fixtureId] || [];

  function renderGoals(eventsList: Event[]) {
    if (!eventsList) return null;
    const goals = eventsList.filter(e => e.type === "Goal");
    if (goals.length === 0)
      return (
        <div className="text-xs italic text-gray-500">
          Nenhum goleador disponível.
        </div>
      );
    return (
      <div className="flex flex-wrap gap-2 mt-2 md:ml-8">
        {goals.map((event, i) => (
          <span
            key={i}
            className="bg-green-100 text-green-700 rounded px-2 py-0.5 text-xs flex items-center"
          >
            <img
              src={event.team.logo}
              alt={event.team.name}
              className="w-4 h-4 mr-1"
              loading="eager"
              style={{ background: "#fff", borderRadius: 2 }}
            />
            <span>
              {event.player?.name || "-"}
              {event.assist?.name ? ` (Assist: ${event.assist.name})` : ""}
              {" "}
              {event.time.elapsed}'
              {event.detail && event.detail !== "Normal Goal" ? ` (${event.detail})` : ""}
            </span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-fadeIn mt-2 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 rounded-xl p-3">
      {loading ? (
        <div className="text-center py-3 text-gray-500">Carregando goleadores...</div>
      ) : (
        renderGoals(eventsList)
      )}
    </div>
  );
}