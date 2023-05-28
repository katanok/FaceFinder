import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageURL, box }) => {
  let boxList = box.map( (item, index) => {
    return <div key={index} className='bounding-box' style={{top: item.topRow, right: item.rightCol, left: item.leftCol, bottom: item.bottomRow}}></div>
  })
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='input-image' alt='' src={imageURL} width='500px' height='auto'/>
        {
          boxList
        }
      </div>
    </div>
  );
}

export default FaceRecognition;