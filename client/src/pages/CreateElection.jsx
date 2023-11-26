import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useStateContext } from '../context';
import { CustomButton, FormField } from '../components';
import { checkIfImage } from '../utils';

const CreateElection = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { createElection } = useStateContext();
    const [candidates, setCandidates] = useState([]);
    const [form, setForm] = useState({
        electionName: '',
        voteToken: '',
        image: '',
        newCandidateAddress: '', // New input for candidate address
    });

    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value });
    };

    const addCandidate = () => {
        if (form.newCandidateAddress) {
            setCandidates([...candidates, form.newCandidateAddress]);
            setForm({ ...form, newCandidateAddress: '' }); // Clear the input field after adding
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedToken = ethers.utils.parseUnits(form.voteToken, 18);

        checkIfImage(form.image, async (exists) => {
            if (exists) {
                setLoading(true);
                console.log(candidates)
                await createElection(
                    form.electionName,
                    formattedToken,
                    form.image,
                    candidates,
                );

                setLoading(false);
                navigate('/');
            } else {
                alert('Provide a valid image URL');
                setForm({ ...form, image: '' });
            }
        });
    };
    return (
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10p-4">
            {loading && 'Loader...'}
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[24px] text-[17px] leading-[37px] text-white">Create Election</h1>
            </div>
            <form onSubmit={handleSubmit} className="w-[full] mt-[65px] flex flex-col gap-[30px] sm:min-w-[380px]">
                <div className="flex flex-col gap-[40px]">
                    <FormField
                        labelName="Election Name *"
                        placeholder="Your election's name"
                        inputType="text"
                        value={form.electionName}
                        handleChange={(e) => handleFormFieldChange('electionName', e)}
                    />
                    <FormField
                        labelName="Election Token *"
                        placeholder="Enter Vote Token"
                        inputType="text"
                        value={form.voteToken}
                        handleChange={(e) => handleFormFieldChange('voteToken', e)}
                    />
                </div>
                <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Election Profile Photo *"
                        placeholder="Election Photo URL"
                        inputType="url"
                        value={form.image}
                        handleChange={(e) => handleFormFieldChange('image', e)}
                    />
                </div>
                <div className="flex items-align flex-wrap gap-[20px]" >
                    <FormField
                        type="text"
                        labelName="Enter Candidate Address*"
                        placeholder="Enter Candidate Address"
                        value={form.newCandidateAddress}
                        handleChange={(e) => handleFormFieldChange('newCandidateAddress', e)}
                    />
                    <div className="my-[34px]">
                        <CustomButton
                            btnType="button"
                            title="Add"
                            styles="bg-[#1dc071]"
                            handleClick={addCandidate}
                        />
                    </div>
                </div>
                <div className="flex justify-center items-center mb-[30px]">
                    <CustomButton
                        btnType="submit"
                        title="Submit Election"
                        styles="bg-[#1dc071]"
                        handleClick={handleSubmit}
                    />
                </div>
            </form>
        </div>
    );
}

export default CreateElection;
