import React from 'react'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import { loader } from '../assets';
import { ElectionCard } from './'

const DisplayElections = ({ title, isLoading, elections }) => {
    const navigate = useNavigate();
    const handleNavigate = (election) => {
        navigate(`/election-details/${election.electionName}`,
            { state: election })
    }
    return (
        <div>
            <h1 className="font-epilogue font-semibold text-[18px]
            text-white text-left">
                {title} ({elections.length})
            </h1>

            <div className="flex flex-wrap mt-[20px] gap-[26px]">
                {isLoading && (
                    <img src={loader} className="w-{100px] h-[100px]
                        object-contain"
                    />
                )}

                {!isLoading && elections.length === 0 && (
                    <p className="font-epilogue font-semibold text-[14px
                    leading-[30px] text-[#818183]">
                        No Elections Made
                    </p>
                )}

                {!isLoading && elections.length > 0 && elections.map
                    ((election) => (<ElectionCard
                        key={uuidv4()}
                        {...election}
                        handleClick={() => handleNavigate(election)}
                    />))}
            </div>
        </div>
    )
}

export default DisplayElections