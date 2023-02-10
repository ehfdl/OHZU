import Layout from "@/components/Layout";
import Head from "next/head";
import "tailwindcss/tailwind.css";
import Dropdown from "components/dropdown.jsx";

const Home = () => {
  return (
    <Layout>
      <div className="w-300 h-600 justify-center items-stretch mt-2 mb-4 p-3">
        <form>
          <label
            htmlFor="search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              id="search"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-yellow-200"
              placeholder="Search"
              required
            />
            <button
              type="submit"
              className="text-white absolute right-1.5 bottom-1.5 bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-2 py-1"
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex rows-1 items-center text-sm mt-2 mb-2 justify-between font-thin">
          <button className="bg-transparent hover:bg-transparent text-black py-2 px-4 border border-none hover:font-normal">
            ALL
          </button>
          <button className="bg-transparent hover:bg-transparent text-black py-2 px-4 border border-none hover:font-normal">
            소주
          </button>
          <button className="bg-transparent hover:bg-transparent text-black py-2 px-4 border border-none hover:font-normal">
            맥주
          </button>
          <button className="bg-transparent hover:bg-transparent text-black py-2 px-4 border border-none hover:font-normal">
            양주
          </button>
          <button className="bg-transparent hover:bg-transparent text-black py-2 px-4 border border-none hover:font-normal">
            ETC.
          </button>
        </div>

        <Dropdown />
        <div className="float-right mt-1.5 mr-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </div>

        <div className="border p-4 shadow mt-3">
          <div className="flex items-center mb-3 ml-3">
            <button className="w-8 h-8 rounded-full mr-4 bg-black" />
            <div className="text-sm mr-28">
              <p className="text-gray-900 leading-none">Nickname</p>
            </div>
            <div className="float-right ml-11">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
          </div>

          <div>
            <div className="h-60 bg-gray-100"></div>
            <div className="mt-4 ml-1">
              <div className="text-lg font-semibold">Title...</div>
              <div className="font-thin text-sm">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry...
              </div>
            </div>
          </div>
        </div>

        <div className="border p-4 shadow mt-5">
          <div className="flex items-center mb-3 ml-3">
            <button className="w-8 h-8 rounded-full mr-4 bg-black" />
            <div className="text-sm mr-28">
              <p className="text-gray-900 leading-none">Nickname</p>
            </div>
            <div className="float-right ml-11">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
          </div>

          <div>
            <div className="h-60 bg-gray-100"></div>
            <div className="mt-4 ml-1">
              <div className="text-lg font-semibold">Title...</div>
              <div className="font-thin text-sm">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry...
              </div>
            </div>
          </div>
        </div>

        <div className="border p-4 shadow mt-5">
          <div className="flex items-center mb-3 ml-3">
            <button className="w-8 h-8 rounded-full mr-4 bg-black" />
            <div className="text-sm mr-28">
              <p className="text-gray-900 leading-none">Nickname</p>
            </div>
            <div className="float-right ml-11">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
          </div>

          <div>
            <div className="h-60 bg-gray-100"></div>
            <div className="mt-4 ml-1">
              <div className="text-lg font-semibold">Title...</div>
              <div className="font-thin text-sm">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry...
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
