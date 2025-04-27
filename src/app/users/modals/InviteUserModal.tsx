import usersRequest from '@/app/requests/users';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { useModalStore } from '@/stores/useModalStore';
import { Error } from '@/types/Error';
import { useState } from 'react';

export default function InviteUserModal() {
  const { isInviteUserOpen, closeInviteUser } = useModalStore();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Error[]>([]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    if (!email) {
      setErrors([{ message: 'Email is required', field: 'email' }]);
    }

    usersRequest
      .inviteUser(email)
      .then(() => {
        closeInviteUser();
      })
      .catch((e) => setErrors(e.response.data));
  };

  const handleCancel = () => {
    setEmail('');
    setErrors([]);
    closeInviteUser();
  };

  return (
    <Modal
      isOpen={isInviteUserOpen}
      setIsOpen={closeInviteUser}
      title='Invite user'
      submitText='Invite'
      cancelText='Cancel'
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    >
      <div className='py-[20px] h-[250px] w-[300px]'>
        <Input
          label='Email'
          placeholder='Enter email'
          fieldName='email'
          value={email}
          onChange={handleEmailChange}
          errors={errors}
        />
      </div>
    </Modal>
  );
}
