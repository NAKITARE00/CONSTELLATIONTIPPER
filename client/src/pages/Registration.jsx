import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useStateContext } from '../context';

import { CustomButton } from '../components';

const Registration = () => {
    const navigate = useNavigate();
    const { registerTipper } = useStateContext();
    const { registerArtist } = useStateContext();
    const [role, setRole] = useState('Tipper'
        , 'Artist');
    const [name, setName] = useState('');

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name) {
            if (role === 'Tipper') {
                // Example: Call a function from your context to handle Tipper registration
                await registerTipper({ name });
            } else if (role === 'Artist') {
                // Example: Call a function from your context to handle Artist registration
                await registerArtist({ name });
            }
            navigate('/');
        }

    }
    return (
        <div className="bg-[#1c1c24]  mt-[90px] flex justify-center items-center flex-col rounded-[10px] sm:p-10p-4">
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] mt-[35px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[20px] text-[13px] leading-[25px] text-white">
                    Are you a Tipper or Artist?
                </h1>
            </div>
            <div onSubmit={handleSubmit} className=" flex flex-col gap-[30px] mt-[35px] ">
                <select value={role} onChange={handleRoleChange}
                    className="py-[18px] sm:px-[18px] px-[18px] border-[1px] border-[#3a3a43] 
                bg-[#1dc071] font-epilogue font-bold text-[#fff] text-[14px] S
                rounded-[10px] sm:min-w-[100px] flex flex-row
                ">
                    <option value="Tipper">
                        Tipper
                    </option>
                    <option value="Artist">
                        Artist
                    </option>
                </select>

                <div className="  lg:flex-1 flex flex-col justify-center items-center mt-[25px] max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] 
                    rounded-[100px]">
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Enter your name"
                        className="flex w-full font-epilogue font-normal 
                    text-[14px] placeholder:text-[#4b5264] text-white
                    bg-[#1c1c24] outline-none border-2 border-[#333333] rounded-md p-2"
                    />
                </div>
                <div className="flex justify-center items-center mt-[35px] mb-[35px] ">
                    <CustomButton
                        btnType="submit"
                        title="LET'S GO"
                        styles="bg-[#1dc071] "
                        handleClick={handleSubmit}
                    />
                </div>
            </div>

        </div >
    );
};

export default Registration;
