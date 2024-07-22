import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Modal } from './Modal';

export default {
  title: 'Components/Modal',
  component: Modal,
} satisfies Meta<typeof Modal>;

type Story = StoryObj<typeof Modal>;

export const Main: Story = {
  render: () => {
    const trackerIds = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    return (
      <Modal title="Add Tracker" isOpen={true}>
        <div className="flex w-[450px] flex-col gap-2">
          <p>
            Shipment <span className="text-blue">#SP21319732</span>
          </p>
          <p>
            Package <span className="text-blue">#PK21319732</span>
          </p>
          <div className="mt-6 flex flex-col">
            <label htmlFor="trackerId">Tracker ID:</label>
            <select className="rounded-md p-2" name="trackerId" id="trackerId">
              {trackerIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-10 flex gap-5">
            <Button className="blue-outlined">Back</Button>
            <Button className="blue">Save</Button>
          </div>
        </div>
      </Modal>
    );
  },
};
