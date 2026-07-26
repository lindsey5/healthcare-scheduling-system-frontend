import { HeartPulse, Users, CalendarCheck } from "lucide-react";

export default function About() {
    return (
        <section id="about" className="bg-[#1E3D15] text-white py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mt-3">
                       About Us
                    </h2>

                    <p className="mt-6 text-lg text-green-100 leading-8">
                        The <strong>Bagumbayan Healthcare Scheduling System </strong>
                        is designed to make healthcare services more accessible,
                        organized, and convenient for the residents of Barangay
                        Bagumbayan. Our platform enables patients to book
                        appointments online, receive QR code confirmations, and
                        reduce waiting times while helping healthcare staff manage
                        appointments efficiently.
                    </p>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mt-16">
                    <div className="bg-green-800/40 backdrop-blur-sm p-8 rounded-2xl border border-green-700 hover:bg-green-800/60 transition">
                        <HeartPulse
                            size={40}
                            className="text-green-300 mb-5"
                        />

                        <h3 className="text-2xl font-semibold mb-3">
                            Better Healthcare Access
                        </h3>

                        <p className="text-green-100">
                            Residents can conveniently schedule appointments
                            online without needing to wait in long queues at the
                            health center.
                        </p>
                    </div>

                    <div className="bg-green-800/40 backdrop-blur-sm p-8 rounded-2xl border border-green-700 hover:bg-green-800/60 transition">
                        <CalendarCheck
                            size={40}
                            className="text-green-300 mb-5"
                        />

                        <h3 className="text-2xl font-semibold mb-3">
                            Efficient Scheduling
                        </h3>

                        <p className="text-green-100">
                            QR code appointment confirmations and organized
                            schedules help improve patient flow and reduce waiting
                            times.
                        </p>
                    </div>

                    <div className="bg-green-800/40 backdrop-blur-sm p-8 rounded-2xl border border-green-700 hover:bg-green-800/60 transition">
                        <Users
                            size={40}
                            className="text-green-300 mb-5"
                        />

                        <h3 className="text-2xl font-semibold mb-3">
                            Community Focused
                        </h3>

                        <p className="text-green-100">
                            Built to support both patients and healthcare staff,
                            creating a more efficient and accessible healthcare
                            experience for the entire community.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}