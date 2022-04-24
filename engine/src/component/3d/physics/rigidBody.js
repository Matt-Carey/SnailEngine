import { Component } from '../../component.js'
import { oimo } from '../../../../3rdparty/OimoPhysics/bin/js_modules/OimoPhysics.js';
import { 
    Mesh as ThreeMesh,
    MeshBasicMaterial as ThreeMeshBasicMaterial,
    SphereGeometry as ThreeSphereGeometry,
    BoxGeometry as ThreeBoxGeometry,
    CylinderGeometry as ThreeCylinderGeometry, 
    ConeGeometry as ThreeConeGeometry
    } from '../../../../3rdparty/three.js/build/three.module.js';
import { Vector } from '../../../math/vector.js';

const OimoShapeConfig = oimo.dynamics.rigidbody.ShapeConfig;
const OimoRigidBody = oimo.dynamics.rigidbody.RigidBody;
const OimoRigidBodyConfig = oimo.dynamics.rigidbody.RigidBodyConfig;
const OimoRigidBodyType = oimo.dynamics.rigidbody.RigidBodyType;
const OimoShape = oimo.dynamics.rigidbody.Shape;
const OimoVec3 = oimo.common.Vec3;
const OimoSphereGeometry = oimo.collision.geometry.SphereGeometry;
const OimoBoxGeometry = oimo.collision.geometry.BoxGeometry;
const OimoCylinderGeometry = oimo.collision.geometry.CylinderGeometry;
const OimoConeGeometry = oimo.collision.geometry.ConeGeometry;
const OimoCapsuleGeometry = oimo.collision.geometry.CapsuleGeometry;

class RigidBody extends Component {
    #geometry = null;
    #shapeConfig = null;
    #rigidBodyConfig = null;
    #rigidBody = null;
    #shape = null;

    #debugGeometry = null;
    #debugMesh = null;
    #debugMeshMat = null;

    constructor(init) {
        super(init);

        this.#geometry = null;
        const radius = init.meta.props?.radius ?? 0.5;
        const halfHeight = init.meta.props?.halfHeight ?? 0.5;
        const halfExtents = init.meta.props?.halfExtents;
        
        switch(init.meta.props?.shape) {
            case 'sphere':
                this.#geometry = new OimoSphereGeometry(radius);
                break;
            case 'box':
                this.#geometry = new OimoBoxGeometry(new OimoVec3(halfExtents?.x ?? 0.5, halfExtents?.y ?? 0.5, halfExtents?.z ?? 0.5));
                break;
            case 'cylinder':
                this.#geometry = new OimoCylinderGeometry(radius, halfHeight);
                break;
            case 'cone':
                this.#geometry = new OimoConeGeometry(radius, halfHeight);
                break;
            case 'capsule':
                this.#geometry = new OimoCapsuleGeometry(radius, halfHeight);
                break;
            default:
                console.log('Warning: RigidBody with unspecified init.meta.props.rigidBodyShape!');
                this.#geometry = new OimoSphereGeometry(radius);
                break;
        }

        this.#shapeConfig = new OimoShapeConfig();
		this.#shapeConfig.geometry = this.#geometry;

		this.#rigidBodyConfig = new OimoRigidBodyConfig();
		this.#rigidBodyConfig.type = OimoRigidBodyType.STATIC;
        switch(init.meta.props?.type) {
            case 'dynamic':
                this.#rigidBodyConfig.type = OimoRigidBodyType.DYNAMIC;
                break;
            case 'kinematic':
                this.#rigidBodyConfig.type = OimoRigidBodyType.KINEMATIC;
                break;
            case 'static':
                this.#rigidBodyConfig.type = OimoRigidBodyType.STATIC;
                break;
        }

		this.#rigidBodyConfig.position = new OimoVec3(0, 0, 0);

		this.#rigidBody = new OimoRigidBody(this.#rigidBodyConfig);
        this.#shape = new OimoShape(this.#shapeConfig);
		this.#rigidBody.addShape(this.#shape);

		this.world.physics.addRigidBody(this.#rigidBody);

        this.#debugGeometry = null;

        switch(init.meta.props?.shape) {
            case 'sphere':
                this.#debugGeometry = new ThreeSphereGeometry(radius);
                break;
            case 'box':
                this.#debugGeometry = new ThreeBoxGeometry((halfExtents?.x ?? 0.5) * 2, (halfExtents?.y ?? 0.5) * 2, (halfExtents?.z ?? 0.5) * 2);
                break;
            case 'cylinder':
                this.#debugGeometry = new ThreeCylinderGeometry(radius, halfHeight * 2);
                break;
            case 'cone':
                this.#debugGeometry = new ThreeConeGeometry(radius, halfHeight * 2);
                break;
            case 'capsule':
                this.#debugGeometry = new ThreeCylinderGeometry(radius, halfHeight * 2);
                break;
            default:
                this.#debugGeometry = new ThreeSphereGeometry(radius);
                break;
        }

        this.#debugMeshMat = new ThreeMeshBasicMaterial({color: 0xff0000, wireframe: true});
        this.#debugMesh = new ThreeMesh(this.#debugGeometry, this.#debugMeshMat);
        this.world.scene.add(this.#debugMesh);
    }

    fromJSON(json) {
        super.fromJSON(json);
    }

    toJSON() {
        const json = super.toJSON();
        return json;
    }

    prePhysTick() {
        if(this.#rigidBody != null) {
            const position = this.position;
            this.#rigidBody.setPosition(new OimoVec3(position.x, position.y, position.z));
            const rotation = this.rotation;
            this.#rigidBody.setRotationXyz(new OimoVec3(rotation.x, rotation.y, rotation.z));
        }
    }

    postPhysTick() {
        if(this.#rigidBody != null) {
            const physPosition = this.#rigidBody.getPosition();
            this.relativePosition = new Vector(physPosition.x, physPosition.y, physPosition.z);

            const physRotation = this.#rigidBody.getRotation().toEulerXyz();
            this.relativeRotation = new Vector(physRotation.x, physRotation.y, physRotation.z);
        }
    }

    tick(dt) {
        super.tick(dt);
        if(this.#debugMesh != null) {
            const position = this.position;
            this.#debugMesh.position.set(position.x, position.y, position.z);

            const rotation = this.rotation;
            this.#debugMesh.rotation.set(rotation.x, rotation.y, rotation.z);

            const scale = this.scale;
            this.#debugMesh.scale.set(scale.x, scale.y, scale.z);
        }
    }

}

export { RigidBody };
