import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { tipper } from '../assets';
import { navlinks } from '../constants';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
    <div className={`w-[45px] h-[45px] rounded-[5px] p-[0] ${isActive && isActive === name && 'bg-[#2c2f32]'} flex justify-center items-center 
    ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
        {!isActive ? (
            <img src={imgUrl} alt="fund_logo" className="w-9/10 h-9/10" />
        ) : (
            <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
        )}
    </div>
)

const Sidebar = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState('dashboard');

    return (
        <div className="flex justify-between items-center flex-col sticky top-4 h-[80vh]">
            <Link to="/">
                <Icon styles="w-[72px] h-[58px] bg-[]" imgUrl={tipper} />
            </Link>

            <div className="  flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
                <div className="my-[105px] flex flex-col justify-center items-center gap-3">
                    {navlinks.map((link) => (
                        <Icon
                            key={link.name}
                            {...link}
                            isActive={isActive}
                            handleClick={() => {
                                if (!link.disabled) {
                                    setIsActive(link.name);
                                    navigate(link.link);
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Sidebar