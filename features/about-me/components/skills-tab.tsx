import {
  Angular,
  Apachekafka,
  Cobol,
  Express,
  Java,
  Javascript,
  Microsoftsqlserver,
  Mongodb,
  Mysql,
  Nextjs,
  React,
  Redis,
  Spring,
  SpringSecurity,
  Typescript,
} from '@/components/icons';

const SkillsTab = () => {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-wider">Skills</h1>
      <p className="mb-7 text-gray-500">
        Below are the skills, technologies and programming languages ​​I am proficient in.
      </p>
      <div className="max-h-[380px] overflow-y-auto pb-10">
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="transition-all duration-300 ease-in-out group-hover:text-[#087ea4]">
              <React className="size-10" />
            </p>
            <div>
              <h3 className="text-xl font-bold">React</h3>
              <p className="">Proficient.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="transition-all duration-300 ease-in-out group-hover:text-red-500">
              <Angular className="size-10" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Angular</h3>
              <p className="">Intermediate.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="transition-all duration-300 ease-in-out group-hover:text-gray-900 dark:group-hover:text-white">
              <Nextjs className="size-10" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Next.js</h3>
              <p className="">Proficient.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="group-hover:text-primary transition-all duration-300 ease-in-out">
              <Spring className="size-10" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Spring Boot</h3>
              <p className="">Proficient.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="group-hover:text-primary transition-all duration-300 ease-in-out">
              <SpringSecurity className="size-10" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Spring Security</h3>
              <p className="">Proficient.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="transition-all duration-300 ease-in-out group-hover:text-gray-900">
              <Express className="size-10 dark:text-white" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Express</h3>
              <p className="">Intermediate.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="transition-all duration-300 ease-in-out group-hover:text-gray-900">
              <Apachekafka className="size-10 dark:text-white" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Apache Kafka</h3>
              <p className="">Intermediate.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="transition-all duration-300 ease-in-out group-hover:text-red-500">
              <Redis className="size-10" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Redis</h3>
              <p className="">Intermediate.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="transition-all duration-300 ease-in-out group-hover:text-[#f7df1e]">
              <Javascript className="size-10" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Javascript</h3>
              <p className="">Proficient.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="transition-all duration-300 ease-in-out group-hover:text-[#3178c6]">
              <Typescript className="size-10" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Typescript</h3>
              <p className="">Proficient.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="transition-all duration-300 ease-in-out group-hover:text-red-500">
              <Java className="size-10" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Java</h3>
              <p className="">Proficient.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="transition-all duration-300 ease-in-out group-hover:text-[#8aadf4]">
              <Cobol className="size-10" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Cobol</h3>
              <p className="">Intermediate.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="transition-all duration-300 ease-in-out group-hover:text-green-600">
              <Mongodb className="size-10" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Mongodb</h3>
              <p className="">Database.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="transition-all duration-300 ease-in-out group-hover:text-[#5797b2]">
              <Mysql className="size-10" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Mysql</h3>
              <p className="">Database.</p>
            </div>
          </li>
          <li className="group flex cursor-pointer gap-10 rounded-xl border border-transparent p-4 shadow-md hover:border-slate-100 hover:shadow-lg">
            <p className="transition-all duration-300 ease-in-out group-hover:text-[#c0595d]">
              <Microsoftsqlserver className="size-10" />
            </p>
            <div>
              <h3 className="text-xl font-bold">Sql server</h3>
              <p className="">Database.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SkillsTab;
