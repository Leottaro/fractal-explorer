/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            spacing: {
                128: "32rem",
                144: "36rem",
            },
        },
        fontFamily: {
            poppins: ["Poppins"],
            robotomono: ["RobotoMono"],
        },
    },
    plugins: ["prettier-plugin-tailwindcss"],
};
