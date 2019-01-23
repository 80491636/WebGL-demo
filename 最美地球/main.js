//import THREE from 'three';
var scene,camera,renderer,controls;
var WIDTH,HEIGHT,sphere,mesh_cloud;
function initRender(){
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    renderer = new THREE.WebGLRenderer({
        antialias:true,
    })
    renderer.setSize(WIDTH,HEIGHT);
    renderer.setPixelRatio(WIDTH/HEIGHT);
    document.body.appendChild(renderer.domElement);
}
function initScene(){
    scene = new THREE.Scene();
}
function initCamera(){
    camera = new THREE.PerspectiveCamera(
        50,
        WIDTH / HEIGHT,
        1,
        10000,
    )
    camera.position.set(0,0,300);

    controls = new THREE.OrbitControls(camera,renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 1;
}
function initLight(){
    //环境光
    var light = new THREE.AmbientLight( 0x4d4d4d ); 
    scene.add( light );
    //聚光灯
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 300, 100, 400 );
    
    spotLight.castShadow = true;
    
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    
    scene.add( spotLight );
}
function initObject(){
    var tmap = new THREE.TextureLoader().load( 'img/earth4.jpg' );
    var tbumpMap = new THREE.TextureLoader().load('img/earth_bump.jpg');
    var tlarmap = new THREE.TextureLoader().load('img/earth_spec.jpg');
    var tcloud = new THREE.TextureLoader().load('img/earth_cloud.png');

    var geometry = new THREE.SphereGeometry( 100, 32, 32 );
    var material = new THREE.MeshPhongMaterial();
    sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );
    material.map = tmap;
    /*凹凸贴图用于为材质增加厚度。我们用到的凹凸贴图是一张灰度图，当然你也可以使用彩色图。像素的密集程度定义的是凹凸的高度，
    但是凹凸图只包含像素的相对高度，没有任何倾斜的方向信息。所以使用凹凸贴图所能表达的深度信息有限。*/
    material.bumpMap = tbumpMap;
    material.bumpScale = 10;
    /*我们可以通过设置高光贴图来实现部分区域反光。通过设置高光贴图，我们会发现，只有海洋部分会有发光，而陆地部分没有高光的效果。 
    与 specular 配合使用*/
    material.specularMap = tlarmap;
    //添加高光颜色
    material.specular = new THREE.Color(0x8cc2ff);
    //specular高亮的程度，越高的值越闪亮。默认值为 30
    material.shininess = 3;

    //云层
    var geometry = new THREE.SphereGeometry( 102, 32, 32 );
    //transparent png透明
    var material = new THREE.MeshPhongMaterial({map:tcloud,transparent:true});
    mesh_cloud = new THREE.Mesh( geometry, material );
    scene.add( mesh_cloud );
}
function initStatr(){
    initRender();
    initScene();
    initCamera();
    initLight();
    initObject();
    animation();
}
function animation(){
    requestAnimationFrame(animation);
    renderer.render(scene,camera);
    sphere.rotation.y += 0.007;
    mesh_cloud.rotation.y += 0.003
    controls.update();
}
