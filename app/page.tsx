import type { FC } from 'react'

interface ComponentNameProps {
  propName: unknown;
}

const ComponentName: FC<ComponentNameProps> = ({ propName }) => {
  return <p className="text-3xl text-indigo-500">CryptoPulse</p>;
};

export default ComponentName;
