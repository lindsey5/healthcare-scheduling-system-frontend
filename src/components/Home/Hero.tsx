export default function Hero() {
    return (
        <section id="home" className="bg-white">
            <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left">
                    <span className="inline-block bg-green-100 text-[#1E3D15] px-4 py-2 rounded-full text-sm font-medium mb-4">
                        Barangay Bagumbayan Health Center
                    </span>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#1E3D15]">
                        Schedule Your Healthcare Appointments
                        <span className="text-green-600">
                            {" "}Anytime, Anywhere.
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-gray-600 max-w-2xl">
                        Book appointments online, receive QR code confirmations,
                        and avoid long waiting lines. The Bagumbayan Healthcare
                        Scheduling System provides residents with a faster,
                        easier, and more convenient way to access healthcare
                        services.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a
                            href="/appointment"
                            className="bg-[#1E3D15] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                        >
                            Book an Appointment
                        </a>

                        <a
                            href="#services"
                            className="border-2 border-[#1E3D15] text-[#1E3D15] px-6 py-3 rounded-lg font-semibold hover:bg-[#1E3D15] hover:text-white transition"
                        >
                            View Services
                        </a>
                    </div>
                </div>

                {/* Right Image */}
                <div className="flex-1 flex justify-center">
                    <img
                        src="/hero-healthcare.png"
                        alt="Healthcare Illustration"
                        className="w-full max-w-md lg:max-w-lg"
                    />
                </div>
            </div>
        </section>
    );
}