import { GLTFLoader } from './GLTFLoader.js';
import { EditorControls } from './EditorControls.js';

const PI = 3.14;

const posX = -0.7;
const posY = -1.2;
const posZ = 0;

const rotationX = PI/2;

let valuePhisic = 100, // const value
    pressurePhisic1 = 760,
    pressurePhisic2,
    pressurePhisic3,
    tempraturePhisyc = 297,
    temperaturePhisyc2,
    coef = 0.2857; // Farengate

document.getElementById('instructionBtn').onclick = function() {
    switchInstruction();
}

let isInstruction = false;
const instruction = document.querySelector('.instruction');
const laborator = document.querySelector('.laborator');

function switchInstruction() {
    isInstruction = !isInstruction;
    if (isInstruction) showInstruction();
    else hideInstruction();
}

function showInstruction() {
    instruction.classList.remove('visually-hidden');
    laborator.classList.add('visually-hidden');
}

function hideInstruction() {
    instruction.classList.add('visually-hidden');
    laborator.classList.remove('visually-hidden');
}

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    .01,
    1000
);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
let canvas = document.getElementById('machine').appendChild(renderer.domElement);

// Button on/off compressor
let isCompressOn = false;

// LOAD OBJECTS
let loader = new GLTFLoader();


// Monometr
let monometr;

let arrowPosX = posX + 1.36;
let arrowPosY = posY + 1.55;
let arrowPosZ = posZ - 0.49;

// Monometr Arrow
let arrow;
let arrowAngle = -PI/2;

loader.load('source/MonometrArrow.gltf', function(gltf){
    arrow = gltf.scene;
    scene.add(gltf.scene);

    
    arrow.position.set( arrowPosX, arrowPosY, arrowPosZ);
    arrow.rotation.set( rotationX, arrowAngle, 0);
});

// Turbine
let turbine;
let turbineAngle = 0;

let turbinePosX = posX - 0.27;
let turbinePosY = posY + 0.5;
let turbinePosZ = -1.4;

loader.load('source/Turbine.gltf', function(gltf){
    turbine = gltf.scene;
    scene.add(gltf.scene);

    turbine.position.set( turbinePosX, turbinePosY, turbinePosZ);
    turbine.rotation.set( turbineAngle, 0, 0);
});

// Stand
let stand;
loader.load('source/Stand.gltf', function(gltf){
    stand = gltf.scene;
    scene.add(gltf.scene);

    stand.position.set( posX + 0.3, posY + 0.5, -0.4);
    stand.rotation.set( rotationX, 0, 0);
});


// Valve
let valve;
let valvePosX = posX + 0.26;
let valvePosY = posY + 1.45;
let valvePosZ = -0.54;

const valveOpenPos = valvePosY + 0.03;
const valveClosedPos = valvePosY;
loader.load('source/Valve.gltf', function(gltf){
    valve = gltf.scene;
    scene.add(gltf.scene);

    valve.position.set( valvePosX, valvePosY, valvePosZ);
    valve.rotation.set( rotationX, 0, 0);
});

// Switch object
let Button;

let buttonPosX = posX + 2.2;
let buttonPosY = posY + 0.8;
let buttonPosZ = posZ - 0.75;

loader.load('source/Switch.gltf', function(gltf){
    Button = gltf.scene;
    scene.add(gltf.scene);
    
    Button.position.set( buttonPosX, buttonPosY, buttonPosZ);
    Button.rotation.set( rotationX, 0, 0);
});

let toggle;
const toogleSpeed = 0.03;

let togglePosX = buttonPosX;
let togglePosY = buttonPosY;
let togglePosZ = buttonPosZ;

const  toggleOn = buttonPosY + 0.215;
const  toggleOff = buttonPosY + 0.01;

loader.load('source/Switcher.gltf', function(gltf){
    toggle = gltf.scene;
    scene.add(gltf.scene);

    toggle.position.set( togglePosX, togglePosY + 0.01, togglePosZ);
    toggle.rotation.set( rotationX, 0, 0);
});

//
document.getElementById('turnOnOffCompress').onclick = function() {
    switchButton();
}

function switchButton() {
    isCompressOn = !isCompressOn;
    setCompressAlert();
    if (isCompressOn) {
        compressOnSound.play();
    }
    else {
        compressOnSound.stop();
    }
}

let dropPress = false;
document.getElementById('dropThePressure').onclick = function() {
    // open Valve
    dropPress = true;
    setValveAlert();
    switchSound();
}


let valveAlert = document.getElementById("valveAlert");
function setValveAlert() {
    if (dropPress)
        valveAlert.innerHTML = 'открыт';
    else 
        valveAlert.innerHTML = 'закрыт';

}

