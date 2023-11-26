import React from 'react'

const FormField = ({ labelName, placeholder, inputType, value, handleChange }) => {
    return (
        <label className="flex-1 w-full flex flex-col">
            {labelName && (
                <span className="font-epilogue font-medium text-[15px] leading-[23px]
                text-[#808191] mb-[10px]">{labelName}</span>
            )}
            <input
                requiredvalue={value}
                onChange={handleChange}
                type={inputType}
                step="0.1"
                placeholder={placeholder}
                className="py-[15px] sm:px-[25px] px-[15px] 
                outline-none border-[1px] border-[#3a3a43] 
                bg-transparent font-epilogue text-white text-[14px] 
                placeholder:text-[#4b5264] 
                rounded-[10px] sm:min-w-[300px]
                focus:ring-2 focus:ring-purple-600
                "
            />

        </label>
    )
}

export default FormField