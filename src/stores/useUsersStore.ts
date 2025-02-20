import { create } from 'zustand';
import { mockUsers } from '../../mock_data/users';

export const useUsersStore = create(() => ({
  users: mockUsers,
}));
