import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "../../lib/store/authStore";
import {
    ProfileSchema,
    type ProfileFormData
} from "../../schemas/profileSchema";

import Textfield from "../ui/Textfield";
import Button from "../ui/Button";

interface ProfileProps {
    submit: (data : ProfileFormData) => void | Promise<void>;
    loading: boolean;
}

export default function Profile({
    submit,
    loading
} : ProfileProps) {
    const { user } = useAuthStore();

    const {
        formState: { errors },
        handleSubmit,
        register,
        reset,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                firstname: user.firstname,
                lastname: user.lastname,
            });
        }
    }, [user, reset]);
    
    const onSubmit = async (data: ProfileFormData) => { 
        const isConfirm = confirm( "Are you sure you want to save these changes to your profile?" ); 

        if (!isConfirm) return; 

        submit(data);

    };

    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#1E3D15]">
                        Profile
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage your personal information.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white border border-gray-200 rounded-xl p-6 space-y-5"
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

                    <div>
                        <Textfield 
                            label="Email"
                            value={user.email}
                            disabled

                        />

                        <p className="mt-1 text-xs text-gray-500">
                            Your email address cannot be changed.
                        </p>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={loading}>
                            Save Changes
                        </Button>
                    </div>
                </form>

            </div>

        </div>
    );
}
