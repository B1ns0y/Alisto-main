import React from "react";
import Link from "next/link";

const AuthTerms: React.FC = () => {
  return (
    <div className="text-center text-[14px]">
      <p>
        By continuing with Google, you agree to AListō’s{" "}
        <Link href="/terms" className="text-[#007AFF] font-bold">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/terms/privacy" className="text-[#007AFF] font-bold">
          Privacy Policy.
        </Link>
      </p>
    </div>
  );
};

export default AuthTerms;
