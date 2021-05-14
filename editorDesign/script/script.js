
        let scene;

        function init() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xdddddd);

            camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 5000);

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
            renderer.setSize(window.innerWidth,window.innerHeight);

            let loader = new THREE.GLTFLoader();
            loader.load('models/scene.gltf',function(gltf){
                scene.add(gltf.scene);
                renderer.render(scene,camera);
            });
        }

        init();