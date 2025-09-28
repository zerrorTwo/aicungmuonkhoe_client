import React from 'react';

interface ProfileHeaderProps {
    title: string;
    description: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, description }) => {
    return (
        <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
};

export default ProfileHeader;