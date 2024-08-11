import { useEffect, useState } from "react";
import { EditingState, ViewState } from "@devexpress/dx-react-scheduler";
import {
    AllDayPanel,
    AppointmentForm,
    Appointments,
    AppointmentTooltip,
    DateNavigator,
    DayView,
    EditRecurrenceMenu,
    MonthView,
    Scheduler,
    TodayButton,
    Toolbar,
    ViewSwitcher,
    WeekView,
} from "@devexpress/dx-react-scheduler-material-ui";
import { Paper } from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";

import { addAppointmentDb, deleteAppointmentDb, updateAppointmentDb } from "../firebase/appointments";
import { db } from "../firebase/firestore";
import { LocaleSwitcher } from "./Locale";

const SchedulerComponent = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const [locale, setLocale] = useState("pl-PL");
    const [appointments, setAppointments] = useState([]);
    const [addedAppointment, setAddedAppointment] = useState({});
    const [appointmentChanges, setAppointmentChanges] = useState({});
    const [editingAppointment, setEditingAppointment] = useState(undefined);

    useEffect(() => {
        const appointmentsDocs = onSnapshot(collection(db, "appointments"), (querySnapshot) => {
            const appointmentsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setAppointments(appointmentsData);

            return appointmentsData;
        });

        return () => appointmentsDocs();
    }, []);

    const commitChanges = ({ added, changed, deleted }) => {
        if (added) {
            addAppointmentDb(db, {
                ...added,
                startDate: added.startDate.toString(),
                endDate: added.endDate.toString(),
            });
        }

        if (changed) {
            const changedKey = Object.keys(changed)[0];
            const editedAppointment = appointments.find((appointment) => appointment.id === changedKey);
            const changedAppointment = { ...editedAppointment, ...changed[changedKey] };

            updateAppointmentDb(db, {
                ...changedAppointment,
                startDate: changedAppointment.startDate.toString(),
                endDate: changedAppointment.endDate.toString(),
            });
        }

        if (deleted) {
            const deletedAppointment = appointments.find((appointment) => appointment.id === deleted);

            deleteAppointmentDb(db, deletedAppointment);
        }
    };

    const changeLocale = (e) => setLocale(e.target.value);

    const translateName = (locale) => {
        let translateDay = "";
        let translateWeek = "";
        let translateMonth = "";

        switch (locale) {
            case "pl-PL":
                translateDay = "Dzień";
                translateWeek = "Tydzień";
                translateMonth = "Miesiąc";
                break;
            case "en-US":
                translateDay = "Day";
                translateWeek = "Week";
                translateMonth = "Month";
                break;
            default:
                translateDay = "Day";
                translateWeek = "Week";
                translateMonth = "Month";
        }

        return {
            day: translateDay,
            week: translateWeek,
            month: translateMonth,
        };
    };

    return (
        <div>
            <LocaleSwitcher currentLocale={locale} onLocaleChange={changeLocale} />
            <Paper>
                <Scheduler data={appointments} locale={locale}>
                    <ViewState defaultCurrentDate={currentDate} defaultCurrentViewName="Month" />
                    <DayView displayName={translateName(locale).day} />
                    <WeekView displayName={translateName(locale).week} />
                    <MonthView displayName={translateName(locale).month} />
                    <Toolbar />
                    <DateNavigator />
                    <TodayButton />
                    <ViewSwitcher />
                    <AllDayPanel />
                    <EditingState
                        onCommitChanges={commitChanges}
                        addedAppointment={addedAppointment}
                        onAddedAppointmentChange={setAddedAppointment}
                        appointmentChanges={appointmentChanges}
                        onAppointmentChangesChange={setAppointmentChanges}
                        editingAppointment={editingAppointment}
                        onEditingAppointmentChange={setEditingAppointment}
                    />
                    <EditRecurrenceMenu />
                    <Appointments />
                    <AppointmentTooltip showOpenButton showDeleteButton />
                    <AppointmentForm />
                </Scheduler>
            </Paper>
        </div>
    );
};

export { SchedulerComponent };
