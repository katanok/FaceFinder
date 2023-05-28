import React, { Component } from 'react';
import './App.css';
import ParticlesBg from 'particles-bg'
import Navigation from './components/Navigation/Navigation';
import Register from './components/Register/Register';
import Signin from './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Entries from './components/Entries/Entries';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const initialState = {
  input: '',
  imageURL: '',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({ 
      user:{
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    const boxBorderPercentages = [];
    for (let i=0; i<data.outputs[0].data.regions.length; i++) {
      boxBorderPercentages.push(data.outputs[0].data.regions[i].region_info.bounding_box)
    }
    const boxes = [];
    for (let i=0; i<boxBorderPercentages.length; i++) {
      boxes.push({
        leftCol: boxBorderPercentages[i].left_col * width,
        topRow: boxBorderPercentages[i].top_row * height,
        rightCol: width - (boxBorderPercentages[i].right_col * width),
        bottomRow: height - (boxBorderPercentages[i].bottom_row * height)
      })
    }
    return boxes;
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    fetch('http://localhost:3001/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(result => {
      this.displayFaceBox(this.calculateFaceLocation(result));
      if (result) {
        this.updateEntryCount();
      }
    })
    .catch(error => console.log('error', error));
  }

  updateEntryCount = () => {
    fetch('http://localhost:3001/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id
        })
    })
    .then(response => response.json())
    .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }))
    })
    .catch(error => console.log('error', error))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    const { isSignedIn, imageURL, route, box, user } = this.state;
    return (
      <div className="App">
        <ParticlesBg className='particles' color="#ffffff" num={80} type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
          ? <div>
              <Logo />
              <Entries name={user.name} entries={user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit} 
              />
              <FaceRecognition box={box} imageURL={imageURL} />
            </div>
          : (
            route === 'signin' 
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
          )
          
        }
      </div>
    );
  }
  
}

export default App;
