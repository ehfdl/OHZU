import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Dropdown({ drop, setDrop }: any) {
  return (
    <>
      {/* 웹 */}
      <Menu as="div" className="hidden sm:inline-block relative  text-left">
        <div>
          <Menu.Button
            aria-label="sort"
            className="inline-flex w-full justify-center  bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
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
          <Menu.Items className="absolute  z-10 mt-2 right-[0px]   w-[111px] text-center origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    onClick={() => setDrop("최신순")}
                    href="#"
                    className={classNames(
                      active ? "bg-second text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm active:bg-white active:text-primary"
                    )}
                  >
                    최신순
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    onClick={() => setDrop("인기순")}
                    href="#"
                    className={classNames(
                      active ? "bg-second text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm active:bg-white active:text-primary"
                    )}
                  >
                    인기순
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    onClick={() => setDrop("조화순")}
                    href="#"
                    className={classNames(
                      active ? "bg-second text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm active:bg-white active:text-primary"
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

      {/* 모바일 */}
      <Menu as="div" className="sm:hidden relative inline-block text-left">
        <div>
          <Menu.Button
            aria-label="sort"
            className="inline-flex relative right-6 w-full justify-center bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
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
          <Menu.Items className="absolute z-40 mt-2 right-4 w-[111px] text-center origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    onClick={() => setDrop("최신순")}
                    href="#"
                    className={classNames(
                      active ? "bg-second text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm active:bg-white active:text-primary"
                    )}
                  >
                    최신순
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    onClick={() => setDrop("인기순")}
                    href="#"
                    className={classNames(
                      active ? "bg-second text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm active:bg-white active:text-primary"
                    )}
                  >
                    인기순
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    onClick={() => setDrop("조회순")}
                    href="#"
                    className={classNames(
                      active ? "bg-second text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm active:bg-white active:text-primary"
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
    </>
  );
}
