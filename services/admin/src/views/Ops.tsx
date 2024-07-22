import { Link } from 'react-router-dom';
import { Button } from '@ui/component/Button';

const Error = () => {
  return (
    <main className="flex items-center justify-center">
      <div className="bg-blue-light absolute inset-0 -z-30 flex flex-col items-center justify-center gap-8 text-center">
        <img className="w-[300px]" src="/error.svg" alt="An error occurred." />
        <section className="flex flex-col gap-4">
          <h1 className="red">Sorry, something went wrong.</h1>
          <p>
            An error occurred and your request could not be completed.
            <br />
            Please try again later or contact the support.
          </p>
        </section>
        <Link to={'/'}>
          <Button className="blue">GO TO THE HOMEPAGE</Button>
        </Link>
      </div>
    </main>
  );
};

export default Error;
