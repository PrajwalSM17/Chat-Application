import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuthStore } from '../../store/authStore';

interface StatusSelectorProps {
  currentStatus: string;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ currentStatus }) => {
  const { updateStatus } = useAuthStore();
  
  const statuses = [
    { value: 'Available', color: 'bg-green-500' },
    { value: 'Busy', color: 'bg-red-500' },
    { value: 'Away', color: 'bg-yellow-500' },
    { value: 'Offline', color: 'bg-gray-500' }
  ];
  console.log('currentStatus--->', currentStatus);

  const currentStatusObj = statuses.find(s => s.value === currentStatus) || statuses[0];

  const handleStatusChange = (status: 'Available' | 'Busy' | 'Away' | 'Offline') => {
    updateStatus(status);
  };

  return (
    <Menu as="div" className="relative inline-block text-left z-40">
      <Menu.Button className="flex items-center space-x-2 p-2 rounded-full hover:bg-primary-800 focus:outline-none">
        <div className={`h-3 w-3 rounded-full ${currentStatusObj.color}`}></div>
        <span className="text-sm font-medium text-gray-50">{currentStatus}</span>
      </Menu.Button>
      
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {statuses.map((status) => (
              <Menu.Item key={status.value}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-primary-50 text-gray-900' : 'text-gray-700'
                    } flex w-full items-center px-4 py-2 text-sm`}
                    onClick={() => handleStatusChange(status.value as any)}
                  >
                    <div className={`h-3 w-3 rounded-full ${status.color} mr-2`}></div>
                    {status.value}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default StatusSelector;