import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import type { Meta, StoryObj } from '@storybook/react';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  autoClose?: number;
  hideProgressBar?: boolean;
  newestOnTop?: boolean;
  closeOnClick?: boolean;
  className?: string;
};

const DisplayComponent = ({ position = 'top-right', autoClose = 5000, hideProgressBar = true, newestOnTop = false, closeOnClick = true }: Props) => {
  const [counter, setCounter] = React.useState(0);

  const notify = () =>
    toast(`Notification ${counter}`, {
      className: 'bg-blue-500 text-red-500 text-xl p-5 rounded-lg',
    });

  return (
    <div>
      <button
        className="rounded-xl bg-blue-600 p-3 font-bold text-white"
        onClick={() => {
          notify();
          setCounter(counter + 1);
        }}
      >
        Show
      </button>
      <ToastContainer
        bodyClassName={'text-blue'}
        progressStyle={{ background: 'blue' }}
        position={position}
        autoClose={autoClose}
        hideProgressBar={hideProgressBar}
        newestOnTop={newestOnTop}
        closeOnClick={closeOnClick}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

const meta: Meta<any> = {
  title: 'Components/Snackbar',
  component: DisplayComponent,
};
export default meta;

type Story = StoryObj<any>;

export const Main: Story = {
  args: {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: true,
  },
  render: (args) => <DisplayComponent {...args} />,
};
