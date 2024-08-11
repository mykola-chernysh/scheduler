import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";

const addAppointmentDb = async (db, appointment) => {
    try {
        await addDoc(collection(db, "appointments"), appointment);
    } catch (error) {
        console.log(error);
    }
};

const updateAppointmentDb = async (db, appointment) => {
    const appointmentRef = doc(db, "appointments", appointment.id);

    try {
        await updateDoc(appointmentRef, {
            title: appointment.title,
            notes: appointment.notes,
            allDay: appointment.allDay,
            startDate: appointment.startDate,
            endDate: appointment.endDate,
        });
    } catch (error) {
        console.log(error);
    }
};

const deleteAppointmentDb = async (db, appointment) => {
    const appointmentRef = doc(db, "appointments", appointment.id);

    try {
        await deleteDoc(appointmentRef);
    } catch (error) {
        console.log(error);
    }
};

export { addAppointmentDb, updateAppointmentDb, deleteAppointmentDb };
