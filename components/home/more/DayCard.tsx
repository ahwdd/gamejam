import { BiFoodMenu } from "react-icons/bi";
import { CiCalendar } from "react-icons/ci";
import { FaRegClock } from "react-icons/fa";
import { FiAward, FiClock, FiCode, FiCoffee, FiFlag, FiStar, FiUpload, FiUsers, FiZap } from "react-icons/fi";
import { HiOutlineLightBulb, HiOutlineSpeakerphone } from "react-icons/hi";
import { IoGameControllerOutline } from "react-icons/io5";
import { RiGroupLine } from "react-icons/ri";


export interface DayCardProps {
  day: {
    day: string;
    dateDay: string;
    date: string;
    events: Array<{
      time: string;
      key: string;
      activity: string;
      location: string;
      speaker?: string;
      note?: string;
    }>;
  };
  dayIndex: number;
}

export default function DayCard({ day, dayIndex }: DayCardProps) {

  const iconMap: { [key: string]: React.ReactNode } = {
    'calendar': <CiCalendar className="bg-[#BC3E2B] p-1 size-8 rounded-xl text-black" />,
    'group': <RiGroupLine className="bg-white p-2 size-8 rounded-xl text-black" />,
    'clock': <FaRegClock className="bg-[#C8A47F] p-2 size-8 rounded-xl text-white" />,
  };

  return (
    <div className="bg-neutral-800 border-4 border-neutral-800 rounded-3xl backdrop-blur-sm flex flex-col max-md:mx-[2%]"
        style={{boxShadow: "8px 8px 0px rgba(255, 255, 255, 0.4)"}}>
      <div className="text-white text-base md:text-lg p-4 md:px-6 rounded-t-3xl border-b-4 bg-[#C8A47F] border-b-white">
        <div className="space-y-0.5">
            <h3 className="">{day.day}</h3>
            <p className="">{day.dateDay}</p>
        </div>
        <p className="text-end -mt-3 md:-mt-6">{day.date}</p>
      </div>

      <div className="flex-1 p-4 flex flex-col items-start justify-between gap-5">
          {day.events.map((event, index) => {
            
            return (
              <div key={index} className="flex items-start justify-between gap-1.5 sm:gap-3 w-full">
                <div className="flex items-center gap-2 sm:gap-4 text-sm text-white">
                    {iconMap[event.key] || <FiClock />}

                    <div className="space-y-1">
                        <h4 className="leading-tight">
                            {event.activity}
                        </h4>
                        <p className="text-gray-300 text-xs mb-1">
                            {event.location}
                        </p>
                    </div>
                </div>
                <span className="font-mono text-xs text-[10px] sm:text-xs sm:whitespace-nowrap max-sm:w-8 max-sm:text-center">
                    {event.time}
                </span>


                    {/* {event.speaker && (
                        <p className="text-gray-500 text-xs italic">
                        {event.speaker}
                        </p>
                    )}

                    {event.note && (
                        <p className="text-gray-500 text-xs mt-2 italic">
                        {event.note}
                        </p>
                    )} */}
                </div>
            );
          })}
      </div>
    </div>
  );
}