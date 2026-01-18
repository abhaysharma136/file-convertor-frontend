type ActionButtonProps = {
  buttonIcon?: React.ReactNode;
  buttonText: string;
  handleClick: () => void;
  isDisabled?: boolean;
  type?: "cta" | "secondary";
};

export default function ActionButton({
  buttonIcon,
  buttonText,
  handleClick,
  isDisabled = false,
  type = "secondary",
}: ActionButtonProps) {
  const baseClasses =
    "flex items-center justify-center w-full h-12 font-medium rounded-lg text-sm transition py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed gap-2";

  const ctaClasses =
    "bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed";

  const secondaryClasses =
    "bg-white text-black border border-gray-300 shadow-sm hover:bg-gray-50";

  return (
    <button
      className={`${baseClasses} ${
        type === "cta" ? ctaClasses : secondaryClasses
      }`}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {buttonIcon}
      {buttonText}
    </button>
  );
}