function switchSound() {
    if (dropPress)
        compressOffSound.play();
    else
        compressOffSound.stop();
}

// Light and Camera and Sound

camera.position.set( 0, 0, 2);
camera.rotation.set( 0, 0, 0);

let light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.setScalar(10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
//

scene.background = new THREE.Color(0xffffff);

const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const compressOnSound = new THREE.Audio( listener );
const compressOffSound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'source/compressOn.wav', function( buffer ) {
	compressOnSound.setBuffer( buffer );
	compressOnSound.setLoop( true );
	compressOnSound.setVolume( 0.3 );
});

audioLoader.load( 'source/compressOff.mp3', function( buffer ) {
	compressOffSound.setBuffer( buffer );
	compressOffSound.setLoop( true );
	compressOffSound.setVolume( 0.3 );
});

// Controls
let controls = new EditorControls( camera, renderer.domElement);


let mouse = new THREE.Vector2();


// mouse listener
document.addEventListener( 'mousedown', function( event ) {

}, false );

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

let compressAlert = document.getElementById("compressAlert");
function setCompressAlert() {
    if (isCompressOn)
        compressAlert.innerHTML = "включён";
    else 
        compressAlert.innerHTML = "выключён";
}

let pressureAlert = document.getElementById("pressureAlert");
function setPressureAlert(pressure) {
    pressureAlert.innerHTML = pressure;
}

function convertRadsToPressure(radians) {
    // convert to positive
    radians = Math.abs(radians);

    // start at 0
    radians -= PI/2;

    // convert from rads to degress
    return Math.floor(radians * 57);
}

function convertPressureToRads(pressure) {
    let radians = -(pressure / 57) - PI/2;
    return radians;
}

let preessureAtDegrees = 0;

let frameTime = Date.now(); 
// Actions

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    let delta = Date.now() - frameTime;
    frameTime = Date.now();
    
    // increase pressure 
    if (isCompressOn) {
        if (togglePosY <= toggleOn) {
            togglePosY += toogleSpeed;
            toggle.position.set( togglePosX, togglePosY, togglePosZ);
        }

        else if (arrowAngle > -2 * PI -PI/5) {
            setPressureAlert(convertRadsToPressure(arrowAngle));

            arrowAngle -= delta * getRandomNumber(0.0001, 0.0004);
            arrow.rotation.set( rotationX, arrowAngle, 0);

            pressurePhisic2 = convertRadsToPressure(arrowAngle) + pressurePhisic1;

            turbineAngle += 0.1;
            turbine.rotation.set( turbineAngle, 0, 0);
        }
        else {
            switchButton();
        }
    }
    else if (togglePosY >= toggleOff) {
        togglePosY -= toogleSpeed;
        toggle.position.set( togglePosX, togglePosY, togglePosZ);
        
    }

    if (!dropPress && !isCompressOn && arrowAngle > preessureAtDegrees) {
        arrowAngle -= delta * getRandomNumber(0.0001, 0.0005);
        arrow.rotation.set( rotationX, arrowAngle, 0);
        setPressureAlert(convertRadsToPressure(arrowAngle));
    }

    if (dropPress) {
        // degreess pressure to null -- set arrow degreess //
        if (arrowAngle <= -PI/2) {
            
            // only then valve is at open position //
            if (valvePosY <= valveOpenPos) {
                valvePosY += 0.03;
                valve.position.set(valvePosX, valvePosY, valvePosZ);
            }
            else {
                setPressureAlert(convertRadsToPressure(arrowAngle));
                arrowAngle += delta * getRandomNumber(0.0009, 0.0012);
                arrow.rotation.set( rotationX, arrowAngle, 0);
            }
        }
        // then arrow at null calculate pressure3 //
        else{
            arrowAngle = -PI / 2;
            arrow.rotation.set( rotationX, arrowAngle, 0);

            temperaturePhisyc2 = tempraturePhisyc / Math.pow(( pressurePhisic2 / pressurePhisic1), coef);
            pressurePhisic3 = (pressurePhisic1 * tempraturePhisyc) / temperaturePhisyc2 - pressurePhisic1;
            // +- 3 погрешность //
            pressurePhisic3 += getRandomNumber(-3, 3);

            preessureAtDegrees = convertPressureToRads(pressurePhisic3);
            console.log(pressurePhisic3);
            dropPress = false;
        }
    }
    else {
        setValveAlert();
        switchSound();
        
        // close valve
        if (valvePosY > valveClosedPos) {
            valvePosY -= 0.04;
            valve.position.set(valvePosX, valvePosY, valvePosZ);
        }
    }

}
animate();