import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { User } from '../types/types';

const ProfilePage = () => {
  const user: User | null = useSelector((state: RootState) => state.user.user);

  return (
    <div className='profile-page'>
      <h1>Profile</h1>
      {user && <p>Username: {user.username}</p>}
    </div>
  );
};

export default ProfilePage;
