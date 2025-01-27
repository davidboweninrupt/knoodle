import CustomCalendar from "../components/CustomCalendar";
import { fetchParticipantWebIdData } from "../utils/participantsHelper";
import { downloadSelectedAvailability } from "../utils/calendarHelper";
import { createAvailabilityEvents } from "../utils/calendarHelper";
import { useSession } from "@inrupt/solid-ui-react";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

export default function Availability() {
  const { session } = useSession();
  const solidFetch = session.fetch;
  const webId = session.info.webId;
  const participants = {};
  const [availableEvents, setAvailableEvents] = useState([]);

  useEffect(() => {
    async function getAvailability() {
      participants[webId] = {};

      await fetchParticipantWebIdData(participants, solidFetch, null, null);
      downloadSelectedAvailability([webId], participants, solidFetch)
        .then((ret) => {
          let calendars = ret["calendars"];
          createAvailabilityEvents(calendars[0], setAvailableEvents, null);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    getAvailability();
  }, []);

  return (
    <>
      <h3>View your availability:</h3>
      <Box sx={{ height: "80vh", mx: 3 }}>
        <CustomCalendar
          availableEvents={availableEvents}
          vacationEvents={[]}
          clickEvent={() => {}}
        />
      </Box>
    </>
  );
}
