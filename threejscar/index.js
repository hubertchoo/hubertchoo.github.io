const CAMERAPOSITION = new THREE.Vector3(0, 100, 100);
const VEHICLEPOSITION = new THREE.Vector3(0, 0, -40);
const VEHICLE_TURNING_RADIUS = 11;
const VEHICLE_MASS = 1500;

// SCENE, CAMERA, AND RENDERER
let scene, camera, renderer;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight, 0.1, 30000);
camera.position.copy(CAMERAPOSITION);

renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.outputEncoding =  THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

function render(){
    renderer.render(scene, camera);
}
render();

// ORBIT CONTROLS
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target = VEHICLEPOSITION;
controls.update();

controls.minDistance = 100;
controls.maxDistance = 1500;
controls.maxPolarAngle = Math.PI/2 - 0.1;

// SKYBOX
let materialArray = [];
let texture_ft = new THREE.TextureLoader().load('clouds1/clouds1_north.bmp');
let texture_bk = new THREE.TextureLoader().load('clouds1/clouds1_south.bmp');
let texture_up = new THREE.TextureLoader().load('clouds1/clouds1_up.bmp');
let texture_dn = new THREE.TextureLoader().load('clouds1/clouds1_down.bmp');
let texture_rt = new THREE.TextureLoader().load('clouds1/clouds1_west.bmp');
let texture_lf = new THREE.TextureLoader().load('clouds1/clouds1_east.bmp');
    
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
const light = new THREE.PointLight( 0xffffff, 1, 10000 );
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

function moveVehicle(){
    tractionForce = 0;
    if(keymap[38]){
        // up arrow key
        tractionForce = 7350 * 2;
    }
    if (keymap[40]){
        brakingForce = 7350 * 2 *2;
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
    var nextX = vehicle.position.x - VEHICLE_TURNING_RADIUS * Math.cos(-angle) * deltaTime * vehicleSpeed;
    var nextZ = vehicle.position.z - VEHICLE_TURNING_RADIUS * Math.sin(-angle) * deltaTime * vehicleSpeed;
    if (vehicleSpeed > 0){
        vehicle.lookAt(nextX, vehicle.position.y, nextZ);
    }
    /*
    else if (vehicleSpeed < 0){
        var dirX = vehicle.position.x - VEHICLE_TURNING_RADIUS * Math.cos(-angle) * deltaTime * -vehicleSpeed;
        var dirZ = vehicle.position.z - VEHICLE_TURNING_RADIUS * Math.sin(-angle) * deltaTime * -vehicleSpeed;
        vehicle.lookAt(dirX, vehicle.position.y, dirZ);
    }
    */
    vehicle.position.x = nextX;
    vehicle.position.z = nextZ;
    if (keymap[37]){
        // left arrow key
        wheelAngle = Math.max( -0.03, Math.min(wheelAngle + 0.06 * deltaTime, 0.03) ) //clamp the wheel angle betw -0.03 to 0.03
    }
    if (keymap[39]){
        // right arrow key
        wheelAngle = Math.max( -0.03, Math.min(wheelAngle - 0.06 * deltaTime, 0.03) )
    }
    if (!keymap[37] && !keymap[39]){
        if (wheelAngle > 0){
            wheelAngle = Math.max(0, wheelAngle - 0.06 * deltaTime);
        }
        else if (wheelAngle < 0){
            wheelAngle = Math.min(0, wheelAngle + 0.06 * deltaTime);
        }
    }
    if (vehicleSpeed != 0){
        if (vehicleSpeed < 5){
            angle += vehicleSpeed/26 * wheelAngle * 5; //26 is the max speed
        }
        else{
            angle += wheelAngle;
        }
    }
    
    console.log(vehicleSpeed);
}

// MAIN LOOP
var clock = new THREE.Clock();
clock.start();
var deltaTime = 0;
function animate() {
    render();
    requestAnimationFrame(animate);
    // Put functions to run each frame below
    controls.target = vehicle.position;
    controls.update();
    deltaTime = clock.getDelta();
    //console.log(1/deltaTime);
    moveVehicle();
}

// VEHICLE LOADING (BLOCKING CALL)
async function loadVehicle(){
    const gltf = await modelLoader('koenigsegg.glb');
    gltf.scene.position.z = 10;
    vehicle.add (gltf.scene);
    //vehicle = gltf.scene;
    vehicle.position.copy(VEHICLEPOSITION);
    scene.add(vehicle);
    console.log("vehicle loaded");
    vehicle.matrixAutoUpdate = true;
    animate();
}

loadVehicle().catch(error => {
    console.error(error);
});



