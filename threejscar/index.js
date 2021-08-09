const CAMERAPOSITION = new THREE.Vector3(0, 30, -100);
const VEHICLEPOSITION = new THREE.Vector3(0, 0, 100);

// SCENE, CAMERA, AND RENDERER
let scene, camera, renderer;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight, 0.1, 30000);
camera.position.copy(CAMERAPOSITION);

renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.outputEncoding =  THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

function render(){
    renderer.render(scene, camera);
}
render();
/*
// ORBIT CONTROLS
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target = VEHICLEPOSITION;
controls.update();

controls.minDistance = 100;
controls.maxDistance = 1500;
controls.maxPolarAngle = Math.PI/2 - 0.1;
*/

// SKYBOX
let materialArray = [];
let texture_ft = new THREE.TextureLoader().load('clouds1/clouds1_north.bmp');
texture_ft.anisotropy = renderer.capabilities.getMaxAnisotropy();
let texture_bk = new THREE.TextureLoader().load('clouds1/clouds1_south.bmp');
texture_bk.anisotropy = renderer.capabilities.getMaxAnisotropy();
let texture_up = new THREE.TextureLoader().load('clouds1/clouds1_up.bmp');
texture_up.anisotropy = renderer.capabilities.getMaxAnisotropy();
let texture_dn = new THREE.TextureLoader().load('clouds1/clouds1_down.bmp');
texture_dn.anisotropy = renderer.capabilities.getMaxAnisotropy();
let texture_rt = new THREE.TextureLoader().load('clouds1/clouds1_west.bmp');
texture_rt.anisotropy = renderer.capabilities.getMaxAnisotropy();
let texture_lf = new THREE.TextureLoader().load('clouds1/clouds1_east.bmp');
texture_lf.anisotropy = renderer.capabilities.getMaxAnisotropy();
    
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

