import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai'

const Footer = () => {
  return (
    <footer>
      <ul className='d-flex '>
        <li><a rel="noopener noreferrer" target='_blank' href="https://github.com/khaituonq"><AiFillGithub/></a></li>
        <li><a rel="noopener noreferrer" target='_blank' href="https://www.linkedin.com/in/khaituonq/"><AiFillLinkedin/></a></li>
        {/* <li><a href=""><AiOutlineMail/></a></li> */}
      </ul>
      <p>Copyright ©{new Date().getFullYear()} All rights reserved | This template is made by <strong>khaituonq</strong> </p>
    </footer>
  )
}

export default Footer