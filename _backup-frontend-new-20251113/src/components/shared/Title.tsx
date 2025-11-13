interface TitleProps {
  primaryText: string;
  secondaryText: string;
}

export default function Title({ primaryText, secondaryText }: TitleProps) {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <p className="prata-regular text-orange-500 text-2xl">
        {primaryText}{' '}
        <span className="prata-regular text-gray-700 font-medium">
          {secondaryText}
        </span>
      </p>
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
    </div>
  );
}
