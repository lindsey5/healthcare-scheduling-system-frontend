import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Card from "../../../components/ui/Card";
import Modal from "../../../components/ui/Modal";
import Textfield from "../../../components/ui/Textfield";
import Button from "../../../components/ui/Button";

import { promiseToast } from "../../../utils/utils";
import useCreateStaff from "../../../hooks/staff/use-create-staff.hook";
import useUpdateStaff from "../../../hooks/staff/use-update-staff.hook";
import {
    CreateUserSchema,
    UpdateUserSchema,
    type CreateUserFormData,
    type UpdateUserFormData,
} from "../../../schemas/userSchema";
import type { Staff } from "../../../types/staff.type";

interface StaffModalProps {
    show: boolean;
    staff: Staff | null;
    close: () => void;
}

export default function StaffModal({
    close,
    show,
    staff,
}: StaffModalProps) {
    const createStaffMutation = useCreateStaff();
    const updateStaffMutation = useUpdateStaff();

    const {
        formState: { errors },
        handleSubmit,
        reset,
        register,
    } = useForm<CreateUserFormData | UpdateUserFormData>({
        resolver: zodResolver(
            staff ? UpdateUserSchema : CreateUserSchema
        ),
    });

    const onSubmit = (data: any) => {
        const isConfirm = confirm(
            `Are you sure you want to ${
                staff ? "update" : "create"
            } this staff?`
        );

        if (!isConfirm) return;

        promiseToast(
            staff
                ? updateStaffMutation.mutateAsync({
                      data,
                      id: staff.id,
                  })
                : createStaffMutation.mutateAsync(data)
        );
    };

    useEffect(() => {
        if (staff) {
            reset({
                firstname: staff.firstname,
                lastname: staff.lastname,
                email: staff.email,
            });
        } else {
            reset({
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
        }
    }, [staff, show, reset]);

    return (
        <Modal onClose={close} open={show}>
            <Card className="space-y-5">
                <h1 className="text-xl font-bold text-[#1E3D15]">
                    {staff ? "Edit" : "Create"} Staff
                </h1>

                <form
                    className="space-y-5"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Textfield
                        label="First Name"
                        registration={register("firstname")}
                        placeholder="Enter first name"
                        error={errors.firstname?.message}
                    />

                    <Textfield
                        label="Last Name"
                        registration={register("lastname")}
                        placeholder="Enter last name"
                        error={errors.lastname?.message}
                    />

                    <Textfield
                        label="Email"
                        registration={register("email")}
                        placeholder="Enter email"
                        error={errors.email?.message}
                    />

                    <Textfield
                        label={`Password ${
                            staff ? "(Optional)" : ""
                        }`}
                        registration={register("password")}
                        placeholder="Enter password"
                        error={errors.password?.message}
                        type="password"
                    />

                    <Textfield
                        label={`Confirm Password ${
                            staff ? "(Optional)" : ""
                        }`}
                        registration={register("confirmPassword")}
                        placeholder="Confirm your password"
                        error={errors.confirmPassword?.message}
                        type="password"
                    />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={
                                createStaffMutation.isPending ||
                                updateStaffMutation.isPending
                            }
                        >
                            {staff
                                ? "Save Changes"
                                : "Create Staff"}
                        </Button>
                    </div>
                </form>
            </Card>
        </Modal>
    );
}