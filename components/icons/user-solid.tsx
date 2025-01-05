import React from 'react';

type Props = {
    className?: string;
    strokeWidth?: number;
};

const UserSolid = ({ className = '', strokeWidth = 1.5 }: Props) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            strokeWidth={strokeWidth}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.25 7C5.25 4.37665 7.37665 2.25 10 2.25C12.6234 2.25 14.75 4.37665 14.75 7C14.75 9.62335 12.6234 11.75 10 11.75C7.37665 11.75 5.25 9.62335 5.25 7ZM1.25 21C1.25 16.7198 4.71979 13.25 9 13.25H11C15.2802 13.25 18.75 16.7198 18.75 21C18.75 21.4142 18.4142 21.75 18 21.75H2C1.58579 21.75 1.25 21.4142 1.25 21Z"
                fill="#141B34"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 5C16 4.44772 16.4477 4 17 4L22 4C22.5523 4 23 4.44772 23 5C23 5.55229 22.5523 6 22 6L17 6C16.4477 6 16 5.55228 16 5ZM16 8C16 7.44772 16.4477 7 17 7L22 7C22.5523 7 23 7.44772 23 8C23 8.55229 22.5523 9 22 9L17 9C16.4477 9 16 8.55228 16 8ZM18.5 11C18.5 10.4477 18.9477 10 19.5 10H22C22.5523 10 23 10.4477 23 11C23 11.5523 22.5523 12 22 12H19.5C18.9477 12 18.5 11.5523 18.5 11Z"
                fill="#141B34"
            />
        </svg>
    );
};

export default UserSolid;
