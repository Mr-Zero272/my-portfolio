import { Dot } from 'lucide-react';

const experiences = [
  {
    time: '05/2024 – 07/2024',
    company: 'Fujinet System company',
    position: 'Internship',
  },
  {
    time: '03/2025 – current',
    company: 'Teknix Corporation',
    position: 'Frontend Developer',
  },
];

const ExperiencesTab = () => {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-wider">Experiences</h1>
      <p className="mb-7 text-gray-500">My experiences...</p>
      <div className="max-h-[380px] overflow-y-auto pb-10">
        <ul>
          {experiences.map((item) => (
            <li
              key={item.time}
              className="group flex cursor-pointer flex-col gap-3 rounded-md border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg md:flex-row md:gap-10"
            >
              <p className="group-hover:text-primary text-right transition-all duration-300 ease-in-out md:text-left">
                {item.time}
              </p>
              <div>
                <div className="flex">
                  <Dot className="text-primary size-7" />
                  <p>{item.company}</p>
                </div>
                <h2 className="ms-2 text-xl font-bold">{item.position}</h2>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExperiencesTab;
