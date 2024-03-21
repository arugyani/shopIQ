import { Fragment } from "react";
import logo from "../../assets/logo.svg";

const team = [
  {
    name: "Prajwal",
    linkedin: "https://www.linkedin.com/in/prajwal-nellogi/",
  },
  {
    name: "Aru",
    linkedin: "https://www.linkedin.com/in/arugyani/",
  },
  {
    name: "Divyam",
    linkedin: "https://www.linkedin.com/in/divyamkhatri/",
  },
  {
    name: "Abhik",
    linkedin: "https://www.linkedin.com/in/abhik-kumar-ak15208/",
  },
  {
    name: "Junseok",
    linkedin: "https://www.linkedin.com/in/junseok-jang-49551a21b/",
  },
];

const Header = () => {
  return (
    <nav className='bg-white flex flex-row justify-between items-center py-3 border-b border-gray-400'>
      <img src={logo} className='logo w-147px' alt='Shop IQ Logo' />
      <h3 className='text-2xl font-thin tracking-tight'>
        By{" "}
        {team.map((person, index) => (
          <Fragment key={index}>
            <a href={person.linkedin} className='link'>
              {person.name}
            </a>
            {index !== team.length - 1 && `, `}
          </Fragment>
        ))}
      </h3>
    </nav>
  );
};

export default Header;
