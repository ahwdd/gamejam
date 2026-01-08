import { Transition, motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react'

function MemberCard({ member, isMentor = false, className='' }: { member: any; isMentor?: boolean; className?: string }) {
  const fadeUpItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } as Transition }
  };

  return (
    <motion.div variants={fadeUpItem} 
    className={`relative max-w-48 rounded-2xl text-xs text-[10px] md:text-xs xl:text-sm flex flex-col items-center justify-center ${className}`}>
      <div className="aspect-square">
        <Image src={member.img} alt={member.enName} width={400} height={400}
          className="w-full object-cover rounded-3xl aspect-square"/>
      </div>
      
      <div className="flex flex-col justify-center items-center gap-1 p-3 md:p-4">
        <h3 className="text-white font-bold text-center leading-relaxed">
          <span className="inline-block whitespace-nowrap">{member.enName}</span>
          {' | '}
          <span className="inline-block whitespace-nowrap">{member.arName}</span>
        </h3>
        
        <p className="text-gray-300 text-center">
          <span className="inline-block whitespace-nowrap">{member.enRole}</span>
          {' | '}
          <span className="inline-block whitespace-nowrap">{member.arRole}</span>
        </p>
      </div>
    </motion.div>
  );
}

export const BilingualTitle = ({ enText, arText, className = "" }: { enText: string; arText: string; className?: string;}) => {
  return (
    <div className={`flex flex-row justify-between items-start md:items-center gap-2 md:gap-8 ${className}`}>
      <h2 className="text-base sm:text-lg md:text-2xl xl:text-4xl font-bold text-white text-left order-1 md:order-1">
        {enText}
      </h2>
      <h2 className="text-base sm:text-lg md:text-2xl xl:text-4xl font-bold text-white text-right order-2 md:order-2" dir="rtl">
        {arText}
      </h2>
    </div>
  );
};

export const BilingualDescription = ({ enText, arText, reverse = false }: { enText: string; arText: string; reverse?: boolean;}) => {
  return (
    <div className={`flex md:flex-row flex-col justify-between items-start gap-3 md:gap-8 md:mx-4 ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <p className="px-2 py-1 text-xs md:text-sm xl:text-base text-white/65 bg-white/5 rounded-lg text-left flex-1 order-1">
        {enText}
      </p>
      <p className="px-2 py-1 text-xs md:text-sm xl:text-base text-white/65 bg-white/5 rounded-lg text-right flex-1 order-2" dir="rtl">
        {arText}
      </p>
    </div>
  );
};

export default MemberCard