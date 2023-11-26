import React from 'react'
import { tagType, thirdweb } from '../assets';


const ElectionCard = ({ electionName, voteToken, image, handleClick }) => {
    return (
        <div className="sm:w-[288px] w-full rounded=[15px]
        bg-[#1c1c24] cursor-pointer" onClick={handleClick}>
            <img
                src={image}
                alt="vote"
                className="w-[310px] h-[200px] rounded-[15px] object-cover rounded-[10px]"
            />

            <div className="flex flex-col p-4">
                <div className="flex flex-row items-center mb-[18px]">
                    <img src={tagType} alt="tag" className="w-[17px]
                   h-[17px] object-contain"/>
                </div>
                <div className="block">
                    <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">{electionName}</h3>
                </div>
            </div>
        </div>
    )
}

export default ElectionCard