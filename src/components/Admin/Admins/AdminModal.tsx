import { useForm } from "react-hook-form";
import Card from "../../ui/Card";
import Modal from "../../ui/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { promiseToast } from "../../../utils/utils";
import Textfield from "../../ui/Textfield";
import Button from "../../ui/Button";
import { useEffect } from "react";
import useCreateAdmin from "../../../hooks/admin/use-create-admin.hook";
import useUpdateAdmin from "../../../hooks/admin/use-update-admin.hook";
import { CreateUserSchema, UpdateUserSchema, type CreateUserFormData, type UpdateUserFormData } from "../../../schemas/userSchema";
import type { Admin } from "../../../types/admin.type";

interface AdminModalProps {
    show: boolean;
    admin: Admin | null;
    close: () => void;
}

export default function AdminModal ({
    close,
    show,
    admin
} : AdminModalProps) {
    const createAdminMutation = useCreateAdmin();
    const updateAdminMutation = useUpdateAdmin();

    const { 
        formState: { errors }, 
        handleSubmit, 
        reset,
        register,
    } = useForm<CreateUserFormData | UpdateUserFormData>({
        resolver: zodResolver(admin ? UpdateUserSchema : CreateUserSchema),
    })

    const onSubmit = (data : any) => {
        const isConfirm = confirm(`Are you sure you want to ${admin ? 'update' : 'create'} this admin?`);
        
        if(!isConfirm) return;

        promiseToast(admin ? updateAdminMutation.mutateAsync({ data, id: admin.id}) : createAdminMutation.mutateAsync(data))
    }

    useEffect(() => {
        if(admin){
            reset({
                firstname: admin.firstname,
                lastname: admin.lastname,
                email: admin.email,
            });
        }else {
            reset({
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                confirmPassword: ""
            });
        }
    }, [admin, show, reset])


    return (
        <Modal
            onClose={close}
            open={show}
        >
            <Card className="space-y-5">
                <h1 className="text-xl font-bold text-[#1E3D15]">
                    {admin ? 'Edit' : 'Create'} Admin
                </h1>
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                        label={`Password ${admin ? '(Optional)' : ''}`}
                        registration={register("password")}
                        placeholder="Enter Password"
                        error={errors.password?.message}
                        type="password"
                    />

                    <Textfield 
                        label={`Confirm Password ${admin ? '(Optional)' : ''}`}
                        registration={register("confirmPassword")}
                        placeholder="Confirm your password"
                        error={errors.confirmPassword?.message}
                        type="password"
                    />
                    
                    <div className="flex justify-end">
                        <Button type="submit" disabled={updateAdminMutation.isPending || createAdminMutation.isPending}>
                            {admin ? "Save Changes" : "Create Admin"}
                        </Button>
                    </div>
                </form>
            </Card>
        </Modal>
    )
}