for (let i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;
let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
let skybox = new THREE.Mesh( skyboxGeo, materialArray );
scene.add( skybox );  


// GROUND
var grassTex = new THREE.TextureLoader().load( 'grass_1.png' );
grassTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
grassTex.wrapS = THREE.RepeatWrapping; 
grassTex.wrapT = THREE.RepeatWrapping; 
grassTex.repeat.x = 256; 
grassTex.repeat.y = 256;

var groundMat = new THREE.MeshBasicMaterial({ map:grassTex, side: THREE.DoubleSide }); 
var groundGeo = new THREE.PlaneGeometry(10000, 10000); 
var ground = new THREE.Mesh(groundGeo,groundMat); 

ground.position.y = 0; //lower it 
ground.rotation.x = -Math.PI/2; //-90 degrees around the xaxis 


// IMPORTANT, draw on both sides ground.
doubleSided = true; 
scene.add(ground); 


// LIGHTING
const light = new THREE.PointLight( 0xffffff, 2, 10000 );
light.position.set( 0, 1000, -40 );
scene.add( light );

// VEHICLE LOADING
var vehicle = new THREE.Object3D();

const glbLoader = new THREE.GLTFLoader();
function modelLoader(url) {
    return new Promise((resolve, reject) => {
        glbLoader.load(url, data=> resolve(data), null, reject);
    });
}

// Video Boards
function createVideoBoard(videoID, desiredHeight, positionX, positionY, positionZ){
    const video = document.getElementById(videoID);
    video.addEventListener( "loadeddata", function (e) {
        var aspectRatio = this.videoWidth / this.videoHeight;
        const videoTexture = new THREE.VideoTexture( video );
        videoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const videoBoardGeo = new THREE.BoxGeometry( aspectRatio * desiredHeight, desiredHeight, 0);
        const videoMaterial = new THREE.MeshBasicMaterial({ map:videoTexture, side: THREE.FrontSide });
        videoMaterial.map.minFilter = THREE.LinearFilter;
        videoMaterial.map.magFilter = THREE.LinearFilter;
        const videoBoard = new THREE.Mesh( videoBoardGeo, videoMaterial );

        // backing parent
        var parent = new THREE.Object3D();
        parent.add(videoBoard)
        videoBoard.position.set(0, 0, -2.6);
        var backingGeo = new THREE.BoxGeometry(aspectRatio * desiredHeight, desiredHeight, 5);
        var backingMaterial = new THREE.MeshBasicMaterial();
        var backing = new THREE.Mesh( backingGeo, backingMaterial);
        parent.add(backing);

        parent.position.set(positionX, positionY, positionZ);
        scene.add( parent);
    }, false );
}
//createVideoBoard("video", 50, 0, 25, 200);

// TRACK ARROW KEYS
var keymap = {};
var onKeyDown = function(event) {
    keymap[event.keyCode] = true;
};
var onKeyUp = function(event){
    keymap[event.keyCode] = false;
    
};
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

// VEHICLE MOVEMENT PHYSICS
// https://asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html
var angle = Math.PI/2;
var vehicleSpeed = 0;
var tractionForce = 0;
var brakingForce = 0;
const DRAG_COEFF = 42.7 /2;
const ROLLING_RES_COEFF = 1280 /60; // rolling resistance coeff is rougly 30 times that of drag coeff
var wheelAngle = 0;
const MAX_WHEEL_ANGLE = 2.5;
const VEHICLE_MASS = 1500;
var apparentWheelAngle = 0;

function moveVehicle(){
    tractionForce = 0;
    if(keymap[38]){
        // up arrow key
        tractionForce = 7350/2;
    }
    if (keymap[40]){
        brakingForce = 7350 *2;
        vehicle.children[0].children[7].visible = true; // show red braking lights
        vehicle.children[0].children[6].visible = false; // hide yellow braking lights
    }
    else{
        vehicle.children[0].children[7].visible = false; // hide red braking lights
        vehicle.children[0].children[6].visible = true; // show yellow braking lights
    }

    // Dynamics calculations
    var dragForce = DRAG_COEFF * vehicleSpeed * vehicleSpeed;
    /*
    if (vehicleSpeed < 0){
        dragForce = -DRAG_COEFF * vehicleSpeed * vehicleSpeed;
    }
    */
    var rollingResistance = ROLLING_RES_COEFF * vehicleSpeed;
    if (vehicleSpeed == 0){
        brakingForce = 0;
    }
    var drivingForce = tractionForce - dragForce - rollingResistance - brakingForce;

    var acceleration = drivingForce / VEHICLE_MASS;
    vehicleSpeed += (deltaTime * acceleration);

    if (vehicleSpeed < 0){
        vehicleSpeed = 0;
    }
    // this is where the head of the vehicle is facing
    var vehicleDir = new THREE.Vector3( 0, 0, 1 );
    vehicleDir.applyQuaternion( vehicle.quaternion );

    // add wheel rotation to vehicleDir to find motion vector
    vehicleDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), wheelAngle * deltaTime);

    // calculate next vehicle position
    var deltaX = 10 * vehicleSpeed * vehicleDir.x * deltaTime;
    var deltaZ = 10 * vehicleSpeed * vehicleDir.z * deltaTime;
    var nextX = vehicle.position.x + deltaX;
    var nextZ = vehicle.position.z + deltaZ;
    if (vehicleSpeed > 0){
        vehicle.lookAt(nextX, vehicle.position.y, nextZ);
    }
    
    vehicle.position.x = nextX;
    vehicle.position.z = nextZ;

    // gradually rotate tires when left/right arrows pressed
    if (keymap[37]){
        // left arrow key
        wheelAngle = Math.max( -MAX_WHEEL_ANGLE, Math.min(wheelAngle + 5 * deltaTime, MAX_WHEEL_ANGLE) )
        apparentWheelAngle = Math.max( -MAX_WHEEL_ANGLE, Math.min(apparentWheelAngle + 5 * 4 * deltaTime, MAX_WHEEL_ANGLE) )
    }
    if (keymap[39]){
        // right arrow key
        wheelAngle = Math.max( -MAX_WHEEL_ANGLE, Math.min(wheelAngle - 5 * deltaTime, MAX_WHEEL_ANGLE) )
        apparentWheelAngle = Math.max( -MAX_WHEEL_ANGLE, Math.min(apparentWheelAngle - 5 * 4 * deltaTime, MAX_WHEEL_ANGLE) )
    }

    // gradually return tires to center if left/right not pressed
    if (!keymap[37] && !keymap[39]){
        if (wheelAngle > 0){
            wheelAngle = Math.max(0, wheelAngle - 5 * deltaTime);
        }
        else if (wheelAngle < 0){
            wheelAngle = Math.min(0, wheelAngle + 5 * deltaTime);
        }
        if (apparentWheelAngle > 0){
            apparentWheelAngle = Math.max(0, apparentWheelAngle - 5 * 2 * deltaTime);
        }
        else if (apparentWheelAngle < 0){
            apparentWheelAngle = Math.min(0, apparentWheelAngle + 5 * 2 * deltaTime);
        }
    }

    // limit tire angle at low speeds
    if (vehicleSpeed != 0){
        if (vehicleSpeed < 1){
            wheelAngle = Math.max( -0.25, Math.min(wheelAngle, 0.25));
        }
        else if (vehicleSpeed < 5){
            wheelAngle = Math.max( -0.5, Math.min(wheelAngle, 0.5));
        }
    }

    //console.log(apparentWheelAngle);
    //console.log(wheelAngle);
    //console.log(vehicleSpeed);

    // rotate front wheels visually
    vehicle.children[0].children[4].rotation.y = 0.5 * apparentWheelAngle/MAX_WHEEL_ANGLE; // left front wheel
    vehicle.children[0].children[5].rotation.y = 0.5 * apparentWheelAngle/MAX_WHEEL_ANGLE; // right front wheel
    // spin all wheels visually
    vehicle.children[0].children[3].rotation.x += 2 * vehicleSpeed /25.75; // rear wheel (25.75 is rough max speed)
    vehicle.children[0].children[4].children[0].rotation.x += 2 * vehicleSpeed /25.75; // left front wheel spin axis
    vehicle.children[0].children[5].children[0].rotation.x += 2 * vehicleSpeed /25.75; // right front wheel spin axis
    /*
    if (vehicleSpeed > 0){
        var num = Math.random()/200;
        vehicle.position.y = num; 
        camera.position.y = CAMERAPOSITION.y -num;
        vehicle.position.x = num; 
        camera.position.x = CAMERAPOSITION.x -num;
    }
    */
}

