import { useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import useForgotPassword from "../../hooks/patient/use-forgot-password.hook";
import Textfield from "../../components/ui/Textfield";

export default function ForgotPassword() {
    const forgotPasswordMutation = useForgotPassword();

    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim()) return;

        forgotPasswordMutation.mutate(email.trim());
    };

    return (
        <section className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
            <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">

                {/* Left */}
                <div className="hidden lg:flex flex-col justify-center bg-[#1E3D15] text-white p-12">
                    <div className="w-16 h-16 rounded-2xl bg-green-800 flex items-center justify-center">
                        <ShieldCheck size={34} />
                    </div>

                    <h1 className="mt-8 text-4xl font-bold leading-tight">
                        Secure Account Recovery
                    </h1>

                    <p className="mt-5 text-green-100 text-lg leading-relaxed">
                        Securely recover your account and regain access to
                        the Barangay Bagumbayan Healthcare Scheduling System.
                    </p>

                    <span className="mt-8 bg-green-700 w-fit px-4 py-2 rounded-full text-sm font-medium">
                        Barangay Bagumbayan Health Center
                    </span>
                </div>

                {/* Right */}
                <div className="p-8 md:p-12 flex items-center">
                    <div className="w-full max-w-md mx-auto">

                        <h2 className="text-3xl font-bold text-[#1E3D15]">
                            Forgot Password?
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Enter your email address and we'll send you a
                            password reset link.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-5"
                        >
                            <Textfield
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                icon={<Mail size={20} />}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            {forgotPasswordMutation.isError && (
                                <p className="text-sm text-red-500">
                                    Something went wrong. Please try again.
                                </p>
                            )}

                            {forgotPasswordMutation.isSuccess && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <p className="text-sm text-green-700">
                                        If an account exists with that email,
                                        a password reset link has been sent.
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={
                                    forgotPasswordMutation.isPending ||
                                    !email.trim()
                                }
                                className="w-full bg-[#1E3D15] hover:bg-green-800
                                    disabled:bg-gray-400 disabled:cursor-not-allowed
                                    text-white font-semibold py-3 rounded-xl transition"
                            >
                                {forgotPasswordMutation.isPending
                                    ? "Sending..."
                                    : "Send Reset Link"}
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <a
                                href="/login"
                                className="text-sm text-[#1E3D15] font-medium hover:underline"
                            >
                                Back to Login
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}