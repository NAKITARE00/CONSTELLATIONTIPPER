import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { DisplayElections } from '../components';

import { useStateContext } from '../context';
import { CustomButton, FormField } from '../components';

const Profile = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { address, contract, getUserElections, make_Tip } = useStateContext();

    const [elections, setElections] = useState([]);
    const fetchElections = async () => {
        setIsLoading(true);
        const data = await getUserElections();
        setElections(data);
        setIsLoading(false);
    }
    useEffect(() => {
        if (contract) fetchElections();
    }, [address, contract]);
    return (
        <div className="bg-[#1c1c24] flex justify-center
        items-center flex-col rounded-[10px] sm:p-10p-4">

            <DisplayElections
                title="Elections"
                isLoading={isLoading}
                elections={elections}
            />
        </div>
    )
}

export default Profile