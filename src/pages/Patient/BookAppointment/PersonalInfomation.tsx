import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Textfield from "../../../components/ui/Textfield";
import Dropdown from "../../../components/ui/Dropdown";
import Textarea from "../../../components/ui/Textarea";
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { AppointmentRecordFormData } from "../../../schemas/appointmentRecordSchema";

interface PersonalInfomationProps {
    next: () => void;
    prev: () => void;
    register: UseFormRegister<AppointmentRecordFormData>;
    setValue: UseFormSetValue<AppointmentRecordFormData>;
    errors: FieldErrors<AppointmentRecordFormData>;
    watch: UseFormWatch<AppointmentRecordFormData>;
    handleSubmit: UseFormHandleSubmit<AppointmentRecordFormData>;
}

export default function PersonalInformation ({
    next,
    prev,
    errors,
    handleSubmit,
    register,
    setValue,
    watch
} : PersonalInfomationProps) {

    return (
        <Card className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#1E3D15]">
                    Personal Information
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Please complete all required personal information before proceeding. Fields marked with <span className="text-red-600">*</span> are required
                </p>
            </div>

            <form
                className="space-y-5"
                onSubmit={handleSubmit(next)}
            >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Textfield 
                        label="First Name *"
                        placeholder="Enter your first name"
                        onChange={(e) => setValue("firstName", e.target.value.toUpperCase()) }
                        error={errors.firstName?.message}
                        value={watch('firstName')}
                    />
                    <Textfield 
                        label="Middle Name"
                        placeholder="Optional"
                        onChange={(e) => setValue("middleName", e.target.value.toUpperCase()) }
                        error={errors.middleName?.message}
                        value={watch('middleName')}
                    />
                    <Textfield 
                        label="Last Name *"
                        placeholder="Enter your last name"
                        onChange={(e) => setValue("lastName", e.target.value.toUpperCase()) }
                        error={errors.lastName?.message}
                        value={watch('lastName')}
                    />
                    <Dropdown 
                        label="Suffix *"
                        placeholder="Select Suffix"
                        options={[
                            { label: 'None', value: "N/A" },
                            { label: 'Jr', value: 'Jr' },
                            { label: 'Sr', value: 'Sr' },
                            { label: 'I', value: 'I' },
                            { label: 'II', value: 'II' },
                            { label: 'III', value: 'III' },
                            { label: 'IV', value: 'IV' },
                        ]}
                        value={watch('suffix')}
                        error={errors.suffix?.message}
                        onChange={(e) => setValue('suffix', e.target.value)}
                    />
                    <Textfield 
                        type="date"
                        label="Birth Date *"
                        value={watch('birthDate')}
                        registration={register('birthDate')}
                        error={errors.birthDate?.message}
                    />

                    <Dropdown 
                        label="Gender *"
                        placeholder="Select Gender"
                        options={[
                            { label: 'Male', value: 'Male' },
                            { label: 'Female', value: 'Female' }
                        ]}
                        value={watch('gender')}
                        onChange={(e) => setValue('gender', e.target.value)}
                        error={errors.gender?.message}
                    />

                    <Dropdown 
                        label="Civil Status *"
                        placeholder="Select Civil Status"
                        options={[
                            { label: 'Single', value: 'Single' },
                            { label: 'Married', value: 'Married' },
                            { label: 'Widowed', value: 'Widowed' },
                            { label: 'Separated', value: 'Separated' }
                        ]}
                        value={watch('civilStatus')}
                        onChange={(e) => setValue('civilStatus', e.target.value)}
                        error={errors.civilStatus?.message}
                    />

                    <Textfield 
                        label="Contact Number *"
                        placeholder="09XXXXXXXXX"
                        value={watch('contactNumber')}
                        registration={register('contactNumber')}
                        error={errors.contactNumber?.message}
                        type="number"
                    />
                    <Textfield 
                        label="Email Address"
                        placeholder="example@email.com"
                        value={watch('email')}
                        registration={register('email')}
                        error={errors.email?.message}
                    />
                </div>

                <Textarea 
                    label="Complete Address *"
                    placeholder="House No., Street, Barangay, Municipality"
                    rows={5}
                    value={watch('completeAddress')}
                    onChange={(e) => setValue("completeAddress", e.target.value.toUpperCase()) }
                    error={errors.completeAddress?.message}
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Textfield 
                        label="Emergency Contact Person"
                        placeholder="Full Name"
                        value={watch('emergencyContactPerson')}
                        registration={register('emergencyContactPerson')}
                        error={errors.emergencyContactPerson?.message}
                    />

                    <Textfield 
                        label="Emergency Contact Number"
                        placeholder="09XXXXXXXXX"
                        value={watch('emergencyContactNumber')}
                        registration={register('emergencyContactNumber')}
                        disabled={!watch('emergencyContactPerson')}
                        error={errors.emergencyContactNumber?.message}
                        type="number"
                    />
                </div>

                <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                    <h2 className="text-lg font-semibold text-[#1E3D15]">
                        Privacy Notice
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                        Your personal information will only be collected and used for
                        appointment processing, patient record management, and the
                        delivery of healthcare services. All information will be handled
                        confidentially in accordance with the Data Privacy Act of 2012.
                    </p>
                </div>

                <div className="flex justify-between">
                    <Button
                        className="px-6 flex gap-3 items-center bg-white border border-[#1E3D15] text-[#1E3D15] hover:bg-[#1E3D15] hover:text-white"
                        onClick={prev}
                        type="button"
                    >
                        <ArrowLeft />
                        Back
                    </Button>
                    <Button
                        className="px-6 flex gap-3 items-center"
                        type="submit"
                    >
                        Next
                        <ArrowRight size={20}/> 
                    </Button>
                </div>
            </form>
        </Card>
    )
}