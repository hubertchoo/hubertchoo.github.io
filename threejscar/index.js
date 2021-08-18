// REMOVE START MENU ON ANY KEY CLICK
document.addEventListener("keydown", function(){
    if (document.getElementById("overlay").style.display != 'none'){
        document.getElementById("overlay").style.display = 'none';
    }
});

const { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } = window.MeshBVHLib;

// Make use of Three Mesh BVH to speed up raycasts
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

var debugFreeMoveMode = false;

const CAMERAPOSITION = new THREE.Vector3(0, 35, -50);
const VEHICLEPOSITION = new THREE.Vector3(1509, 0, -840);
var vehicle = new THREE.Object3D();
var vehicleTransparentBounds;
var vehicleLeftFrontWheel;
var vehicleRightFrontWheel;
var vehicleRearWheels;
var vehicleRedBrakingLights;
var vehicleYellowBrakingLights;

var streetObject = new THREE.Object3D();
var streetBarrierMeshArr;

// SCENE, CAMERA, AND RENDERER
let scene, camera, renderer;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight, .5, 10000);
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

// ORBIT CONTROLS
/*
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
grassTex.encoding = THREE.LinearEncoding;
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

const light = new THREE.PointLight( 0xffffff, 1, 10000 );
light.position.set( 0, 1000, -40 );
scene.add( light );


// VEHICLE LOADING

const glbLoader = new THREE.GLTFLoader();
function modelLoader(url) {
    return new Promise((resolve, reject) => {
        glbLoader.load(url, data=> resolve(data), null, reject);
    });
}



// Video Boards
function createVideoBoard(videoURL, desiredHeight, positionX, positionY, positionZ, rotationY, hasBacking){
    var aspectRatio;
    const video = document.createElement( 'video' );
    video.src = videoURL;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.addEventListener( "loadeddata", function (e) {
        console.log('video loaded');
        aspectRatio = this.videoWidth / this.videoHeight;
        const videoTexture = new THREE.VideoTexture( video );
        videoTexture.encoding = THREE.sRGBEncoding;
        videoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const videoBoardGeo = new THREE.BoxGeometry( aspectRatio * desiredHeight, desiredHeight, 0);
        const videoMaterial = new THREE.MeshBasicMaterial({ map:videoTexture, side: THREE.FrontSide });
        videoMaterial.map.minFilter = THREE.LinearFilter;
        videoMaterial.map.magFilter = THREE.LinearFilter;
        const videoBoard = new THREE.Mesh( videoBoardGeo, videoMaterial );

        // backing parent
        var parent = new THREE.Object3D();
        parent.add(videoBoard)
        videoBoard.position.set(0, 0, -5);
        if (hasBacking){
            videoBoard.position.set(0, 0, -3.5);
            var backingGeo = new THREE.BoxGeometry(aspectRatio * desiredHeight, desiredHeight, 5);
            var backingMaterial = new THREE.MeshBasicMaterial();
            var backing = new THREE.Mesh( backingGeo, backingMaterial, 0);
            parent.add(backing);
        }

        parent.position.set(positionX, positionY, positionZ);
        parent.rotateY(rotationY);
        scene.add( parent);
        video.play();
    }, false );
    video.load();
}


// Image Boards
function createImageBoard(imageURL, desiredHeight, positionX, positionY, positionZ, rotationY){
    var aspectRatio = 0;
    const imageTex = new THREE.TextureLoader().load( imageURL , function(imageTex){
        imageTex.encoding = THREE.sRGBEncoding;
        imageTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        aspectRatio = imageTex.image.width / imageTex.image.height;
        const imageMat = new THREE.MeshBasicMaterial( { map: imageTex } );
        imageMat.polygonOffset = true;
        imageMat.polygonOffsetUnit = -0.5;
        const imageBoardGeo = new THREE.BoxGeometry(aspectRatio * desiredHeight, desiredHeight, 0);
        const imageBoardMesh = new THREE.Mesh(imageBoardGeo, imageMat);

        // backing parent
        var parent = new THREE.Object3D();
        parent.add(imageBoardMesh);
        imageBoardMesh.position.set(0, 0, -4);
        var backingGeo = new THREE.BoxGeometry(aspectRatio * desiredHeight, desiredHeight, 5);
        var backingMaterial = new THREE.MeshBasicMaterial();
        var backing = new THREE.Mesh( backingGeo, backingMaterial);
        parent.add(backing);

        parent.position.set(positionX, positionY + desiredHeight/2, positionZ);
        parent.rotateY(rotationY);
        scene.add( parent);
    });
} 
// ABOUT ME
createImageBoard("image_boards/hi_im_hubert_v2.png", 40, 1440, 0, -735, -.35);
createImageBoard("image_boards/github.png", 20, 1570, 0, -540, .45);
createImageBoard("image_boards/email.png", 20, 1445, 0, -265, -.35);

// EDUCATION AND EXPERIENCE
createImageBoard("image_boards/experience.png", 20, 1510, 40, 130, 0);
createImageBoard("image_boards/rvhs.png", 50, 1430, 0, 550, 0);
createImageBoard("image_boards/dso_ascii.png", 50, 1300, 0, 1050, -0.4);
createImageBoard("image_boards/saf.png", 20, 800, 0, 1000, -1.5);
createImageBoard("image_boards/dsta.png", 40, 750, 0, 520, 2.5);
createImageBoard("image_boards/icl.png", 50, 600, 0, 35, -2.6);

// Image Board with Video 
// Video Position is from (0, 0) to (1, 1) aka bottom left to top right
function createImageBoardWithVideo(imageURL, desiredHeight, positionX, positionY, positionZ, rotationY,
    videoURL, desiredVidHeight, centerX, centerY){
    const imageTex = new THREE.TextureLoader().load( imageURL , function(imageTex){
        console.log("image loaded");
        imageTex.encoding = THREE.sRGBEncoding;
        imageTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        var aspectRatio = imageTex.image.width / imageTex.image.height;
        const imageMat = new THREE.MeshBasicMaterial( { map: imageTex } );
        const imageBoardGeo = new THREE.BoxGeometry(aspectRatio * desiredHeight, desiredHeight, 0);
        const imageBoardMesh = new THREE.Mesh(imageBoardGeo, imageMat);

        // backing parent
        var parent = new THREE.Object3D();
        parent.add(imageBoardMesh);
        imageBoardMesh.position.set(0, 0, -4);
        var backingGeo = new THREE.BoxGeometry(aspectRatio * desiredHeight, desiredHeight, 5);
        var backingMaterial = new THREE.MeshBasicMaterial();
        var backing = new THREE.Mesh( backingGeo, backingMaterial);
        parent.add(backing);

        parent.position.set(positionX, positionY + desiredHeight/2, positionZ);
        parent.rotateY(rotationY);
        scene.add( parent);

        var vidX = positionX - (desiredHeight * aspectRatio * (centerX - 0.5)) * Math.cos(rotationY);
        var vidY = desiredHeight * (centerY) + positionY;
        var vidZ = positionZ + (desiredHeight * aspectRatio * (centerX - 0.5)) * Math.sin(rotationY);
        createVideoBoard(videoURL, desiredVidHeight, vidX, vidY, vidZ, rotationY, false);
    });
}
// MY PROJECTS
createImageBoard("image_boards/my_projects.png", 20, 675, 40, -685, -3.1415);
createImageBoardWithVideo("image_boards/scribble.png", 50, 660, 0, -1385, -3, "video_boards/scribble.mp4", 25, 0.5, 0.5);
createImageBoard("image_boards/workoutbuddy_mockup.png", 50, 10, 0, -1525, -1.5);
createImageBoardWithVideo("image_boards/handmeshrecorder.png", 50, -65, 0, -1025, .3, "video_boards/handmeshrecorderv2.mp4", 25, 0.75, 0.5);
createImageBoardWithVideo("image_boards/holosandbox.png", 50, -235, 0, -625, -.3, "video_boards/holosandboxv2.mp4", 25, 0.72, 0.5);
//createVideoBoard("/video_boards/reactionwheelactuator.mp4", 25, -75, 15, -110, 0.35, true);
createImageBoard("image_boards/website_mockup.png", 50, -100, 0, 575, 0.3);
createImageBoard("image_boards/the_end.jpg", 50, -545, 0, 1070, -1.55);

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

// Check collisions between a mesh and an object
// firstMesh is Mesh type, intended to be the transparent box around the car
// secondObj is Object3D type, intended to be the object to check against
// eg road barriers
function collisionBetweenObj(firstMesh, firstObject, targetMeshArr, vehicleDir, vehicleSpeed){
    var hasCollided = false;
    var leftCollide = false;
    var rightCollide = false;
    const pos = firstMesh.geometry.attributes.position;
    const localVertex = new THREE.Vector3();
    var vehicleVelo = new THREE.Vector3();
    vehicleVelo.copy(vehicleDir);
    for (var vertexIndex = 0; vertexIndex < pos.count; vertexIndex++){
        localVertex.fromBufferAttribute( pos, vertexIndex );
        firstMesh.updateMatrixWorld();
        var globalVertex = localVertex.clone();
        globalVertex.applyMatrix4( firstMesh.matrixWorld );
        var directionVector = globalVertex.sub( firstObject.position );
        //var directionVector = globalVertex.sub( firstMesh.position );
        //var ray = new THREE.Raycaster( firstMesh.position, directionVector.clone().normalize() );
        var ray = new THREE.Raycaster( firstObject.position, directionVector.clone().normalize() );
        ray.firstHitOnly = true;
        var collisionResults = ray.intersectObjects( targetMeshArr );
        /*
        var collisionResults = ray.intersectObject( secondObj , true);
        */
        if (debugFreeMoveMode){
            vehicleVelo.multiplyScalar(vehicleSpeed);
            return [vehicleVelo, leftCollide, rightCollide];
        }
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
            hasCollided = true;
            // a collision occurred... do something...

            // check which side the collision happened at
            // it is a left collision if the vertex collided is on the left half of the vehicle
            var vehicleCollisionPoint = new THREE.Vector3();
            vehicleCollisionPoint.copy(collisionResults[0].point);
            vehicleCollisionPoint = firstObject.worldToLocal(vehicleCollisionPoint);
            if (vehicleCollisionPoint.x > 0){
                leftCollide = true;
            }
            else {
                rightCollide = true;
            }

            // get vehicle velocity
            vehicleVelo.normalize();
            vehicleVelo.multiplyScalar(vehicleSpeed);
            // get magnitude of velocity in component of face normal
            var nrfMagnitude = vehicleVelo.dot(collisionResults[0].face.normal.normalize());
            // get normal reaction force of collision
            var normalReactionForce = collisionResults[0].face.normal.normalize();
            normalReactionForce.multiplyScalar(nrfMagnitude);
            // subtract this vector from the initial vehicle velocity vector
            vehicleVelo.sub(normalReactionForce);
            

            //console.log("collision");
            break;
        }
    }
    
    if (!hasCollided){
        vehicleVelo.multiplyScalar(vehicleSpeed);
    }
    
    return [vehicleVelo, leftCollide, rightCollide];
}

