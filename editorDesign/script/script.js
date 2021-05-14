
let scene;

/**
 * DEBUG - GUI
 */
const gui = new dat.GUI()

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);

    sizes = {
        width: 800,
        height: 600
    }

    camera = new THREE.PerspectiveCamera(40, sizes.width/sizes.height, 1, 5000);

    /*camera.rotation.y = 45/180*Math.PI;*/
    camera.position.x = 5;
    camera.position.y = 6;
    camera.position.z = 20;


    //Lighting
    hlight = new THREE.AmbientLight (0x404040, 100);
    scene.add(hlight);


    //Connect to HTML canvas
    const canvashtml = document.querySelector('.renderPro')

    //Controls for 360 Rotation
    const controls = new THREE.OrbitControls(camera, canvashtml)
    controls.enableDamping = true
    


    //Render -> First create canvas in HTML
    renderer = new THREE.WebGLRenderer({
    //Connect HTML canvas
    canvas: canvashtml,
    })
    renderer.setSize(sizes.width, sizes.height);




    //GLTF Loader
    let loader = new THREE.GLTFLoader();
    loader.load('models/scene.gltf',function(gltf){
    pokemon = gltf.scene.children[0]
    pokemon.scale.set(0.5,0.5,0.5);

    //DEBUG

        //------SCALE
        gui.add(pokemon.scale,'x', -3, 3, 0.01  ).name( 'Scale X')
        gui.add(pokemon.scale,'y', -3, 3, 0.01 ).name( 'Scale Y')
        gui.add(pokemon.scale,'z', -3, 3, 0.01 ).name( 'Scale Z')


        //------POSITION
        gui.add(pokemon.position,'x', -3, 3, 0.01).name( 'Position X')
        gui.add(pokemon.position,'y', -3, 3, 0.01).name( 'Position Y')
        gui.add(pokemon.position,'z', -3, 3, 0.01).name( 'Position Z')

        //------ROTATION
        gui.add(pokemon.rotation,'x', -3, 3, 0.01).name( 'Rotation X')
        gui.add(pokemon.rotation,'y', -3, 3, 0.01 ).name( 'Rotation Y')
        gui.add(pokemon.rotation,'z', -3, 3, 0.01 ).name( 'Rotation Z')

    scene.add(gltf.scene);
    renderer.render(scene,camera);


    });



    // Animate
    const clock = new THREE.Clock()

    const tick = () =>
    {
const elapsedTime = clock.getElapsedTime()
//update Controls
controls.update()
// Render
renderer.render(scene, camera)

// Call tick again on the next frame
window.requestAnimationFrame(tick)
    }

    tick()
}
init();


