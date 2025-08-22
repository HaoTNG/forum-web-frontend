import type {FC} from "react";

const Footer: FC = () => {
    return (
        <footer className="bg-gray-800 text-white text-center p-4">
            <p>© {new Date().getFullYear()} MiniBlog. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
