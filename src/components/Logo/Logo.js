import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import logo from './logo.svg'; 

const Logo = () => {
  return (
    <div className='ma4 mt0'>
      <Tilt className='Tilt br2 shadow-2' style={{width: '150px', height: '150px'}}>
        <div id='logo-div' className='pa3'>
          <img style={{paddingTop: '12px'}} src={logo} alt='logo'/>
        </div>
      </Tilt>
    </div>
  ); 
}

export default Logo;