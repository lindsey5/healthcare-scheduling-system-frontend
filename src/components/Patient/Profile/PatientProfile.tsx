import useUpdatePatientOwn from "../../../hooks/patient/use-update-patient-own.hook"
import type { ProfileFormData } from "../../../schemas/profileSchema";
import { promiseToast } from "../../../utils/utils";
import Profile from "../../shared/Profile"

export default function PatientProfile () {
    const updatePatientMutation = useUpdatePatientOwn();

    const handleSubmit = (data : ProfileFormData) => {
        promiseToast(updatePatientMutation.mutateAsync(data));
    }

    return (
        <Profile submit={handleSubmit} loading={updatePatientMutation.isPending} />
    )
}