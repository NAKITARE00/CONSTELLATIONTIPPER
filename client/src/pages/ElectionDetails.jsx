import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CustomButton } from '../components';
import { profile } from '../assets';


const ElectionDetails = () => {
    const { state } = useLocation();
    const { makeVote, viewResults, contract, address } = useStateContext()

    const [isLoading, setIsLoading] = useState(false);
    const [candidate, setCandidate] = useState([]);
    const [results, setResults] = useState([]);

    const fetchResults = async () => {
        const data = await viewResults(state.pId);
        setResults(data);
        console.log(data);

    }

    useEffect(() => {
        if (contract) fetchResults();
    }, [contract, address])

    const handleVote = async () => {
        setIsLoading(true);
        await makeVote(state.pId, candidate, state.voteToken)
        setIsLoading(false);
    }

    return (
        <div>
            {isLoading && 'Loading...'}
            <div className="w-full flex md:flex-row flex-col mt-10
            gap-[30px]">
                <div className="flex-1 flex-col">
                    <img src={state.image} alt="election" className="w-full 
                    h-[410px] object-cover rounded-xl"/>
                    <div className="relative w-full h-[5px] bg-[#3a3a43]">
                    </div>
                </div>
            </div>
            <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
                <div className="flex-[2] flex flex-col gao-[40px]">
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                            Creator
                        </h4>

                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[18px]">
                            <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                                <img src={profile} alt="user" className="w-[60%] h-[60%] object-contain" />
                            </div>
                            <div>
                                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.owner}</h4>
                                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">Token - {state.voteToken}</h4>
                                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]"></p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-[20px]">
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Candidates</h4>
                        <div className="mt-[20px] flex flex-col gap-4">
                            {state.candidateAddress && state.candidateAddress.length > 0 ? (
                                state.candidateAddress.map((candidateAddress, index) => (
                                    <div key={index} className="font-epilogue font-normal text-[16px] text-white">
                                        Candidate Address: {candidateAddress}
                                    </div>
                                ))
                            ) : (
                                <p className="font-epilogue font-normal text-[16px] text-[#808191] mt-2">No Candidates</p>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 mt-[20px]">
                        <h4 className="font-epilogue font-semibold text-[18px] 
                         text-white uppercase">
                            Vote
                        </h4>

                        <div className="my-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
                            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
                                Vote For Your Favorite
                            </p>
                            <div className="mt-[30px]">
                                <input type="text" placeholder="Enter Candidate Address"
                                    className="w-full bg-transparent rounded-[10px]
                                 border border-grey py-2 px-4 text-white 
                                 placeholder-white focus:outline-none focus:ring-2 
                                focus:ring-purple-600"
                                    value={candidate}
                                    onChange={(e) => setCandidate(e.target.value)}
                                />
                            </div>
                            <div className="my-[20px]">
                                <CustomButton
                                    btnType="button"
                                    title="VOTE"
                                    styles="w-full bg-[#8c6dfd]"
                                    handleClick={handleVote}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-epilogue font-semibold text-[18px] 
                         text-white uppercase">
                        Results
                    </h4>
                    <div>
                        {results.length > 0 ? results.map((item, index) => (
                            <div key={`${item.candidateAddress}-${index}`}
                                className="flex justify-between items-center gap-4"
                            >
                                <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
                                    {index + 1}. {item.candidateAddress}</p>
                                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
                                    {item.voteCount}</p>
                            </div>
                        )) : (
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No Votes</p>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ElectionDetails