// MAIN LOOP
var clock = new THREE.Clock();
clock.start();
var deltaTime = 0;
function animate() {
    render();
    requestAnimationFrame(animate);
    // Put functions to run each frame below
    //controls.target = vehicle.position;
    //controls.update();
    camera.lookAt(vehicle.position);
    deltaTime = clock.getDelta();
    moveVehicle();
    

}

// VEHICLE LOADING (BLOCKING CALL)
async function loadVehicle(){
    const gltf = await modelLoader('audiavant_wheels.glb');
    const street = await modelLoader('street.glb');
    gltf.scene.position.z = 10;
    gltf.scene.scale.z = gltf.scene.scale.x = gltf.scene.scale.y = 10;
    vehicle.add (gltf.scene);
    vehicle.position.copy(VEHICLEPOSITION);
    vehicle.children[0].children[7].visible = false; // hide red braking lights
    scene.add(vehicle);
    console.log("vehicle loaded");
    console.log(vehicle.children[0]);
    vehicle.matrixAutoUpdate = true;
    street.scene.position.y = 0.5;
    street.scene.scale.z = street.scene.scale.x = street.scene.scale.y = 50;
    street.scene.rotation.y = Math.PI;
    scene.add(street.scene);
    vehicle.add(camera);
    animate();
}

loadVehicle().catch(error => {
    console.error(error);
});



