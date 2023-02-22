import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Dropdown({ drop, setDrop }: any) {
  console.log("드랍박스 state", drop);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center  bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          {drop}
          <ChevronDownIcon className="-mr-1  h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute  z-10 mt-2 w-[111px] text-center origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() => setDrop("인기순")}
                  href="#"
                  className={classNames(
                    active ? "bg-[#FFF0F0] text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm active:bg-white active:text-[#FF6161]"
                  )}
                >
                  인기순
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() => setDrop("최신순")}
                  href="#"
                  className={classNames(
                    active ? "bg-[#FFF0F0] text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm active:bg-white active:text-[#FF6161]"
                  )}
                >
                  최신순
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() => setDrop("조화순")}
                  href="#"
                  className={classNames(
                    active ? "bg-[#FFF0F0] text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm active:bg-white active:text-[#FF6161]"
                  )}
                >
                  조회순
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
