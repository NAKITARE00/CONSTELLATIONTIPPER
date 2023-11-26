import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { CustomButton, FormField } from '../components';
import { useStateContext } from '../context';
const Vote = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [makeVote] = useStateContext();
    const [form, setForm] = useState({
        electionId: '',
        candidateAddress: '',
        voteToken: ''
    })
    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    }
    return (
        <div className="bg-[#1c1c24] flex justify-center items-center
         flex-col rounded-[10px] sm:p-10p-4">
            {isLoading && 'Loader...'}
            <div className="flex justify-center items-center
            p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[24px] text-[17px] leading-[37px]
                text-white">Vote For Your Favorite</h1>
            </div>
            <form onSubmit={handleSubmit} className="w-fullmt-[65px] flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[40px] mt-[40px]">
                    <FormField
                        labelName="Election ID *"
                        placeholder="Enter ElectionID"
                        inputType="text"
                        value={form.electionId}
                        handleChange={(e) => handleFormFieldChange
                            ('electionId', e)}
                    />
                    <FormField
                        labelName="Election Candidates *"
                        placeholder="Enter Candidate Address"
                        inputType="text"
                        value={form.candidateAddress}
                        handleChange={() => handleFormFieldChange
                            ('candidateAddress', e)}
                    />
                    <FormField
                        labelName="Election Token *"
                        placeholder="Enter Vote Token"
                        inputType="text"
                        value={form.voteToken}
                        handleChange={(e) => handleFormFieldChange
                            ('voteToken', e)}
                    />
                </div>
                <div className="flex justify-center items-center mt-[40px] mb-[40px] ">
                    <CustomButton
                        btnType="submit"
                        title="Vote"
                        styles="padding-[10px] bg-[#1dc071]"
                    // handleCick={() => {
                    //     navigate('add-candidates')
                    // }}
                    />
                </div>
            </form>
        </div >
    )
}

export default Vote