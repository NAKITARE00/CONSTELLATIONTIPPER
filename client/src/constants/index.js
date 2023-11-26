import { createCampaign, dashboard, logout, payment, profile, withdraw } from '../assets';

export const navlinks = [
    {
        name: 'logout',
        imgUrl: logout,
        link: '/registration',
        disabled: false,
    },
    {
        name: 'dashboard',
        imgUrl: dashboard,
        link: '/',
    },
    {
        name: 'election',
        imgUrl: createCampaign,
        link: '/create-election',
    },
    {
        name: 'profile',
        imgUrl: profile,
        link: '/profile',
    },


];

