window.module3D = {
    _texture: null,
    _texture2: null,
    _objectArgument: {},
    _getFilledImageBase64: function (width, height, color) {
        var canvasVar = document.createElement('canvas');
        canvasVar.width = width;
        canvasVar.height = height;
        var ctx = canvasVar.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        return canvasVar.toDataURL();
    },
    initialize: function (_objectArgument) {

        if (_objectArgument.objBackColorInside == null)
            _objectArgument.objBackColorInside = "#FFFFFF";
        if (_objectArgument.objBackColorOutside == null) {
            _objectArgument.objBackColorOutside = "#FFFFFF";
        }
        if (_objectArgument.envBackColor == null)
            _objectArgument.envBackColor = "#2c4d89";

        if (_objectArgument.object3D == null)
            _objectArgument.object3D = "iPhone5";

        if (_objectArgument.object3D == "iPhone5")
        var iPhoneOBJ = 'obj/iPhone5.obj';

        if (_objectArgument.object3D == "iPhone6")
        var iPhoneOBJ = 'obj/iPhone6.obj';

        this._objectArgument.objBackColorOutside = _objectArgument.objBackColorOutside;
    

        var canvasVar = document.createElement('canvas');
        canvasVar.width = 512;
        canvasVar.height = 512;
        var ctx = canvasVar.getContext("2d");
        ctx.fillStyle = _objectArgument.objBackColorOutside;
        ctx.fillRect(0, 0, 512, 512);
        window.defaultImage = canvasVar.toDataURL();

        var canvasVarBase = document.createElement('canvas');
        canvasVarBase.width = 512;
        canvasVarBase.height = 512;
        var ctxBase = canvasVarBase.getContext('2d');
        ctxBase.fillStyle = _objectArgument.objBackColorInside;
        ctxBase.fillRect(496, 488, 16, 24);
        window.defaultImageBase = canvasVarBase.toDataURL();


        var container;
        var camera, scene, renderer;
        var parentElementWidth = document.getElementById(_objectArgument.elID).offsetWidth;
        var parentElementHeight = document.getElementById(_objectArgument.elID).offsetHeight;
        var mouseX = 0, mouseY = 0;
        var width = parentElementWidth;
        var height = parentElementHeight;
        var windowHalfX = width / 2;
        var windowHalfY = height / 2;

        console.log(parentElementWidth, parentElementHeight);
        init();
        animate();


        function init() {

            container = document.createElement('div');
            container.setAttribute("id", "case");
            document.getElementById(_objectArgument.elID).appendChild(container);

           
            // scene

            scene = new THREE.Scene();

            var ambient = new THREE.AmbientLight(0xE5E5E5);
            scene.add(ambient);

            var light = new THREE.PointLight(0x979797, 0.45, 5000);
            light.position.set(0, 0, 50);
            scene.add(light);
            /**/
            var light2 = new THREE.PointLight(0x979797, 0.45, 5000);
            light2.position.set(0, 50, -50);
            scene.add(light2);


            var loader = new THREE.ImageLoader();

            loader.load(defaultImage, function (image) {
                if (window.module3D._texture === null) {
                    window.module3D._texture = new THREE.Texture();
                    window.module3D._texture.image = image;
                    window.module3D._texture.needsUpdate = true;
                }
            });


            /*---------------------$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$-----------------------------*/
            var texture2 = new THREE.Texture();
            window.module3D._texture2 = texture2;

            var loader2 = new THREE.ImageLoader();

            loader2.load(defaultImageBase, function (image2) {
                texture2.image = image2;
                texture2.needsUpdate = true;
            });


            var loaderOBJ = new THREE.OBJLoader();
            loaderOBJ.load(iPhoneOBJ, function (event) {
                var object = event;
                var geometry = object.children[0].geometry;
                var materials = [];

                materials.push(new THREE.MeshPhongMaterial({
                    map: window.module3D._texture,
                    transparent: true,
                    shininess: 50
                }));
                materials.push(new THREE.MeshPhongMaterial({
                    map: texture2,
                    transparent: true,
                    opacity: 1,
                    shininess: 50
                }));
                window.temp_material = materials[0];

                mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);

                // mesh.scale = new THREE.Vector3( 8,8,8 );
                mesh.position.y = -85;
                scene.add(mesh);

            });


            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(Math.max(window.devicePixelRatio, 1));
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);
            renderer.setClearColor(_objectArgument.envBackColor, 1);

            camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
            camera.position.z = 250;            
            //camera.position.x = 250;

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
            controls.enableDamping = true;
            controls.dampingFactor = 0.68;
            controls.enableZoom = true;


            controls.minDistance = 25;
            controls.maxDistance = 750;

            document.addEventListener('mousemove', onDocumentMouseMove, false);

            window.addEventListener('resize', onWindowResize, false);
        }

        function onWindowResize() {
            var parentElementWidth = document.getElementById(_objectArgument.elID).offsetWidth;
            var parentElementHeight = document.getElementById(_objectArgument.elID).offsetHeight;

            console.log(parentElementWidth, parentElementHeight);

            windowHalfX = width / 2;
            windowHalfY = height / 2;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(parentElementWidth, parentElementHeight);

        }

        function onDocumentMouseMove(event) {

            mouseX = ( event.clientX - windowHalfX ) / 2;
            mouseY = ( event.clientY - windowHalfY ) / 2;

        }

        function animate() {

            requestAnimationFrame(animate);
            render();

        }

        function render() {

            renderer.render(scene, camera);

        }
    },
    render_image: function (base64img) {
        var module3DThis = this;
        function set_image(image){
            if (window.module3D._texture === null) {
                window.module3D._texture = new THREE.Texture();
            }

            window.module3D._texture.image = image;
            window.module3D._texture.needsUpdate = true;
        }

        var userImage = new Image();
        var bgImage = new Image();
        var outputImage = new Image();


        function load1(){
            // Start Loading user selected image
            bgImage.onload = function(){
                var c = document.createElement('canvas');
                c.width = userImage.width;
                c.height = userImage.height;
                var ctx = c.getContext("2d");
                // Set image3 src as combined img1 && bgImage
                // Draw Case Outside Background
                ctx.drawImage(bgImage, 0, 0, c.width, c.height, 0, 0, c.width, c.height);
                // Draw user selected image
                ctx.drawImage(userImage, 0, 0, c.width, c.height, 0, 0, c.width, c.height);
                
                // window.temp_material.map = THREE.ImageUtils.loadTexture( c.toDataURL() );
                // window.temp_material.needsUpdate = true;

                //return;

                outputImage.onload = function(){
                    // Set outputImage (img1 && bgImage) as texture
                    set_image(outputImage);
                };
                outputImage.src = c.toDataURL();/**/
            };
            bgImage.src = module3DThis._getFilledImageBase64(userImage.width, userImage.height, module3DThis._objectArgument.objBackColorOutside);
        }

        userImage.onload = load1;  // Case Outside Background


        userImage.src = base64img;

    }
};
