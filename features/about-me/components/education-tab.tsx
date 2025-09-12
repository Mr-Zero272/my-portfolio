import { Dot } from 'lucide-react';

const EducationTab = () => {
  return (
    <div>
      <h1 className="mb-3 text-2xl font-bold tracking-wider">Education</h1>
      <p className="mb-7 text-gray-500">
        Below are details of my university studies as well as information about the short courses I attended.
      </p>
      <ul>
        <li className="group flex cursor-pointer flex-col gap-3 rounded-md border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg md:flex-row md:gap-10">
          <p className="group-hover:text-primary text-right transition-all duration-300 ease-in-out md:text-left">
            08/2020 – 12/2024
          </p>
          <div>
            <div className="flex">
              <Dot className="text-primary size-7" />
              <p>CTU</p>
            </div>
            <h2 className="ms-2 text-xl font-bold">Bachelor of Information Technology</h2>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default EducationTab;
