
        let scene;

        function init() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xdddddd);

            sizes = {
                width: 800,
                height: 600
            }

            camera = new THREE.PerspectiveCamera(40, sizes.width/sizes.height, 1, 5000);

            /*camera.rotation.y = 45/180*Math.PI;*/
            //camera.position.x = 5;
            camera.position.y = 2;
            camera.position.z = 20;

            hlight = new THREE.AmbientLight (0x404040, 100);
            scene.add(hlight);


            
            //Connect to HTML canvas
            const canvashtml = document.querySelector('.renderPro')

            //Creating the GLTF Loader



            //Render -> First create canvas in HTML
            renderer = new THREE.WebGLRenderer({
                //Connect HTML canvas
                canvas: canvashtml,
            })
            renderer.setSize(sizes.width, sizes.height);

            let loader = new THREE.GLTFLoader();
            loader.load('models/scene.gltf',function(gltf){
                pokemon = gltf.scene.children[0]
                pokemon.scale.set(0.5,0.5,0.5);
                scene.add(gltf.scene);
                renderer.render(scene,camera);
            });
        }

        init();