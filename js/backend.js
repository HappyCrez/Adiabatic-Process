import { GLTFLoader } from './GLTFLoader.js';
import { EditorControls } from './EditorControls.js';

const posX = -0.7;          // Позиция установки в пространстве
const posY = -1.2;          // по трем осям X,Y,Z
const posZ = 0;             //
const rotationX = Math.PI/2;// поворот по X

// Окружение, настройка сцены: свет, камера, звук 
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    .01,
    1000
);

camera.position.set( 0, 0, 2);
camera.rotation.set( 0, 0, 0);

let light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.setScalar(10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
scene.background = new THREE.Color(0xffffff);

const listener = new THREE.AudioListener();
camera.add( listener );

const compressOnSound = new THREE.Audio( listener );
const compressOffSound = new THREE.Audio( listener );

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

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

let controls = new EditorControls( camera, renderer.domElement);
let canvas = document.getElementById('machine').appendChild(renderer.domElement);

// Загрузка объектов и задание их позиций
let loader = new GLTFLoader();

// Стрелка монометра
let arrowPosX = posX + 1.36;
let arrowPosY = posY + 1.55;
let arrowPosZ = posZ - 0.49;

let arrow;
let arrowAngleY = -Math.PI/2;

loader.load('source/MonometrArrow.gltf', function(gltf){
    arrow = gltf.scene;
    scene.add(gltf.scene);

    arrow.position.set( arrowPosX, arrowPosY, arrowPosZ);
    arrow.rotation.set( rotationX, arrowAngleY, 0);
});

// Турбина
let turbine;
let turbineAngle = 0;
let turbineIsLoaded = false;

let turbinePosX = posX - 0.27;
let turbinePosY = posY + 0.5;
let turbinePosZ = -1.4;

loader.load('source/Turbine.gltf', function(gltf){
    turbineIsLoaded = true;
    turbine = gltf.scene;
    scene.add(gltf.scene);

    turbine.position.set( turbinePosX, turbinePosY, turbinePosZ);
    turbine.rotation.set( turbineAngle, 0, 0);
});

// Стенд
let stand;
loader.load('source/Stand.gltf', function(gltf){
    stand = gltf.scene;
    scene.add(gltf.scene);

    stand.position.set( posX + 0.3, posY + 0.5, -0.4);
    stand.rotation.set( rotationX, 0, 0);
});


// Клапан
let valve;

const valveOpenPos = posY + 1.5;
const valveClosePos = posY + 1.43;

let valvePosX = posX + 0.26;
let valvePosY = valveClosePos;
let valvePosZ = -0.54;


loader.load('source/Valve.gltf', function(gltf){
    valve = gltf.scene;
    scene.add(gltf.scene);

    valve.position.set( valvePosX, valvePosY, valvePosZ);
    valve.rotation.set( rotationX, 0, 0);
});

// Корпус кнопки вкл/выкл
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

// Переключатель в кнопке
let toggle;
const toogleSpeed = 0.03;

let togglePosX = buttonPosX;
let togglePosY = buttonPosY;
let togglePosZ = buttonPosZ;

const  toggleOnPosY  = buttonPosY + 0.215;
const  toggleOffPosY = buttonPosY + 0.01;

loader.load('source/Switcher.gltf', function(gltf){
    toggle = gltf.scene;
    scene.add(gltf.scene);

    toggle.position.set( togglePosX, togglePosY + 0.01, togglePosZ);
    toggle.rotation.set( rotationX, 0, 0);
});

let isToggleOn = false;
let compressAlert = document.getElementById("compressAlert");

// Вкл/выкл компрессора
document.getElementById('toggleBtn').onclick = function () {toggleButton();}
function toggleButton() { if (isToggleOn) toggleOff(); else toggleOn();}

function toggleOn()  { isToggleOn = true; }

function toggleOff() { isToggleOn = false; }

let isValveOpen = false;

// Быстрое открытие и закрытие клапана
document.getElementById('dropThePressure').onclick = function() { openValve(); }

let valveAlert = document.getElementById('valveAlert');
// Спуск давления из системы
document.getElementById('reset').onclick = function() { openCloseValve(); }
function openCloseValve() {
    if (isValveOpen) closeValve();
    else openValve();
    pressurePhysic3 = stdPressure;
}


function openValve() {
    if (isValveOpen) return; // Открыть можно только закрытый
    isValveOpen = true;
    valveAlert.innerHTML = 'открыт';
    compressOffSound.play();

    temperaturePhysic2 = tempraturePhisyc / Math.pow(( actualPressure / stdPressure), farengateCoef);
    pressurePhysic3 = (stdPressure * tempraturePhisyc) / temperaturePhysic2 + getRandomNumber(-3, 3); // +- 3 погрешность
}

function closeValve() {
    if (!isValveOpen) return; // Закрыть можно только открытый
    isValveOpen = false;
    valveAlert.innerHTML = 'закрыт';
    compressOffSound.stop();
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

let pressureAlert = document.getElementById("pressureAlert");
function setPressureAlert(pressure) {
    pressureAlert.innerHTML = pressure;
}

function convertRadsToPressure(radians) {
    // convert to positive
    radians = Math.abs(radians);

    // start at 0
    radians -= Math.PI/2;

    // convert from rads to degress
    return Math.floor(radians * 57);
}

function convertPressureToRads(pressure) {
    return -(pressure / 57) - Math.PI/2;
}

let isCompressOn = false;
function turnCompressOn() {
    if (isCompressOn) return;   // включить можно только выключенный
    isCompressOn = true;
    compressAlert.innerHTML = "включён";
    compressOnSound.play();
}

function turnCompressOff() {
    if (!isCompressOn) return;  // выключить можно только включенный
    isCompressOn = false;
    compressAlert.innerHTML = "выключён";
    compressOnSound.stop();
}

const stdPressure = 760;
const maxPressure = stdPressure + 250;
const tempraturePhisyc = 297;
const farengateCoef = 0.2857;
let actualPressure = stdPressure;
let pressurePhysic3 = stdPressure;
let temperaturePhysic2;

let frameTime = Date.now();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    if (!turbineIsLoaded) return;

    let delta = Date.now() - frameTime;
    let pressureSpeed = delta * 0.01;
    let animationSpeed = delta * 0.0005;
    frameTime = Date.now();

    // Анимация (вкл) переключателя и условие включения компрессора
    if (isToggleOn) {
        if (togglePosY <= toggleOnPosY) togglePosY += animationSpeed;
        else turnCompressOn();
    }
    // Анимация (выкл) переключателя и условие выключения компрессора
    else if (togglePosY >= toggleOffPosY) togglePosY -= animationSpeed;
    else  turnCompressOff();
    
    // Включенный комперессор
    if (isCompressOn) {
       actualPressure += pressureSpeed; // Рост давления
       turbineAngle += 0.1;             // Поворот турбины
    }

    // Открытый клапан    
    if (isValveOpen) {
        if (valvePosY < valveOpenPos) valvePosY += animationSpeed; // Анимация открытия клапана
        actualPressure -= pressureSpeed * 4;    // Падение давления 
    }
    else if (valvePosY > valveClosePos) { 
        valvePosY -= animationSpeed;            // Анимация закрытия клапана
        actualPressure -= pressureSpeed * 4;    // Падение давления, пока клапан не закрыт
    } else closeValve();

    if (actualPressure < pressurePhysic3) actualPressure += pressureSpeed;

    // превышение(понижения) максимального(минимального) давления
    if (actualPressure < stdPressure) {
        actualPressure = stdPressure;
        closeValve();
    }
    if (actualPressure > maxPressure) {
        actualPressure = maxPressure;
        toggleOff();
    }
    updateAnimations(animationSpeed);
}
animate();


function updateAnimations(animationSpeed) {
    // Обновление позиции стрелки монометра в соответствии с давлением в системе
    arrow.rotation.set( rotationX, convertPressureToRads(actualPressure - stdPressure), 0);
    
    // Обновление статуса в таблице
    setPressureAlert((actualPressure - stdPressure).toFixed(0));
    
    // Поворот турбины
    turbine.rotation.set( turbineAngle, 0, 0);
    
    // Обновляем положение клапана
    valve.position.set(valvePosX, valvePosY, valvePosZ);

    // Обновляем положение переключателя
    toggle.position.set( togglePosX, togglePosY, togglePosZ);
}