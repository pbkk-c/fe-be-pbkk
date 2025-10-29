export default function FactBar({
  facts,
  opinion,
  hoax,
}: {
  facts: number;
  opinion: number;
  hoax: number;
}) {
  return (
    <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mt-4 flex shadow-inner">
      <div
        className="bg-blue-600 h-full flex items-center justify-center text-[12px] md:text-[13px] font-semibold text-white"
        style={{ width: `${facts}%` }}
      >
        {facts > 10 && `Facts ${facts}%`}
      </div>
      <div
        className="bg-yellow-400 h-full flex items-center justify-center text-[12px] md:text-[13px] font-semibold text-white"
        style={{ width: `${opinion}%` }}
      >
        {opinion > 10 && `Opinion ${opinion}%`}
      </div>
      <div
        className="bg-red-700 h-full flex items-center justify-center text-[12px] md:text-[13px] font-semibold text-white"
        style={{ width: `${hoax}%` }}
      >
        {hoax > 10 && `Hoax ${hoax}%`}
      </div>
    </div>
  );
}
