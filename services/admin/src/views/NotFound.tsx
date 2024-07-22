import { Link } from 'react-router-dom';
import { Button } from '@ui/component/Button';

const Error = () => {
  return (
    <main className="flex items-center justify-center">
      <div className="bg-blue-light absolute inset-0 -z-30 flex flex-col items-center justify-center gap-16">
        <img src="/404.svg" alt="Content not found." />
        <Link to="/">
          <Button className="blue">GO TO THE HOMEPAGE</Button>
        </Link>
      </div>
    </main>
  );
};

export default Error;
