import { Item } from '@prisma/client';
import { NextPage } from 'next';
import { useState } from 'react';
import { Button } from '@/components/Form/Button';
import { TextInput } from '@/components/Form/TextInput';
import { Headline } from '@/components/Headline/Headline';

interface LoginPageProps {
  items: Item[];
}

const LoginPage: NextPage<LoginPageProps> = ({ items }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Headline id="new-items">Login</Headline>
      <label>
        <div>Username</div>
        <TextInput value={username} onChange={setUsername}/>
      </label>
      <label>
        <div>Password</div>
        <TextInput value={password} onChange={setPassword} type="password"/>
      </label>
      <div>
        <Button>Login</Button>
      </div>
    </div>
  );
};

export default LoginPage;
