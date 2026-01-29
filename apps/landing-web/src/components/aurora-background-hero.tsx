import { motion } from "motion/react";
import { AuroraBackground } from "./ui/aurora-background";
import { Link } from "react-router";

export function AuroraBackgroundHero() {
    return (
        <AuroraBackground>
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="relative flex flex-col gap-4 items-center justify-center px-4"
            >
                <div className="text-3xl md:text-6xl font-bold dark:text-white text-center">
                    Real-time odds, powerful insights, and faster payouts
                </div>
                <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
                    —everything you need to stay ahead of the game.                </div>
                <Link to={"/auth/signup"} className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
                    Create account
                </Link>
                <Link to={"/admin/auth/login"} className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
                    Admin login
                </Link>
            </motion.div>
        </AuroraBackground>
    );
}