// VEHICLE MOVEMENT PHYSICS
// https://asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html
var angle = Math.PI/2;
var vehicleSpeed = 0;
var tractionForce = 0;
var brakingForce = 0;
const DRAG_COEFF = 42.7 /2;
const ROLLING_RES_COEFF = 1280 /60; // rolling resistance coeff is rougly 30 times that of drag coeff
var wheelAngle = 0;
const MAX_WHEEL_ANGLE = 1;
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
        vehicleRedBrakingLights.visible = true; // show red braking lights
        vehicleYellowBrakingLights.visible = false; // hide yellow braking lights
    }
    else{
        vehicleRedBrakingLights.visible = false; // hide red braking lights
        vehicleYellowBrakingLights.visible = true; // show yellow braking lights
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

    var apparentNextX = vehicle.position.x + 10 * vehicleSpeed * vehicleDir.x * deltaTime;
    var apparentNextZ = vehicle.position.z + 10 * vehicleSpeed * vehicleDir.z * deltaTime;

    var collisionOutcome = collisionBetweenObj(vehicleTransparentBounds, vehicle, streetBarrierMeshArr, vehicleDir, vehicleSpeed);
    var velo = collisionOutcome[0];
    var leftCollide = collisionOutcome[1];
    var rightCollide = collisionOutcome[2];

    vehicleSpeed = velo.length();
    vehicleDir = velo.normalize();
    
    // calculate next vehicle position
    var deltaX = 10 * vehicleSpeed * vehicleDir.x * deltaTime;
    var deltaZ = 10 * vehicleSpeed * vehicleDir.z * deltaTime;
    var nextX = vehicle.position.x + deltaX;
    var nextZ = vehicle.position.z + deltaZ;
    if (vehicleSpeed > 0){
        //vehicle.lookAt(nextX, vehicle.position.y, nextZ);
        vehicle.lookAt(apparentNextX, vehicle.position.y, apparentNextZ);
    }
    
    vehicle.position.x = nextX;
    vehicle.position.z = nextZ;

    // gradually rotate tires when left/right arrows pressed
    if (keymap[37]){
        // left arrow key
        wheelAngle = Math.max( -MAX_WHEEL_ANGLE, Math.min(wheelAngle + 5/4/2 * deltaTime, MAX_WHEEL_ANGLE) )
        apparentWheelAngle = Math.max( -MAX_WHEEL_ANGLE, Math.min(apparentWheelAngle + 5 * deltaTime, MAX_WHEEL_ANGLE) )
    }
    if (keymap[39]){
        // right arrow key
        wheelAngle = Math.max( -MAX_WHEEL_ANGLE, Math.min(wheelAngle - 5/4 * deltaTime, MAX_WHEEL_ANGLE) )
        apparentWheelAngle = Math.max( -MAX_WHEEL_ANGLE, Math.min(apparentWheelAngle - 5 * deltaTime, MAX_WHEEL_ANGLE) )
    }

    // gradually return tires to center if left/right not pressed
    if (!keymap[37] && !keymap[39]){
        if (wheelAngle > 0){
            wheelAngle = Math.max(0, wheelAngle - 5 / 1 * deltaTime);
        }
        else if (wheelAngle < 0){
            wheelAngle = Math.min(0, wheelAngle + 5 / 1 * deltaTime);
        }
        if (apparentWheelAngle > 0){
            apparentWheelAngle = Math.max(0, apparentWheelAngle - 5 /1 * deltaTime);
        }
        else if (apparentWheelAngle < 0){
            apparentWheelAngle = Math.min(0, apparentWheelAngle + 5 /1 * deltaTime);
        }
    }

    // clamp the left or right side depending on which side there is collision
    // so that the car cannot continue to turn
    if (leftCollide){
        wheelAngle = Math.min(0, wheelAngle);
    }
    if (rightCollide){
        wheelAngle = Math.max(wheelAngle, 0);
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

    // rotate front wheels visually
    vehicleLeftFrontWheel.rotation.y = 0.5 * apparentWheelAngle/MAX_WHEEL_ANGLE; // left front wheel
    vehicleRightFrontWheel.rotation.y = 0.5 * apparentWheelAngle/MAX_WHEEL_ANGLE; // right front wheel
    // spin all wheels visually
    vehicleRearWheels.rotation.x += 2 * vehicleSpeed /25.75; // rear wheel (25.75 is rough max speed)
    vehicleLeftFrontWheel.children[0].rotation.x += 2 * vehicleSpeed /25.75; // left front wheel spin axis
    vehicleRightFrontWheel.children[0].rotation.x += 2 * vehicleSpeed /25.75; // right front wheel spin axis
}



// MAIN LOOP
var clock = new THREE.Clock();
clock.start();
var deltaTime = 0;
var firstFrameLoaded = false;
var reachedEnd = false;
function animate() {
    
    render();
    requestAnimationFrame(animate);
    // Put functions to run each frame below
    //controls.target = vehicle.position;
    //controls.update();
    var vehicleDir = new THREE.Vector3( 0, 0, 50 );
    vehicleDir.applyQuaternion( vehicle.quaternion );
    camera.lookAt(vehicleDir.add(vehicle.position));
    deltaTime = clock.getDelta();
    console.log(vehicle.position);
    if (vehicle.position.x <= -495){
        reachedEnd = true;
    }
    if (!reachedEnd){
        moveVehicle();
    }
    if (!firstFrameLoaded){
        scene.traverse(obj => obj.frustumCulled = true)
        firstFrameLoaded = true;
    }
    
}

// VEHICLE LOADING + Street Loading (BLOCKING CALL)
async function loadVehicle(){

    const vehicleGltf = await modelLoader('audiavant_wheels.glb');
    vehicleGltf.encoding = THREE.sRGBEncoding;
    const streetGltf = await modelLoader('street_barriers.glb');
    streetGltf.encoding = THREE.sRGBEncoding;
    const Z_OFFSET = 10;
    vehicleGltf.scene.position.z = Z_OFFSET;
    vehicleGltf.scene.scale.z = vehicleGltf.scene.scale.x = vehicleGltf.scene.scale.y = 10;
    vehicle.add (vehicleGltf.scene);
    vehicle.position.copy(VEHICLEPOSITION);
    
    scene.add(vehicle);
    console.log("vehicle loaded");
    vehicle.matrixAutoUpdate = true;
    // Assign parts of the vehicle to their variables
    vehicleLeftFrontWheel = vehicle.children[0].children[4];
    vehicleRightFrontWheel = vehicle.children[0].children[5];
    vehicleRearWheels = vehicle.children[0].children[3];
    vehicleRedBrakingLights = vehicle.children[0].children[7];
    vehicleYellowBrakingLights = vehicle.children[0].children[6];

    vehicleRedBrakingLights.visible = false; // hide red braking lights

    // create an invisible cube around the vehicle
    // it will be the bounding box for collision detection
    const boundingBoxGeo= new THREE.BoxGeometry( 18, 11, 40 );
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent:true, opacity:0} );
    const boundingBox = new THREE.Mesh( boundingBoxGeo, material );
    boundingBox.position = vehicle.position;
    boundingBox.position.z = Z_OFFSET;
    boundingBox.position.y = boundingBox.position.y + boundingBoxGeo.parameters.height/2;
    vehicle.add( boundingBox );
    vehicleTransparentBounds = vehicle.children[1];

    vehicle.add(camera); // make vehicle parent of camera for fpv view

    streetObject = streetGltf.scene;
    streetObject.position.y = 0.5;
    streetObject.scale.z = streetObject.scale.x = streetObject.scale.y = 50;
    //streetObject.rotation.y = Math.PI;
    scene.add(streetObject);

    // Compute bounds tree for all barriers to speed up collision detection
    streetBarrierMeshArr = streetObject.children[5].children;
    for (var meshIndex = 0; meshIndex < streetBarrierMeshArr.count; meshIndex++){
        streetBarrierMeshArr[meshIndex].geometry.computeBoundsTree();
    }
    renderer.compile(scene, camera);
    scene.traverse(obj => obj.frustumCulled = false)
    document.getElementById('gooey_overlay').style.display = 'none';
    document.getElementById('overlay').style.display = 'block';
    animate();
}

loadVehicle().catch(error => {
    console.error(error);
});



